import React from "react";
import defaultPic from "../assets/no-profile.png";

interface ProfilePictureProps {
  profilePicture?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ profilePicture }) => {
  return (
    <div className="relative mb-6">
      <img
        src={profilePicture || defaultPic}
        alt="Profile"
        className="w-80 h-80 z-10 rounded-full object-cover border-4 border-white shadow-lg"
      />
    </div>
  );
};

export default ProfilePicture;
