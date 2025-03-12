import React, {useState} from "react";
import {Alert, Box, Button, Card, Snackbar, TextField, Typography} from "@mui/material";
import AppTheme from "../../shared-theme/AppTheme";
import apiClient from "../../services/apiClient"; // axios instance מוגדר עם baseURL ו-withCredentials
import {useNavigate} from "react-router-dom";
import {readFileAsBase64,} from "../../utils/imageReader";
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";

const AddRecipePage: React.FC = () => {
    const navigate = useNavigate();

    // states לטופס והודעות למשתמש
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [loading, setLoading] = useState<boolean>(false);

    const handleRemoveImage = () => {
        setImageFile(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // טיפול בהגשת הטופס
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title) {
            setSnackbarMessage("Title is required");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        if (!imageFile) {
            setSnackbarMessage("You must upload a recipe photo!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);

        try {
            let imageUrl = "";

            if (imageFile) {
                imageUrl = await readFileAsBase64(imageFile);
            }
            // הקוד לא שולח במפורש את מזהה המשתמש – השרת מזהה אותו מהעוגיות
            const newPost = {title, content, imageUrl};
            await apiClient.post("/posts", newPost);
            setSnackbarMessage("Post created successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            navigate("/home");
        } catch (error) {
            console.error("Error creating post:", error);
            setSnackbarMessage("Failed to create post");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppTheme>
            <Box className="pt-[8%]" sx={{display: "flex", justifyContent: "center", mt: 4}}>
                <Card sx={{p: 4, width: {xs: "90%", sm: "500px"}}}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{mb: 2, textAlign: "center"}}
                    >
                        Create New Post
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            id="filled-basic" label="Recipe name" variant="filled"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            required
                            sx={{mb: 2}}
                        />

                        <TextField
                            id="filled-basic"
                            label="Content"
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
                            {imageFile ? (
                                <>
                                    <img
                                        src={URL.createObjectURL(imageFile)}
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
                                            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                                            zIndex: 10,
                                        }}
                                    >
                                        <Delete/>
                                    </IconButton>
                                </>
                            ) : (

                                <div>
                                    <img
                                        src="/src/assets/placeholder_recipe.jpg"
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
                            {loading ? "Creating..." : "Create Post"}
                        </Button>
                    </Box>
                </Card>
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{width: "100%"}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </AppTheme>
    );
};

export default AddRecipePage;
