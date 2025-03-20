import React, {useState, useEffect} from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import AppTheme from "../../shared-theme/AppTheme";
import apiClient from "../../services/apiClient"; // axios instance מוגדר עם baseURL ו-withCredentials
import {useNavigate, useParams} from "react-router-dom";
import {readFileAsBase64} from "../../utils/imageReader";
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import placeHolder from "../../assets/placeholder_recipe.jpg";

import {useDispatch, useSelector} from "react-redux";
import {
    addPosts,
    updateUserPosts,
    updatePost,
    updateUserPost,
} from "../../store/appState";
import {RootState} from "../../store/appState";

const AddRecipePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {postId} = useParams<{ postId?: string }>();

    // Retrieve posts from the Redux store
    const posts = useSelector((state: RootState) => state.appState.posts);
    const post = postId ? posts.find((p) => p._id === postId) : null;

    // States for form and snackbar
    const [title, setTitle] = useState<string>(post?.title || "");
    const [content, setContent] = useState<string>(post?.content || "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
        "success"
    );
    const [loading, setLoading] = useState<boolean>(false);

    const [imagePreview, setImagePreview] = useState<string>(
        post?.imageUrl || ""
    );

    useEffect(() => {
        if (post) {
            setImagePreview(post.imageUrl);
        }
    }, [post]);

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title) {
            setSnackbarMessage("Title is required");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);

            // Append the image file if a new file is selected
            if (imageFile) {
                formData.append("imageUrl", imageFile);
            } else if (imagePreview) {
                // If no new file is uploaded, send the existing image URL
                formData.append("imageUrl", imagePreview);
            }

            let response;

            if (post) {
                // Editing an existing post
                response = await apiClient.put(`/posts/${post._id}`, formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                });
                const updatedPostData = response.data;

                dispatch(
                    updatePost({postId: post._id, updatedPost: updatedPostData})
                );
                dispatch(
                    updateUserPost({postId: post._id, updatedPost: updatedPostData})
                );

                setSnackbarMessage("Post updated successfully!");
                navigate("/user-profile");
            } else {
                // Creating a new post
                response = await apiClient.post("/posts", formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                });

                dispatch(addPosts([response.data]));
                dispatch(updateUserPosts([response.data]));

                setSnackbarMessage("Post created successfully!");
            }

            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            navigate("/home");
        } catch (error) {
            console.error("Error handling post:", error);
            setSnackbarMessage(
                post ? "Failed to update post" : "Failed to create post"
            );
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppTheme>
            <Box
                className="pt-[8%]"
                sx={{display: "flex", justifyContent: "center", mt: 4}}
            >
                <Card sx={{p: 4, width: {xs: "90%", sm: "500px"}}}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{mb: 2, textAlign: "center"}}
                    >
                        {post ? "Edit Post" : "Create New Post"}
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            id="filled-basic"
                            label="Recipe name"
                            variant="filled"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            required
                            sx={{mb: 2}}
                        />

                        <TextField
                            id="filled-basic"
                            label="steps & ingredients"
                            variant="filled"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            sx={{mb: 2}}
                        />
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: 300,
                                mb: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "8px",
                                overflow: "hidden",
                            }}
                        >
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleRemoveImage}
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            backgroundColor: "rgba(0,0,0,0.5)",
                                            color: "white",
                                            "&:hover": {backgroundColor: "rgba(0,0,0,0.7)"},
                                            zIndex: 10,
                                        }}
                                    >
                                        <Delete/>
                                    </IconButton>
                                </>
                            ) : (
                                <div>
                                    <img
                                        src={placeHolder}
                                        alt="Placeholder"
                                        style={{width: "100%", opacity: 0.9}}
                                    />
                                </div>
                            )}
                        </Box>

                        <Button variant="contained" component="label" sx={{mb: 2}}>
                            Upload Recipe Photo
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading
                                ? post
                                    ? "Updating..."
                                    : "Creating..."
                                : post
                                    ? "Update Post"
                                    : "Create Post"}
                        </Button>
                    </Box>
                </Card>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{width: "100%"}}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </AppTheme>
    );
};

export default AddRecipePage;
