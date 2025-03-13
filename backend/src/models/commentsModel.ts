import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    user: mongoose.Types.ObjectId;
    message: string;
    date: Date;
    postId: mongoose.Types.ObjectId;
}

const commentSchema: Schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
});

const CommentModel = mongoose.model<IComment>('Comment', commentSchema);

export default CommentModel;
