import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  Alert,
  Box,
  Button,
  Divider,
  Snackbar,
  TextField,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { SERVER_BASE_URL } from "../config";
import { PostModel } from "../intefaces/Pots";
import apiClient from "../services/apiClient";

// Define the props that our Post component will receive.
interface PostProps {
  post: PostModel;
  avatarLetter?: string;
  currentUserId: string;
  isEditMode?: boolean;
  refreshData: () => void;
  onClick?: () => void;
}

const Post: React.FC<PostProps> = ({
  post,
  currentUserId,
  avatarLetter = "P",
  isEditMode = false,
  onClick,
  refreshData,
}) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error"
  >();

  const handleCommentsToggle = (e: React.MouseEvent) => {
    console.log("here1");
    e.stopPropagation();
    setExpandedComments((prev) => !prev);
    console.log("here");
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

  const handleShareClick = async (id: string) => {
    try {
      const postUrl = `${window.location.origin}/posts/${id}`;
      await navigator.clipboard.writeText(postUrl);
      setSnackbarMessage("Link copied to clipboard!");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to copy link.");
      setSnackbarOpen(true);
      console.error(error);
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
  console.log(post);
  console.log(post + " " + post.owner._id + " " + currentUserId);

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "100%",
        margin: "auto",
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
          height: 200,
          objectFit: "contain",
        }}
        image={`${SERVER_BASE_URL ?? "http://localhost:3000"}${post.imageUrl}`}
        alt={post.title}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
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
        <IconButton
          aria-label="share"
          onClick={() => handleShareClick(post._id)}
        >
          <ShareIcon />
        </IconButton>
      </CardActions>
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
