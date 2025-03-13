import React from "react";
import userBackground from "../../assets/user-profile-background.png";
import { UserModel } from "../../intefaces/User";
import { useSelector } from "react-redux";
import { RootState } from "../../store/appState";
const UserProfile = () => {
  const user = useSelector((state: RootState) => {
    console.log("Full Redux state:", state);
    return state.appState.user;
  });
  console.log(user);
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${userBackground})` }}
    >
      <div className="pt-[10%]"></div>
      <h1> {user?.userName}</h1>
      <h1>hi</h1>
    </div>
  );
};

export default UserProfile;
