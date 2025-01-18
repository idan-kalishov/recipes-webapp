import mongoose, { Schema } from "mongoose";
import { IPost } from "./Post";

export interface IUser {
  _id?: string;
  email: string;
  password?: string; // Optional for Google accounts
  refreshToken?: string[];
  post?: IPost;
  googleId?: string; // New field for Google users
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function (this: { googleId?: string }) {
      return !this.googleId;
    },
  },
  refreshToken: {
    type: [String],
    default: [],
  },
  post: {
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;
