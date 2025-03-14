import { PostModel } from "./Pots";

export interface UserModel {
  _id: string;
  email: string;
  userName: string;
  profilePicture?: string;
  posts?: PostModel[];
}
