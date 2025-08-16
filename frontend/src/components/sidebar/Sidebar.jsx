import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Nav_link from "./nav-link";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { SiteConfig } from "../../api/siteconfig/Sitecofig";

export default function Sidebar({ children }) {
  const user = useSelector((state) => state.auth.user) || {};
  const username = user.username || "Guest";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
    const { siteConfigData} = useContext(SiteConfig);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <aside
        className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-white border-r shadow-lg transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="px-6 py-4 text-2xl font-bold text-indigo-600 border-b">
            {siteConfigData.navbar_title}
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-auto">
            <Nav_link
              title="Dashboard"
              link="/dashboard"
              icon="bi-speedometer2"
            />

            <Nav_link title="Home" link="/" icon="bi-house" />
            <Nav_link
              title="Events"
              link="/eventpanel"
              icon="bi-calendar-event"
            />
            <Nav_link title="Userpanel" link="/userpanel" icon="bi-chat-dots" />
            <Nav_link
              title="Event Registerpanel"
              link="/eventregisterpanel"
              icon="bi-people"
            />
            <Nav_link title=" City" link="/citypanel" icon="bi-people" />
            <Nav_link title=" Venue" link="/venuepanel" icon="bi-people" />

            <Nav_link
              title=" Category"
              link="/categorypanel"
              icon="bi-people"
            />
          </nav>

          {/* Profile & Logout */}
          <div className="px-4 py-6 border-t">
            <div className="flex items-center space-x-3">
              <div>
                <p className="font-medium text-gray-700">{username}</p>
                <Nav_link title="Setting" link="/setting" icon="bi-chat-dots" />
              </div>
            </div>
            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="mt-4 w-full text-left text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between bg-white px-4 md:px-6 py-3 border-b shadow-sm">
          <button
            className="text-gray-600 md:hidden focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-list text-2xl"></i>
          </button>
          <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
            Welcome, {username}
          </h1>
          <button className="relative text-gray-600 hover:text-gray-800 focus:outline-none">
            <i className="bi bi-bell text-2xl"></i>
            <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
