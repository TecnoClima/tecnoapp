import React from "react";
import NavBar from "../components/NavBar";
import "./index.css";

const Layout = (props) => {
  return (
    <React.Fragment>
      <NavBar />

      <div className="container d-flex flex-grow-1 overflow-auto">
        {props.children}
      </div>
    </React.Fragment>
  );
};
export default Layout;
