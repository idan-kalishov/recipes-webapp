import mongoose, { Schema } from "mongoose";
import { IPost } from "./Post";

export interface IUser {
  _id?: string;
  email?: string;
  password?: string;
  userName?: string;
  refreshToken?: string[];
  profilePicture?: string;
  post?: IPost;
  googleId?: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: false,
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
  profilePicture: {
    type: String,
    required: false,
  },
  posts: {
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
