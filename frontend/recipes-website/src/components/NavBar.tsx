import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import PersonIcon from "@mui/icons-material/Person";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full z-10 fixed">
      <nav className="w-full bg-white pt-[10px] pr-[2%] pb-[3px] pl-[2%] h-[7vh] shadow-md flex justify-between items-center">
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

            <button
              onClick={() => navigate("/liked-posts")}
              className="text-gray-700 flex items-center gap-1 text-2xl hover:text-red-500 transition-colors cursor-pointer"
              style={{ fontFamily: "Bebas Neue, cursive" }}
            >
              Favorites ❤️
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/user-profile")}
          className="hidden md:block cursor-pointer"
        >
          <PersonIcon sx={{ fontSize: "40px" }} />
        </button>
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
