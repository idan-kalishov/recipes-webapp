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
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           description: The new username (optional)
 *         profilePicture:
 *           type: string
 *           format: binary
 *           description: The new profile picture (file upload, optional)
 *       required: []
 *     UpdateUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         profilePicture:
 *           type: string
 *           description: URL of the updated profile picture (if updated)
 *         userName:
 *           type: string
 *           description: Updated username (if updated)
 *       required:
 *         - message
 */

/**
 * @swagger
 * /user/update-user:
 *   put:
 *     summary: Update user details (username or profile picture)
 *     description: Update either the username or the profile picture (or both). At least one field must be provided.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       400:
 *         description: Invalid input (no fields provided)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
userRouter.put(
  "/update-user",
  authMiddleware,
  upload.single("profilePicture"),
  (req: Request, res: Response) => userController.updateUser(req, res)
);

export default userRouter;
