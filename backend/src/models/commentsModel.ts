import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    user: string;
    message: string;
    date: Date;
    postId: mongoose.Types.ObjectId;
}

const commentSchema: Schema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
});

const CommentModel = mongoose.model<IComment>('Comment', commentSchema);

export default CommentModel;
