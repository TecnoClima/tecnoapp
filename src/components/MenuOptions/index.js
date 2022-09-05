import React from "react";
import { NavLink } from "react-router-dom";
import "./index.css";

export default function MenuOptions(props) {
  const { options } = props;

  function buildLIOption(option, index) {
    return (
      <NavLink
        key={index}
        to={option.url}
        className={(navData) =>
          `list-group-item listMenuOption ${
            navData.isActive ? "activeListOption" : ""
          } pe-0 ps-0pe-0 ps-0`
        }
      >
        {option.caption}
      </NavLink>
    );
  }

  return (
    <div
      className="menuOptionsBackground list-group list-group-flush bg-dark"
      style={{ minWidth: "10rem" }}
    >
      {options && options.map(buildLIOption)}
    </div>
  );
}
