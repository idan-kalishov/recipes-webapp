import apiClient from "./apiClient";
import { PostModel as Post } from "../intefaces/Pots";

class PostService {
  public async getAllPosts(): Promise<Post[]> {
    try {
      const response = await apiClient.get<Post[]>("/posts");

      const posts = response.data;

      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }
}

export const postService = new PostService();
