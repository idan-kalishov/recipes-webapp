import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/User";

// Function to generate tokens
const generateTokens = (user: any) => {
  const payload = { _id: user._id, email: user.email };
  const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET!, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET!, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

// Handler for Google OAuth callback
export const googleLoginHandler = (req: Request, res: Response): void => {
  console.log("in the handler");
  try {
    const user = req.user as any;
    if (!user) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }
    const tokens = generateTokens(user);
    res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
    res.redirect("http://localhost:5173/verify-auth");
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
