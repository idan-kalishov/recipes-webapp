import React from "react";
import Posts from "../components/posts";
import NavBar from "../components/navBar";

const LoginPage = () => {
  return (
    <div className="bg-[#f4f2f0] min-h-screen">
      <NavBar />
      <div className="pt-[10%]">
        <Posts />
      </div>
    </div>
  );
};

export default LoginPage;
