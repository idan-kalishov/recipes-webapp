import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/User";

// Function to generate tokens
export const generateTokens = (user: any) => {
  const payload = { _id: user._id, email: user.email };
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
    const user = req.user as any;
    console.log(user);
    if (!user) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    const tokens = generateTokens(user);
    if (!tokens) {
      res.status(500).json({ message: "Failed to generate tokens" });
      return;
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();

    res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
    res.redirect(
      `http://localhost:5173/verify-auth?userId=${user._id}&userName=${encodeURIComponent(user.userName)}&email=${encodeURIComponent(user.email)}&profilePicture=${encodeURIComponent(user.profilePicture || "")}`
    );
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
