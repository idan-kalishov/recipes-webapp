import React, { useState } from "react";
import { TextField, Button, IconButton, Snackbar, Alert } from "@mui/material";
import defaultPic from "../assets/no-profile.png";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import apiClient from "../services/apiClient";
import { useDispatch } from "react-redux";
import { setUser } from "../store/appState"; // Import the setUser action
import { SERVER_BASE_URL } from "../config";

interface UserDetailsProps {
  user: {
    userName: string;
    email: string;
    profilePicture?: string;
  };
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  editMode,
  setEditMode,
}) => {
  const [newUserName, setNewUserName] = useState(user.userName);
  const [newProfilePicFile, setNewProfilePicFile] = useState<File | null>(null);
  const [newProfilePicPreview, setNewProfilePicPreview] = useState<
    string | null
  >();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const dispatch = useDispatch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfilePicFile(file);
      const url = URL.createObjectURL(file);
      setNewProfilePicPreview(url);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      if (newUserName !== user.userName)
        formData.append("userName", newUserName);
      if (newProfilePicFile)
        formData.append("profilePicture", newProfilePicFile);

      const response = await apiClient.put("/user/update-user", formData);
      console.log(response.data.message);

      const updatedUser = {
        ...user,
        userName: newUserName,
        profilePicture: response.data.profilePicture || user.profilePicture,
      };
      dispatch(setUser(updatedUser));

      setEditMode(false);
      setSnackbarMessage("Profile updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
      setSnackbarMessage(
        error.response?.data?.message || "Failed to update profile"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  return (
    <div className="flex flex-col pl-[5%] items-center md:flex-row md:items-start">
      <div className="relative mb-6 md:mb-0">
        <img
          alt="Profile"
          src={
            newProfilePicPreview ||
            (user?.profilePicture &&
              `${SERVER_BASE_URL ?? "http://localhost:3000"}/${user.profilePicture}`) ||
            defaultPic
          }
          className="w-80 h-80 z-10 rounded-full object-cover border-4 border-white shadow-lg"
        />
        {editMode && (
          <>
            <label
              htmlFor="profile-upload"
              className="w-20 h-20 absolute flex justify-center items-center bottom-0 right-3 cursor-pointer bg-white rounded-full p-1 shadow-md"
            >
              <PhotoCameraIcon fontSize="large" color="primary" />
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-upload"
            />
          </>
        )}
      </div>

      <div className="text-left pt-[5%] ml-0 md:ml-8 mt-4 md:mt-0">
        <div className="mb-4 flex flex-row items-center">
          <p
            style={{ fontFamily: "Caveat, cursive" }}
            className="text-gray-600 font-semibold pr-5 text-3xl"
          >
            Name:
          </p>
          {editMode ? (
            <TextField
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
              sx={{ maxWidth: "200px" }}
            />
          ) : (
            <p
              style={{ fontFamily: "Caveat, cursive" }}
              className="text-3xl text-gray-600 font-bold"
            >
              {user.userName}
            </p>
          )}
        </div>

        <div className="flex flex-row items-center">
          <p
            style={{ fontFamily: "Caveat, cursive" }}
            className="text-gray-600 text-3xl pr-5 font-semibold"
          >
            Email:
          </p>
          <p
            style={{ fontFamily: "Caveat, cursive" }}
            className="text-3xl text-gray-600"
          >
            {user.email}
          </p>
        </div>
      </div>

      {editMode && (
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          size="small"
          className="self-end mr-[100%]"
        >
          Save
        </Button>
      )}

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
    </div>
  );
};

export default UserDetails;
