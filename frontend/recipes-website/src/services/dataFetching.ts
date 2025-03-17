import apiClient from "./apiClient";
import {PostModel} from "../intefaces/Pots";

// Base URL of your backend server
const BASE_URL = "http://localhost:3000";


// Function to fetch all posts
export const fetchAllPosts = async (): Promise<PostModel[]> => {
  try {
    const response = await apiClient.get<PostModel[]>("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
