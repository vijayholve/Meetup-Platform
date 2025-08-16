import React from "react";
import { NavLink } from "react-router-dom";

const Nav_link = ({ title, link = "#", icon }) => {
  return (
    <NavLink
      to={link}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-indigo-100 teCD`xt-indigo-700"
            : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
        }`
      }
    >
      <i className={`${icon} px-3`}></i>
      <span className="font-medium">{title}</span>
    </NavLink>
  );
};

export default Nav_link;
