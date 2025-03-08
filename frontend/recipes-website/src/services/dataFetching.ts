import axios from "axios";

// Base URL of your backend server
const BASE_URL = "http://localhost:3000";

// Define the Post interface
export interface Post {
  _id: string;
  title: string;
  content: string;
  owner: string;
  imageUrl?: string;
}

// Function to fetch all posts
export const fetchAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get<Post[]>(`${BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
