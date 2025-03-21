import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Alert,
  Box,
  Button,
  Divider,
  Snackbar,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import { red } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { PostModel } from "../intefaces/Pots";
import apiClient from "../services/apiClient";
import {styled} from "@mui/material/styles";

// Define the props that our Post component will receive.
interface PostProps {
  post: PostModel;
  avatarLetter?: string;
  currentUserId: string;
  isEditMode?: boolean;
  refreshData: () => void;
  onClick?: () => void;
}


const ExpandMore = styled((props: { expand: boolean; onClick: () => void }) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));


const Post: React.FC<PostProps> = ({
  post,
  currentUserId,
  avatarLetter = "P",
  isEditMode = false,
  onClick,
  refreshData,
}) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error"
  >();

  const handleCommentsToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedComments((prev) => !prev);
  };

  const handleRecipeToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // אם צריך למנוע bubble
    setExpandedRecipe((prev) => !prev);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        await apiClient.post("/comments", {
          postId: post._id,
          message: newComment,
        });
        setNewComment("");
        setSnackbarMessage("Comment added!");
        setSnackbarOpen(true);
        setSnackbarSeverity("success");
        refreshData();
      } catch (error) {
        console.error("Error adding comment:", error);
        setSnackbarMessage("Failed to add comment.");
        setSnackbarSeverity("error"); // Set severity to error
        setSnackbarOpen(true);
      }
    }
  };

  const handleToggleFavorite = async (postId: string, liked: boolean) => {
    try {
      if (!liked) {
        // Like the post
        await apiClient.post(`/posts/${postId}/like`);
      } else {
        // Unlike the post
        await apiClient.delete(`/posts/${postId}/unlike`);
      }

      refreshData();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDeletePost = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up if needed
    try {
      await apiClient.delete(`/posts/${post._id}`);
      setSnackbarMessage("Post deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refreshData();
    } catch (error) {
      console.error("Error deleting post:", error);
      setSnackbarMessage("Failed to delete post.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
      setSnackbarMessage("Comment deleted!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refreshData();
    } catch (error) {
      console.error("Error deleting comment:", error);
      setSnackbarMessage("Failed to delete comment.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const isLiked = post.likes.some(({ _id }) => _id === currentUserId) || false;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "100%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        mb: 2,
        cursor: isEditMode ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": isEditMode
          ? {
              transform: "scale(1.02)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }
          : {},
      }}
      onClick={isEditMode ? onClick : undefined}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            {avatarLetter}
          </Avatar>
        }
        action={
          // Only show the delete icon if the current user is the owner of the post.
          post.owner._id === currentUserId ? (
            <IconButton aria-label="delete post" onClick={handleDeletePost}>
              <DeleteIcon />
            </IconButton>
          ) : null
        }
        title={post.title}
      />
      <CardMedia
        component="img"
        sx={{
          width: "100%",
          height: "600px",
          objectFit: "contain",
        }}
        image={`${import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000"}${post.imageUrl}`}
        alt={post.title}
      />
      <CardContent>

      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
            expand={expandedRecipe}
            onClick={handleRecipeToggle}
            aria-expanded={expandedRecipe}
            aria-label="show recipe"
        >
          <ExpandMoreIcon />
        </ExpandMore>

      <IconButton
          aria-label="add to favorites"
          onClick={() => handleToggleFavorite(post._id, isLiked)}
        >
          <FavoriteIcon color={isLiked ? "error" : "inherit"} />
        </IconButton>
        <Typography variant="body2">{post.likes.length}</Typography>
        <IconButton aria-label="comments" onClick={handleCommentsToggle}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2">{post.comments.length}</Typography>
      </CardActions>
      <Collapse in={expandedRecipe} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "pre-line" }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {post.content}
            </Typography>
          </Typography>
        </CardContent>
      </Collapse>
      <Collapse in={expandedComments} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Comments:
          </Typography>
          {post.comments.length > 0 ? (
            <>
              {post.comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{ mb: 1, display: "flex", alignItems: "center" }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      component="span"
                    >
                      {comment.user.userName}:
                    </Typography>{" "}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                    >
                      {comment.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      display="block"
                    >
                      {new Date(comment.date).toLocaleString()}
                    </Typography>
                  </Box>
                  {comment.user._id === currentUserId && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteComment(comment._id)}
                      aria-label="delete comment"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>

          )}
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <TextField
              label="Add a comment"
              variant="outlined"
              size="small"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleCommentSubmit}>
              Post
            </Button>
          </Box>
        </CardContent>
      </Collapse>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default Post;
