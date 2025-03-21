import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel, { IUser } from "../models/User";
import { generateToken } from "./authController";


// Handler for Google OAuth callback
export const googleLoginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userFromOAuth = req.user as any; 

    if (!userFromOAuth || !userFromOAuth._id) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

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

    const tokens = generateToken(user._id);

    if(!tokens) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    res.redirect(
      `https://node32.cs.colman.ac.il/verify-auth?userId=${user._id}&userName=${encodeURIComponent(user.userName || "")}&email=${encodeURIComponent(user.email || "")}&profilePicture=${encodeURIComponent(user.profilePicture || "")}`
    );
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
