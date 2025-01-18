import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import userModel from "../models/User";
import { Request, Response } from "express";

const callbackURL =
  process.env.NODE_ENV === "production"
    ? process.env.REDIRECT_URI_PRODUCTION
    : process.env.REDIRECT_URI_LOCAL;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ googleId: profile.id });
        if (!user) {
          user = await userModel.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

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

export const googleLoginHandler = (req: Request, res: Response) => {
  const user = req.user as any;
  const tokens = generateTokens(user);
  res.status(200).json(tokens);
};
