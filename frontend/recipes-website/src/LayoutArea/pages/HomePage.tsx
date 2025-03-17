import {Box, Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import Post from "../../components/Post";
import {PostModel} from "../../intefaces/Pots";
import {postService} from "../../services/PostService";
import {UserModel} from "../../intefaces/User";
import {useSelector} from "react-redux";
import {RootState} from "../../store/appState";

const HomePage = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const user: UserModel  = useSelector(
      (state: RootState) => state.appState.user
  );

  const fetchPosts = async () => {
    try {
      const posts = await postService.getAllPosts();
      console.log(posts);
      setPosts(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="pt-[10%]">
      <Box sx={{ padding: 2 }}>
        <Typography
          sx={{ padding: 2 }}
          variant="h4"
          align="center"
          gutterBottom
        >
          Recipes
        </Typography>
        {loading ? (
          <Typography align="center">Loading posts...</Typography>
        ) : (
          <Grid container spacing={2}>
            {posts.map((post) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <Post
                    post={post}
                    currentUserId={user._id}
                    avatarLetter={post.owner?.userName.charAt(0).toUpperCase() || "p"}
                    refreshData={fetchPosts}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </div>
  );
};

export default HomePage;
