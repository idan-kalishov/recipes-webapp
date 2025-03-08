import React, { useEffect, useState } from "react";
import { fetchAllPosts, Post } from "../services/dataFetching";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const fetchedPosts = await fetchAllPosts();
        setPosts(fetchedPosts);
        console.log("Fetched Posts:", fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    getPosts();
  }, []);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id} className="mb-4">
          {/* Display the Post Title */}
          <p className="text-4xl font-bold">{post.title}</p>

          {/* Display the Post Image (if it exists) */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={`Image for ${post.title}`}
              className="mt-2 rounded-lg max-w-full h-auto"
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default Posts;
