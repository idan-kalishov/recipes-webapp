import express, { Request, Response } from "express";
import * as postController from "../controllers/postController";
import authMiddleware from "../Middleware/authMiddleware";
import upload from "../utils/imageStorage";

const postRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         owner:
 *           type: string
 *           description: The owner id of the post
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           description: The URL of the image attached to the post (if any)
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs who liked the post
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: List of comment IDs associated with the post
 *       example:
 *         _id: 245234t234234r234r23f4
 *         title: My First Post
 *         content: This is the content of my first post.
 *         owner: 324vt23r4tr234t245tbv45by
 *         imageUrl: /uploads/example.jpg
 *         likes: []
 *         comments: []
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 */
postRouter.get("/", (req: Request, res: Response) =>
  postController.getAllPosts(req, res)
);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (optional)
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
postRouter.post(
  "/",
  authMiddleware,
  upload.single("imageUrl"), // Handle single file upload
  (req, res) => postController.addPost(req, res)
);

/**
 * @swagger
 * /posts/{post_id}:
 *   put:
 *     summary: Update a post
 *     description: Update an existing post by its ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the post
 *               content:
 *                 type: string
 *                 description: The updated content of the post
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: The updated image file (optional)
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
postRouter.put(
  "/:post_id",
  authMiddleware,
  upload.single("imageUrl"),
  (req, res) => postController.updatePost(req, res)
);

/**
 * @swagger
 * /posts/{post_id}:
 *   delete:
 *     summary: Delete a post by ID
 *     description: Delete a single post by its ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
postRouter.delete("/:post_id", authMiddleware, (req: Request, res: Response) =>
  postController.deletePost(req, res)
);

/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     summary: Like a post
 *     description: Add a like to a post by its ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to like
 *     responses:
 *       200:
 *         description: Post liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Post already liked or invalid request
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
postRouter.post("/:id/like", authMiddleware, postController.likePost);

/**
 * @swagger
 * /posts/{id}/unlike:
 *   delete:
 *     summary: Unlike a post
 *     description: Remove a like from a post by its ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to unlike
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Post not liked yet or invalid request
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
postRouter.delete("/:id/unlike", authMiddleware, postController.unlikePost);

/**
 * @swagger
 * /posts/user/{id}:
 *   get:
 *     summary: Get all posts by a specific user
 *     description: Retrieve all posts created by a user based on their user ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose posts are being fetched
 *     responses:
 *       200:
 *         description: A list of posts created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: No posts found for the specified user
 *       500:
 *         description: Server error
 */
postRouter.get("/user/:id", authMiddleware, postController.getUserPosts);

/**
 * @swagger
 * /posts/paginate:
 *   get:
 *     summary: Get paginated posts
 *     description: Retrieve a paginated list of posts with comments, owner, and likes populated.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to fetch (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: The number of posts per page (default is 6).
 *     responses:
 *       200:
 *         description: A paginated list of posts was successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of posts available.
 *       500:
 *         description: An error occurred while fetching posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
postRouter.get("/paginate", postController.getPaginatedPosts);

export default postRouter;
