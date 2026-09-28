import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

// Request interceptor: Attach JWT token to all outgoing requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 unauthorized errors (auto logout & redirect)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;
            // Don't auto-redirect if we are already on login or home
            if (currentPath !== "/login" && currentPath !== "/") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                delete api.defaults.headers.common["Authorization"];
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;