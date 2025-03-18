import { Request, Response } from "express";
import Post from "../models/Post";
import userModel from "../models/User"; // Import your User model

interface PostRequestBody {
  title?: string;
  content?: string;
  owner?: string;
  imageUrl?: string;
}

// Add a New Post
const addPost = async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Handle file upload
  const owner = (req.user as any)._id;

  try {
    if (!title || !owner) {
      res.status(400).json({ error: "Title and owner are required." });
      return;
    }

    const newPost = new Post({ title, content, owner, imageUrl });
    const savedPost = await newPost.save();

    // Add the post ID to the user's posts array
    await userModel.findByIdAndUpdate(owner, {
      $push: { posts: savedPost._id },
    });

    res.status(201).json(savedPost);
    return;
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error creating post." });
  }
};

// Get All Posts
const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  const lastUpdateTime = req.query.lastUpdateTime as string;

  try {
    let query = {};
    if (lastUpdateTime) {
      query = { createdAt: { $gt: new Date(lastUpdateTime) } };
    }

    const posts = await Post.find(query)
      .populate({
        path: "comments",
        populate: { path: "user", select: "userName" },
      })
      .populate("owner", "userName")
      .populate("likes", "userName");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts." });
  }
};

const getPaginatedPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  try {
    const totalCount = await Post.countDocuments();
    const posts = await Post.find()
      .populate({
        path: "comments",
        populate: { path: "user", select: "userName" },
      })
      .populate("owner", "userName")
      .populate("likes", "userName")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ posts, totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching posts." });
  }
};

// Get a Post by ID
const getPostById = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.post_id;

  try {
    const post = await Post.findById(postId)
      .populate("comments")
      .populate({
        path: "comments",
        populate: { path: "user", select: "userName" },
      })
      .populate("owner", "userName")
      .populate("likes", "userName");
    if (!post) {
      res.status(404).json({ error: "Post not found." });
      return;
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post." });
  }
};

// Get Posts by Sender
const getPostsBySender = async (req: Request, res: Response): Promise<void> => {
  const sender = req.query.sender as string;

  try {
    if (!sender) {
      res
        .status(400)
        .json({ error: "Sender ID is required in query parameter." });
      return;
    }

    const posts = await Post.find({ owner: sender })
      .populate({
        path: "comments",
        populate: { path: "user", select: "userName" },
      })
      .populate("owner", "userName")
      .populate("likes", "userName");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts by sender." });
  }
};

// Update a Post
const updatePost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.post_id;
  const { title, content, owner } = req.body as PostRequestBody;

  try {
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, owner, imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      res.status(404).json({ error: "Post not found." });
      return;
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Error updating post." });
  }
};

// Delete a Post
const deletePost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.post_id;

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      res.status(404).json({ message: "Post not found." });
      return;
    }

    res
      .status(200)
      .json({ message: "Post deleted successfully.", deletedPost });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Like a post
const likePost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.id;
  const userId = (req.user as any)._id; // auth middleware should;  ה attach the user to req

  if (!userId) {
    res.status(401).send("User not authenticated");
    return;
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    // Check if user has already liked the post
    if (post.likes.includes(userId)) {
      res.status(400).send("Post already liked");
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error liking post" });
  }
};

// Unlike a post
const unlikePost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.id;
  const userId = (req.user as any)._id;

  if (!userId) {
    res.status(401).send("User not authenticated");
    return;
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    // Check if the user hasn't liked the post
    if (!post.likes.includes(userId)) {
      res.status(400).send("Post not liked yet");
      return;
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error unliking post" });
  }
};

const getUserPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ owner: userId })
      .populate({
        path: "comments",
        populate: { path: "user", select: "userName" },
      })
      .populate("owner", "userName")
      .populate("likes", "userName");

    if (!posts || posts.length === 0) {
      res.status(404).json({ message: "No posts found for this user" });
      return;
    }

    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addPost,
  getAllPosts,
  getPostById,
  getPostsBySender,
  getPaginatedPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getUserPosts,
};
