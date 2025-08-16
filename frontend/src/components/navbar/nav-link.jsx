import React from "react";
import { NavLink } from "react-router-dom";

const Nav_link = ({ title, link = "#", icon }) => {
  return (
    <NavLink
      to={link}
      end
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200
         ${
           isActive
             ? "bg-blue-100 text-blue-700 font-semibold"
             : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
         }`
      }
    >
      {icon && <i className={`${icon} text-lg`}></i>}
      <span>{title}</span>
    </NavLink>
  );
};

export default Nav_link;
