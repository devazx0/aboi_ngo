import axios from "axios";

export const apiClient = axios.create({
  baseURL: "", // relative URL to current origin
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add interceptor to format error messages nicely
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected API error occurred.";
    return Promise.reject(new Error(message));
  }
);
