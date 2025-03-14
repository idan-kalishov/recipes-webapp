import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import defaultPic from "../assets/no-profile.png";

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
  const [newProfilePic, setNewProfilePic] = useState(user.profilePicture);

  const handleSave = async () => {
    try {
      // Call API to update userName
      console.log("Saving new userName:", newUserName);
      // Example API call:
      // await apiClient.put("/auth/update", { userName: newUserName });
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update user name:", error);
    }
  };

  return (
    <>
      <div className="relative mb-6">
        <img
          src={user.profilePicture || defaultPic}
          alt="Profile"
          className="w-80 h-80 z-10 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>
      <div className="text-center mt-4">
        {/* User Name */}
        {editMode ? (
          <TextField
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            variant="outlined"
            fullWidth
            size="small"
            sx={{ maxWidth: "200px", margin: "0 auto" }}
          />
        ) : (
          <h1 className="text-3xl font-bold">{user.userName}</h1>
        )}

        {/* Email */}
        <p className="text-gray-500 text-lg mt-2">{user.email}</p>

        {/* Save Button (Visible in Edit Mode) */}
        {editMode && (
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            size="small"
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        )}
      </div>
    </>
  );
};

export default UserDetails;
