import express from "express";
const authRouter = express.Router();
import authController from "../controllers/authController";
import passport from "passport";
import { googleLoginHandler } from "../controllers/googleAuthController";
import authMiddleware from "../Middleware/authMiddleware";

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email, username, and password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               userName:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *             required:
 *               - email
 *               - userName
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 654b8f1a9c7d4a001c8e4f5b
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     userName:
 *                       type: string
 *                       example: john_doe
 *       400:
 *         description: Bad request (missing fields, invalid email, or password too short)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing email, password, or username
 *       500:
 *         description: Server error during registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred during registration
 */
authRouter.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticate a user using email and password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 654b8f1a9c7d4a001c8e4f5b
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     userName:
 *                       type: string
 *                       example: john_doe
 *                     profilePicture:
 *                       type: string
 *                       nullable: true
 *                       example: https://example.com/profile.jpg
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: wrong username or password
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */
authRouter.post("/login", authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generate new access and refresh tokens using a valid refresh token.
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Tokens refreshed successfully
 *       401:
 *         description: Missing or invalid refresh token
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Refresh token missing
 *       500:
 *         description: Server error while refreshing tokens
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Server error while generating tokens
 */
authRouter.post("/refresh", authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: Clear authentication cookies to log out the user.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully.
 *       500:
 *         description: Failed to log out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to log out.
 */
authRouter.post("/logout", authController.logout);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects the user to Google's OAuth consent screen for authentication.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen.
 */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     description: Processes the response from Google after user authentication.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to the frontend app or failure redirect URL.
 */
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleLoginHandler
);

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify user authentication
 *     description: Check if the user is authenticated by validating the JWT token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is authenticated
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
authRouter.get("/verify", authMiddleware, (req, res) => {
  res.status(200).json({ message: "User is authenticated" });
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user details
 *     description: Fetch details of the currently authenticated user.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 654b8f1a9c7d4a001c8e4f5b
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     userName:
 *                       type: string
 *                       example: john_doe
 *                     profilePicture:
 *                       type: string
 *                       nullable: true
 *                       example: https://example.com/profile.jpg
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not authenticated
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */
authRouter.get("/me", authMiddleware, authController.userDetails);

export default authRouter;
