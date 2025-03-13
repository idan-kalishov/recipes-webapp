import mongoose, { Document, Schema } from "mongoose";
import { IComment } from "./commentsModel";

export interface IPost extends Document {
  title: string;
  content?: string;
  owner: mongoose.Types.ObjectId;
  comments: IComment[];
  imageUrl?: string;
  likes: mongoose.Types.ObjectId[]; // new field for likes
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  imageUrl: { type: String, required: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users", default: [] }],
});

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
