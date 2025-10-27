import React from "react";
import { NavLink } from "react-router-dom";

export default function MenuOptions(props) {
  const { options } = props;

  return (
    <>
      {options &&
        options.map((option, index) => (
          <li key={index} className="py-0 my-0">
            <NavLink
              to={option.url}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {option.caption}
            </NavLink>
          </li>
        ))}
    </>
  );
}
