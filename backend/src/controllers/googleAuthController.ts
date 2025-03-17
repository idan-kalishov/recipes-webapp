import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel, { IUser } from "../models/User";

// Function to generate tokens
export const generateTokens = (userId: string) => {
  const payload = { _id: userId };
  const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET!, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });
  const refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });
  return { accessToken, refreshToken };
};
// Handler for Google OAuth callback
export const googleLoginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userFromOAuth = req.user as any; // This is the user object returned by Passport.js or similar OAuth middleware

    if (!userFromOAuth || !userFromOAuth._id) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    // Fetch the full user object from the database using the _id
    const user = await userModel.findById(userFromOAuth._id).select({
      email: 1,
      userName: 1,
      profilePicture: 1,
      refreshToken: 1,
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Generate tokens
    const tokens = generateTokens(user._id);

    // Add the refresh token to the user's refresh token array
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();

    // Set cookies and redirect
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    res.redirect(
      `http://localhost:5173/verify-auth?userId=${user._id}&userName=${encodeURIComponent(user.userName || "")}&email=${encodeURIComponent(user.email || "")}&profilePicture=${encodeURIComponent(user.profilePicture || "")}`
    );
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
