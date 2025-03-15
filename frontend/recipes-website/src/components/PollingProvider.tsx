import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../services/apiClient";
import { addPosts, RootState, setLastUpdateTime } from "../store/appState";

interface PollingProviderProps {
  children: React.ReactNode;
}

export const PollingProvider = ({ children }: PollingProviderProps) => {
  const dispatch = useDispatch();
  const lastUpdateTime = useSelector(
    (state: RootState) => state.appState.lastUpdateTime
  );

  const user = useSelector((state: RootState) => state.appState.user);

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get("/posts", {
        params: { lastUpdateTime },
      });

      const newPosts = response.data;

      if (newPosts.length > 0) {
        dispatch(addPosts(newPosts));

        const latestPostTime = newPosts[newPosts.length - 1].createdAt;
        dispatch(setLastUpdateTime(latestPostTime));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log("User is not logged in. Polling paused.");
      return;
    }
    fetchPosts();
    const intervalId = setInterval(fetchPosts, 30000);

    return () => clearInterval(intervalId);
  }, [lastUpdateTime, user]);
  return <>{children}</>;
};
