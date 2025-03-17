// Define the type for a post based on your backend schema
import {Comment} from "./Comment";

export interface Owner {
    _id: string;
    userName: string;
    profileImage?: string;
}

export interface PostModel {
    _id: string;
    title: string;
    content: string;
    imageUrl: string;
    comments: Comment[];
    createdAt: string;
    likes: Owner[]; // array of user IDs
    owner: Owner
}