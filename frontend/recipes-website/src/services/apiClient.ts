import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}`,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(`${BACKEND_URL}/auth/refresh`, null, {
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
