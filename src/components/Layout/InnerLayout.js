import React, { useState } from "react";
import logo from "../../assets/icons/logoTecnoclima.png";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCalendarAlt,
  faFan,
  faKey,
  faShieldAlt,
  faSignOutAlt,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import PasswordForm from "../../Modals/Password";

export default function InnerLayout({ children }) {
  const { userData } = useSelector((state) => state.people);
  const isAdmin = userData.access === "Admin";
  const [openPassword, setOpenPassword] = useState(false);

  const routes = [
    {
      section: "Órdenes de Trabajo",
      url: "/ots",
      icon: <FontAwesomeIcon icon={faTools} />,
    },
    {
      section: "Equipos",
      url: "/equipos",
      icon: <FontAwesomeIcon icon={faFan} />,
    },
    {
      section: "Plan",
      url: "/plan",
      icon: <FontAwesomeIcon icon={faCalendarAlt} />,
    },
  ];

  const mode = {
    dev: "desarrollo",
    test: "prueba",
  }[process.env.REACT_APP_ENV];

  function handleLogOut() {
    localStorage.removeItem("tecnoToken");
    window.location = "/";
  }

  function handlePassForm(e) {
    e.preventDefault();
    setOpenPassword(!openPassword);
  }

  return (
    <div className="w-full h-full flex">
      <div className="flex-grow bg-gradient-to-r from-base-100 via-base-100 to-base-200" />
      <div className="lg:container w-full h-full mx-auto">
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col h-full min-h-0 overflow-y-auto">
            <div className="navbar bg-base-200/50 lg:hidden flex-wrap">
              <div className="flex flex-grow">
                <label
                  title="Menu"
                  htmlFor="my-drawer-2"
                  className="btn btn-ghost btn-sm drawer-button mr-3 border-base-content/10 hover:bg-base-300"
                >
                  <FontAwesomeIcon icon={faBars} />
                </label>
                <Link to="/panel">
                  <div className="bg-base-100/50 rounded-full p-1">
                    <img className="w-40" src={logo} alt="" />
                  </div>
                </Link>
              </div>
              <div className="flex flex-grow max-w-80 ml-auto gap-2">
                {routes.map(({ icon, section, url }) => (
                  <NavLink
                    key={url}
                    to={url}
                    title={section}
                    className={({ isActive }) => `
                      ${
                        isActive ? "bg-base-300 hover:bg-base-300" : ""
                      } flex-grow btn btn-sm hover:bg-base-content/10`}
                  >
                    {icon}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex-grow">
              <div className="container d-flex flex-grow-1 overflow-auto">
                {children}
              </div>
            </div>
          </div>
          <div className="drawer-side ">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>

            <div className="flex flex-col bg-base-200 h-full w-60 p-4">
              <Link to="/panel">
                <div className="bg-base-100/50 rounded-full p-1">
                  <img className="w-full" src={logo} alt="" />
                </div>
              </Link>
              <div className="text-sm text-center font-semibold">
                Gestión de Mantenimiento
              </div>
              <div className="h-8">
                {mode && (
                  <div
                    className="badge badge-pill badge-danger"
                    style={{ backgroundColor: "darkred" }}
                  >
                    modo {mode}
                  </div>
                )}
              </div>
              <ul className="menu text-base-content gap-2">
                {routes.map(({ section, url, icon }, index) => (
                  <li key={index}>
                    <NavLink
                      to={url}
                      key={index}
                      className={(navData) =>
                        navData.isActive ? "bg-base-300 hover:bg-base-300" : ""
                      }
                    >
                      {icon} {section}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <ul className="menu flex flex-col text-base-content mt-auto gap-4">
                <li>
                  {isAdmin && (
                    <NavLink
                      to={"/admin"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-warning text-neutral hover:bg-warning"
                          : "shadow-md bg-base-content/5 shadow-base-content/10 text-warning"
                      }
                    >
                      <FontAwesomeIcon icon={faShieldAlt} /> Menú Admin
                    </NavLink>
                  )}
                </li>
                <button
                  className="btn btn-sm btn-ghost w-full justify-start"
                  onClick={handlePassForm}
                >
                  <FontAwesomeIcon icon={faKey} />
                  Cambiar Contraseña
                </button>
              </ul>
              <div className="divider mt-0 mb-2 pb-0"></div>
              <div className="px-2">
                <button
                  className="btn btn-sm btn-ghost w-full justify-start"
                  onClick={handleLogOut}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PasswordForm open={openPassword} close={() => setOpenPassword(false)} />
    </div>
  );
}