import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import Post from "./Post";
import { useNavigate } from "react-router-dom";

interface UserPostsProps {
  editMode: boolean;
  user: {
    _id: string;
  };
}

const UserPosts = ({ user, editMode }: UserPostsProps) => {
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchUserPosts = async () => {
    try {
      const response = await apiClient.get(`/posts/user/${user._id}`);
      setUserPosts(response.data);
    } catch (error: any) {
      console.error("Error fetching user posts:", error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-[2%] w-[75%] flex flex-col items-center">
      <h2
        style={{ fontFamily: "Great Vibes, cursive" }}
        className="text-2xl pl-[5%] font-bold mb-2"
      >
        My Posts
      </h2>

      <div className="w-full h-[43vh] overflow-y-auto scroll-container pr-2">
        <div className="grid self-start width: 70vw; grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md p-4">
                <Post
                  post={post}
                  currentUserId={post.owner}
                  refreshData={fetchUserPosts}
                  isEditMode={editMode}
                  onClick={() => {
                    if (editMode) {
                      navigate(`/add-recipe/${post._id}`);
                    }
                  }}
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No posts available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPosts;
