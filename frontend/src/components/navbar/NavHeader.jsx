import React from "react";
import { useSelector } from "react-redux";

const NavHeader = () => {
  const user = useSelector((state) => state.auth.user) || {};
  // Fix: don’t destructure the string itself—grab username off of user
  const username = user.username || "Guest";

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Brand / Welcome */}
        <a href="/" className="flex items-center text-xl font-semibold text-indigo-600">
          <i className="bi bi-at me-1"></i>
          <span className="ml-1">Hello, {username}</span>
        </a>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-bell text-2xl"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end mt-2 p-2 bg-white shadow-lg rounded-lg w-80">
              <li className="px-2 mb-1 text-sm font-medium text-gray-500">Notifications</li>
              <li>
                <a className="dropdown-item flex items-start space-x-2 p-2 hover:bg-gray-100 rounded">
                  <div className="bg-green-100 text-green-600 rounded-full p-2">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div>
                    <p className="text-gray-700">Your account has been created successfully.</p>
                    <p className="text-xs text-gray-400">12 days ago</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <button
              className="rounded-full overflow-hidden w-9 h-9 focus:outline-none border-2 border-gray-200"
              data-bs-toggle="dropdown"
            >
              <img
                src="image.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
            <ul className="dropdown-menu dropdown-menu-end mt-2 bg-white shadow-lg rounded-lg w-48">
              <li className="flex items-center p-3 border-b">
                <img
                  src="images/medium-shot-happy-man-smiling.jpg"
                  alt="Thumb"
                  className="w-10 h-10 rounded-full object-cover me-2"
                />
                <span className="font-medium text-gray-700">{username}</span>
              </li>
              <li>
                <a className="dropdown-item flex items-center p-2 hover:bg-gray-100" href="/setting">
                  <i className="bi bi-gear me-2"></i> Settings
                </a>
              </li>
              <li>
                <button className="w-full text-left dropdown-item p-2 hover:bg-gray-100">
                  {/* <LogoutComponent /> */}
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavHeader;
