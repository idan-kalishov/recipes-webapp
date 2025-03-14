import express, { Request, Response } from "express";
import * as userController from "../controllers/userController";
import authMiddleware from "../Middleware/authMiddleware";
import upload from "../utils/imageStorage";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users API
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a single user by their ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The auto-generated ID of the user
 *                 userName:
 *                   type: string
 *                   description: The username of the user
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 profilePicture:
 *                   type: string
 *                   description: The filename of the user's profile picture
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.get("/:id", (req: Request, res: Response) =>
  userController.getUserById(req, res)
);

/**
 * @swagger
 * /users/update-user:
 *   put:
 *     summary: Update user details (including profile picture)
 *     description: Update user details such as username, email, and profile picture
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The new username
 *               email:
 *                 type: string
 *                 description: The new email
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: The new profile picture
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
userRouter.put(
  "/update-user",
  authMiddleware,
  upload.single("profilePicture"),
  (req: Request, res: Response) => userController.updateUser(req, res)
);

export default userRouter;
