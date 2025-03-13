import React from "react";
import Posts from "../components/posts";
import NavBar from "../components/navBar";
import userBackground from "../assets/user-profile-background.png";

const UserProfile = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${userBackground})` }}
    >
      <NavBar />
      <div className="pt-[10%]"></div>
    </div>
  );
};

export default UserProfile;
