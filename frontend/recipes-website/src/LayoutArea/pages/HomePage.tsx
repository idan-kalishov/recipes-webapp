import {Box, Grid, Pagination, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import Post from "../../components/Post";
import {useSelector} from "react-redux";
import {RootState} from "../../store/appState";
import {UserModel} from "../../intefaces/User";
import {PostModel} from "../../intefaces/Pots";
import apiClient from "../../services/apiClient";

const HomePage = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  const user: UserModel | null = useSelector(
    (state: RootState) => state.appState.user
  );

  const fetchPosts = async (page: number) => {
    try {
      const response = await apiClient.get("/posts/paginate", {
        params: { page: currentPage, limit: postsPerPage },
      });
      setPosts(response.data.posts);
      setTotalPages(Math.ceil(response.data.totalCount / postsPerPage));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <div className="pt-[7%] ">
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
          <>
            <Grid container spacing={2}>
              {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <Post
                    post={post}
                    currentUserId={user?._id ?? ""}
                    avatarLetter={
                      post.owner?.userName.charAt(0).toUpperCase() || "P"
                    }
                    refreshData={() => fetchPosts(currentPage)}
                  />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 3,
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

export default HomePage;
