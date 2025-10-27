import {
  faBars,
  faCalendarAlt,
  faFan,
  faKey,
  faShieldAlt,
  faSignOutAlt,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/icons/logoTecnoclima.png";
import PasswordForm from "../../Modals/Password";
import MenuOptions from "../MenuOptions";

export default function InnerLayout({ children }) {
  const { userData } = useSelector((state) => state.people);
  const isAdmin = userData.access === "Admin";
  const [openPassword, setOpenPassword] = useState(false);
  const location = useLocation();

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

  // Opciones de administración (idénticas a AdminPanel)
  const adminOptions = [
    { caption: "Usuarios", url: "/admin/usuarios" },
    { caption: "Monitoreo", url: "/admin/monitoreo" },
    { caption: "Equipos", url: "/admin/equipos" },
    { caption: "Plantas", url: "/admin/plantas" },
    { caption: "Plan", url: "/admin/plan" },
    { caption: "Garrafas", url: "/admin/garrafas" },
    { caption: "Cargar Equipos", url: "/admin/carga_excel" },
    { caption: "Cargar Frecuencias", url: "/admin/carga_frecuencias" },
  ];

  // Detectar si estamos en /admin o subrutas
  const isAdminRoute = location.pathname.startsWith("/admin");

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
      <div className="flex-grow bg-gradient-to-r from-neutral via-neutral to-base-200" />
      <div className="xl:container w-full h-full mx-auto">
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col h-screen min-h-0">
            <div className="navbar static bg-base-200/50 lg:hidden flex-wrap min-h-fit">
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
            <div className="flex-grow overflow-y-auto">
              <div className="h-full w-full">{children}</div>
            </div>
          </div>
          <div className="drawer-side ">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>

            <div className="flex flex-col bg-base-200 h-full min-h-0 overflow-y-auto w-60 p-4">
              <Link to="/panel">
                <div className="bg-base-100/50 rounded-full p-1">
                  <img className="w-full" src={logo} alt="" />
                </div>
              </Link>
              <div className="text-sm text-center font-semibold">
                Gestión de Mantenimiento
              </div>
              {mode && (
                <div className="badge badge-pill badge-primary mx-auto py-2">
                  modo {mode}
                </div>
              )}
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
                {isAdmin && (
                  <>
                    {/* Mostrar opciones de admin sólo en /admin o subrutas */}
                    {isAdminRoute && (
                      <div className="bg-base-100/50 rounded-t-lg -mb-4">
                        <MenuOptions options={adminOptions} />
                      </div>
                    )}
                    <li>
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
                    </li>
                  </>
                )}
                <button
                  className="btn btn-sm btn-ghost w-full justify-start"
                  onClick={handlePassForm}
                >
                  <FontAwesomeIcon icon={faKey} />
                  Cambiar Contraseña
                </button>
              </ul>
              <div className="divider mt-0 mb-2 pb-0" />
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
      <div className="flex-grow bg-gradient-to-r from-base-100 to-neutral" />

      {openPassword && (
        <PasswordForm open={true} close={() => setOpenPassword(false)} />
      )}
    </div>
  );
}
