import React from "react";
import userBackground from "../../assets/user-profile-background.png";
const UserProfile = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${userBackground})` }}
    >
      <div className="pt-[10%]"></div>
    </div>
  );
};

export default UserProfile;
