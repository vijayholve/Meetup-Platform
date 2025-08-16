import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "../features/auth/authSlice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, tokens } = useSelector((state) => state.auth);

  const API = axios.create({
    baseURL: "http://localhost:8000/api",
  });

  API.interceptors.request.use(async (config) => {
    let currentTokens = tokens;

    if (!currentTokens) return config;

    const { access, refresh } = currentTokens;

    try {
      const decoded = jwtDecode(access);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        const response = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh,
        });

        const newAccess = response.data.access;

        dispatch(loginSuccess({ user, tokens: { access: newAccess, refresh } }));
        localStorage.setItem("tokens", JSON.stringify({ access: newAccess, refresh }));
        currentTokens = { access: newAccess, refresh };
      }
    } catch (error) {
      dispatch(logout());
      localStorage.removeItem("user");
      localStorage.removeItem("tokens");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    config.headers.Authorization = `Bearer ${currentTokens.access}`;
    return config;
  });

function login(userData, tokenData) {
  // Save to Redux
  dispatch(loginSuccess({ user: userData, tokens: tokenData }));

  // Save to localStorage
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("tokens", JSON.stringify(tokenData));
}

 function logoutUser() {
  dispatch(logout());
  localStorage.removeItem("user");
  localStorage.removeItem("tokens");
}

  useEffect(() => {
    // You can sync here if needed
  }, []);

  return { user, tokens, login, logoutUser, API };
}
