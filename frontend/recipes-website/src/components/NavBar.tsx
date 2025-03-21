import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import apiClient from "../services/apiClient";
import { setUser } from "../store/appState";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      dispatch(setUser(null));
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="w-full z-10 fixed">
      <nav className="w-full bg-white pt-[10px] pr-[1.5%] pb-[3px] pl-[2%] h-[7vh] shadow-md flex justify-between items-center">
        <div className="flex justify-between flex-row items-center">
          <img src={logo} alt="Logo" className="h-16 p-2" />
          <div className="hidden md:flex pl-[10%] space-x-6 flex-nowrap whitespace-nowrap">
            <button
              onClick={() => navigate("/home")}
              className="text-gray-700 flex items-center gap-1 text-2xl hover:text-blue-500 transition-colors cursor-pointer"
              style={{ fontFamily: "Bebas Neue, cursive" }}
            >
              Home 🏠
            </button>

            <button
              onClick={() => navigate("/add-recipe")}
              className="text-gray-700 flex items-center gap-1 text-2xl hover:text-blue-500 transition-colors cursor-pointer"
              style={{ fontFamily: "Bebas Neue, cursive" }}
            >
              New Recipe ➕
            </button>

            <button
              onClick={() => navigate("/recipe-generator")}
              className="text-gray-700 flex items-center gap-1 text-2xl hover:text-yellow-500 transition-colors cursor-pointer"
              style={{ fontFamily: "Bebas Neue, cursive" }}
            >
              Generator ⚡
            </button>

          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigate("/user-profile")}
            className="cursor-pointer"
          >
            <PersonIcon sx={{ fontSize: "40px" }} />
          </button>
          <button
            onClick={handleLogout}
            className="cursor-pointer"
            title="Logout"
          >
            <LogoutIcon sx={{ fontSize: "32px" }} className="pl" />
          </button>
        </div>
      </nav>
      <div
        className="w-full h-[36px] bg-cover bg-repeat-x"
        style={{
          backgroundImage:
            "url('https://cdn.prod.website-files.com/63bb7fe09d70bb7dc8e86719/63bb7fe19d70bbc605e8675c_wave_white_top_1.svg')",
          backgroundPosition: "center",
          backgroundAttachment: "scroll",
        }}
      />
    </div>
  );
};

export default NavBar;
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
