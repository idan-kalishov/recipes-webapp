import { Request, Response } from 'express';
import { IComment } from '../models/commentsModel'; // Adjust the import path if needed
import Post from '../models/Post'; // Adjust the import path if needed
import CommentModel from '../models/commentsModel';
import {IUser} from "../models/User"; // Adjust the import path if needed

// Get all comments
const getAllComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await CommentModel.find();
        res.status(200).json(comments);
        return;
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get a comment by its ID
const getCommentById = async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.comment_id;
    try {
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        res.status(200).json(comment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get comments by postId
const getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
    const postId = req.query.post_id as string; // Casting query parameter to string

    try {
        const comments = await CommentModel.find({ postId: postId });
        res.status(200).json(comments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new comment
const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentBody = req.body as IComment;
        commentBody.user = (req.user as any)._id;


        // Create the comment
        const comment = await CommentModel.create(commentBody);

        // Update the associated post by adding the comment ID
        await Post.findByIdAndUpdate(
            commentBody.postId, // Ensure `postId` is passed in the request body
            { $push: { comments: comment._id } }, // Add the comment ID to the comments array
            { new: true, useFindAndModify: false } // Return updated post (optional)
        );

        res.status(201).json(comment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Update a comment by its ID
const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedComment = await CommentModel.findByIdAndUpdate(
            req.params.comment_id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!updatedComment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        res.status(200).json(updatedComment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a comment
const deleteComment = async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.comment_id;

    try {
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        const { postId } = comment;

        // Delete the comment
        await CommentModel.findByIdAndDelete(commentId);

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { comments: commentId } }, 
            { new: true, useFindAndModify: false }
        );

        if (!updatedPost) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export {
    getAllComments,
    getCommentById,
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment
};
