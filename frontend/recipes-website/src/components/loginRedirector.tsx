import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginRedirector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/verify", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          navigate("/home");
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    if (location.pathname === "/verify-auth") {
      verifyAuth();
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>Processing authentication...</div>;
};

export default LoginRedirector;
