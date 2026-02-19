import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("accessToken");
//       window.location.href = "/auth/login";
//     }
//     return Promise.reject(error);
//   }
// );
apiClient.interceptors.response.use(
  (response) => response,
  (error) => { 
    const skipRedirect = error.config && error.config._skipAuthRedirect;

    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      if (!skipRedirect) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;