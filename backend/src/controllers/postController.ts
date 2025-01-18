import { Request, Response } from "express";
import Post from "../models/Post";

interface PostRequestBody {
  title?: string;
  content?: string;
  owner?: string;
}

// Add a New Post
const addPost = async (req: Request, res: Response): Promise<void> => {
  const { title, content, owner } = req.body as PostRequestBody;

  try {
    if (!title || !owner) {
      res.status(400).json({ error: "Title and owner are required." });
      return;
    }

    const newPost = new Post({ title, content, owner });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: "Error creating post." });
  }
};

// Get All Posts
const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find().populate("comments");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts." });
  }
};

// Get a Post by ID
const getPostById = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.post_id;

  try {
    const post = await Post.findById(postId).populate("comments");
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
      res.status(400).json({ error: "Sender ID is required in query parameter." });
      return;
    }

    const posts = await Post.find({ owner: sender }).populate("comments");
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
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, owner },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      res.status(404).json({ error: "Post not found." });
      return;
    }

    res.json(updatedPost);
  } catch (error) {
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

    res.status(200).json({ message: "Post deleted successfully.", deletedPost });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addPost,
  getAllPosts,
  getPostById,
  getPostsBySender,
  updatePost,
  deletePost,
};
