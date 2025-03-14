import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import { setUser } from "../store/appState";
import apiClient from "../services/apiClient";

const LoginRedirector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log("here");
        const queryParams = queryString.parse(location.search);

        if (Object.keys(queryParams).length > 0) {
          const userId = queryParams.userId as string;
          const userName = queryParams.userName as string;
          const email = queryParams.email as string;
          const profilePicture = queryParams.profilePicture as string;

          if (userId && userName && email) {
            dispatch(
              setUser({
                _id: userId,
                userName,
                email,
                profilePicture: profilePicture || undefined,
              })
            );
          }
        }

        const response = await fetch("http://localhost:3000/auth/verify", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          try {
            const response = await apiClient.get("/auth/me");
            dispatch(setUser(response.data.user));
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          } finally {
            navigate("/home", { replace: true });
          }
        } else {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        navigate("/login");
      }
    };

    if (location.pathname === "/verify-auth") {
      console.log("verify");
      verifyAuth();
    } else {
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  return <div>Processing authentication...</div>;
};

export default LoginRedirector;
