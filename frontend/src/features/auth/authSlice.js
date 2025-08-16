import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const userFromStorage = JSON.parse(localStorage.getItem("user"));
const tokensFromStorage = JSON.parse(localStorage.getItem("tokens"));

const initialState = {
  user: userFromStorage || null,
  tokens: tokensFromStorage || null,
  isAuthenticated: !!(userFromStorage && tokensFromStorage),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;

      // Sync with localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("tokens", JSON.stringify(action.payload.tokens));
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("tokens");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
