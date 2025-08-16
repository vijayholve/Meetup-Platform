import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import axios from "axios";
import { API_ENDPOINTS } from "../features/base/config";
import { Link } from "react-router";

import CircularProgress from "@mui/material/CircularProgress";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, formData, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data;
      console.log(data)
      dispatch(
        loginSuccess({
          user: {
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
          },
          tokens: {
            access: data.access,
            refresh: data.refresh,
          },
        })
      );
      localStorage.setItem(
        "tokens",
        JSON.stringify({
          access: response.data.access,
          refresh: response.data.refresh,
        })
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        })
      );
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex container-lg items-center justify-center  my-10">
      <div className="w-full  max-w-sm bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">
            Already having a account?
            <Link
              to={{
                pathname: "/register",
              }}
              className="text-black font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
