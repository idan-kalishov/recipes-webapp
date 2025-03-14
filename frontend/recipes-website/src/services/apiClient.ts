import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000", // TODO REPLACE WITH COLMAN
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post("http://localhost:3000/auth/refresh", null, {
          withCredentials: true,
        });
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error(refreshError);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
