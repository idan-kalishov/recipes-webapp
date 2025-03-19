import express, { Request, Response } from "express";
import * as commentsController from "../controllers/commentsController";
import authMiddleware from "../Middleware/authMiddleware"; // Adjust the import if necessary

const commentsRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve a list of all comments.
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error while fetching comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
commentsRoutes.get("/", (req: Request, res: Response) =>
  commentsController.getAllComments(req, res)
);

/**
 * @swagger
 * /comments/{comment_id}:
 *   get:
 *     summary: Get a comment by ID
 *     description: Retrieve a specific comment by its unique ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to retrieve
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment not found
 *       500:
 *         description: Server error while fetching the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
commentsRoutes.get("/:comment_id", (req: Request, res: Response) =>
  commentsController.getCommentById(req, res)
);

/**
 * @swagger
 * /comments/{post_id}:
 *   get:
 *     summary: Get comments by postId
 *     description: Retrieve all comments associated with a specific post ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to fetch comments for
 *     responses:
 *       200:
 *         description: A list of comments for the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error while fetching comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
commentsRoutes.get("/:post_id", (req: Request, res: Response) =>
  commentsController.getCommentsByPostId(req, res)
);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     description: Add a new comment to a specific post. Requires authentication.
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: This is a great post!
 *               postId:
 *                 type: string
 *                 example: 654b8f1a9c7d4a001c8e4f5b
 *             required:
 *               - message
 *               - postId
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request (missing fields or invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *       500:
 *         description: Server error while creating the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
commentsRoutes.post("/", authMiddleware, (req: Request, res: Response) =>
  commentsController.createComment(req, res)
);

/**
 * @swagger
 * /comments/{comment_id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete an existing comment by its ID. Requires authentication.
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment deleted successfully
 *       404:
 *         description: Comment or Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment not found
 *       500:
 *         description: Server error while deleting the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
commentsRoutes.delete(
  "/:comment_id",
  authMiddleware,
  (req: Request, res: Response) => commentsController.deleteComment(req, res)
);

/**
 * @swagger
 * /comments/{comment_id}:
 *   put:
 *     summary: Update a comment
 *     description: Update an existing comment by its ID. Requires authentication.
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Updated comment text
 *             required:
 *               - message
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment not found
 *       500:
 *         description: Server error while updating the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
commentsRoutes.put(
  "/:comment_id",
  authMiddleware,
  (req: Request, res: Response) => commentsController.updateComment(req, res)
);

export default commentsRoutes;
