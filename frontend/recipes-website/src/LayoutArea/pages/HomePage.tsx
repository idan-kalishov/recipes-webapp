import React, {useEffect, useState} from "react";
import Post from "../../components/Post";
import apiClient from "../../services/apiClient";
import {postService} from "../../services/PostService";
import {Box, Grid, Typography} from "@mui/material";
import {PostModel} from "../../intefaces/Pots";

const HomePage = () => {
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // const { user } = useAuth();

    const fetchPosts = async () => {
        try {
            const posts = await postService.getAllPosts();
            setPosts(posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async (postId: string, liked: boolean) => {
        try {
            if (!liked) {
                // Like the post
                await apiClient.post(`/posts/${postId}/like`);
            } else {
                // Unlike the post
                await apiClient.delete(`/posts/${postId}/like`);
            }
            // Refresh posts to update the likes count
            fetchPosts();
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
            <div className="pt-[10%]">
                <Box sx={{ padding: 2 }}>
                    <Typography sx={{ padding: 2 }} variant="h4" align="center" gutterBottom>
                        Recipes
                    </Typography>
                    {loading ? (
                        <Typography align="center">Loading posts...</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {posts.map((post) => {
                                const isLiked = true//user && post.likes.some((id) => id === user._id);
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={post._id}>
                                        <Post
                                            title={post.title}
                                            image={post.imageUrl}
                                            content={post.content}
                                            method={post.content}
                                            avatarLetter={
                                                post.owner.userName
                                            }
                                            onFavorite={() => handleToggleFavorite(post._id, Boolean(isLiked))}
                                            onShare={() => {
                                                // Implement share functionality if needed
                                            }}
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
