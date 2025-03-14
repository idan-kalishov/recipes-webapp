import NavBar from "../components/NavBar";
import React from "react";
import Routing from "../Routing/Routing";
import { useLocation } from "react-router-dom";
import "./Layout.css";

export function Layout(): JSX.Element {
  const location = useLocation();

  const publicRoutes = ["/login", "/register", "/verify-auth"];
  const showNavBar = !publicRoutes.includes(location.pathname);

  return (
    <div className="Layout">
      {showNavBar && (
        <header>
          <NavBar />
        </header>
      )}
      <main>
        <div className="bg-[#f4f2f0] min-h-screen">
          <Routing />
        </div>
      </main>
    </div>
  );
}
