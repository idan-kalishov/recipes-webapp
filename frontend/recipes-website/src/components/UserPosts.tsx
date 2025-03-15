import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography } from "@mui/material";
import apiClient from "../services/apiClient";
import { RootState } from "../store/appState";
import Post from "./Post";

const UserPosts = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.appState.user);

  useEffect(() => {
    if (!user || (user.posts && user.posts.length > 0)) return;

    const fetchUserPosts = async () => {
      try {
        const response = await apiClient.get(`/posts/user/${user._id}`);
        const updatedUser = {
          ...user,
          posts: response.data, // Add the fetched posts to the user object
        };
        dispatch({ type: "appState/setUser", payload: updatedUser });
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [dispatch, user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const userPosts = user.posts || [];

  return (
    <div className="pt-[2%] w-[75%] flex flex-col items-center">
      <h2
        style={{ fontFamily: "Bebas Neue, cursive" }}
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
                  title={post.title}
                  image={post.imageUrl || ""}
                  content={post.content || ""}
                  method={post.content || ""}
                  avatarLetter={user.userName?.charAt(0) || "P"}
                  onFavorite={() => {
                    console.log("Like post:", post._id);
                  }}
                  onShare={() => {
                    console.log("Share post:", post._id);
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
