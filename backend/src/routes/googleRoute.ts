import express from "express";
import passport from "passport";
import { googleLoginHandler } from "../controllers/googleAuthController";

const googleRouter = express.Router();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects the user to Google's OAuth consent screen for authentication.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen.
 */ googleRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback from Google OAuth after user authentication. On success, it generates and returns access and refresh tokens.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Returns access and refresh tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token.
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token.
 *       401:
 *         description: Authentication failed.
 *       500:
 *         description: Internal server error.
 */
googleRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleLoginHandler
);

export default googleRouter;
