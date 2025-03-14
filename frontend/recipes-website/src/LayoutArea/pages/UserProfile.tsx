import { IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import userBackground from "../../assets/user-profile-background1.png";
import ProfilePicture from "../../components/ProfilePicture";
import { RootState } from "../../store/appState";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import UserDetails from "../../components/UserDetails";
import { UserModel } from "../../intefaces/User";
const UserProfile = () => {
  const user: UserModel | null = useSelector(
    (state: RootState) => state.appState.user
  );
  const [editMode, setEditMode] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${userBackground})` }}
    >
      <div className="flex flex-col pt-[8%] pl-[25%]">
        {/* <ProfilePicture profilePicture={user.profilePicture} /> */}

        <Tooltip
          title={editMode ? "Exit Edit Mode" : "Edit Profile"}
          placement="top"
        >
          <IconButton
            onClick={() => setEditMode(!editMode)}
            sx={{
              position: "absolute",
              top: "12%",
              right: "25%",
              padding: 0.5,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            color={editMode ? "primary" : "default"}
            aria-label="Toggle Edit Mode"
          >
            <ModeEditIcon sx={{ fontSize: "30px" }} />
          </IconButton>
        </Tooltip>

        <UserDetails
          user={user}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      </div>
    </div>
  );
};

export default UserProfile;
