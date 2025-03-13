// Define the type for a post based on your backend schema
export interface PostModel {
    _id: string;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: string;
    likes: string[]; // array of user IDs
    owner: {
        _id: string;
        userName: string;
        profileImage?: string;
    };
}