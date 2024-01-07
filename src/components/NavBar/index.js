import React, { useState, useEffect } from "react";
import "./index.css";
import logo from "../../assets/icons/logoTecnoclima.png";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions } from "../../actions/StoreActions";
import { ErrorModal, SuccessModal } from "../warnings";

function PasswordForm({ close }) {
  const { userData, peopleResult } = useSelector((state) => state.people);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  function handleClose(e) {
    e.preventDefault();
    close && close();
  }

  useEffect(
    () => confirm && newPassword && setError(confirm !== newPassword),
    [confirm, newPassword]
  );

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      peopleActions.updateUser(userData.id, {
        currentPassword: password,
        newPassword: newPassword,
      })
    );
  }

  function handleCloseSuccess() {
    dispatch(peopleActions.resetResult());
    close && close();
  }

  return (
    <div className="modal text-dark">
      <form
        className="col-sm-6 px-3 rounded bg-light shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="row d-flex justify-content-end pt-2 pe-2">
          <button className="btn btn-close" onClick={handleClose} />
        </div>
        <div className="row d-flex justify-content-end">
          <h5 className="text-center fw-bold">
            <u>Cambiar contraseña</u>
          </h5>
        </div>
        <div className="row">
          <div className="mb-3">
            <label for="currentPassword" className="form-label">
              Contraseña actual
            </label>
            <input
              type="password"
              className="form-control"
              id="currentPassword"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label for="newPassword" className="form-label">
              Ingrese nueva contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label for="confirmPassword" className="form-label">
              Repita nueva contraseña
            </label>
            <input
              type="password"
              className={`form-control ${
                error ? "btn-outline-danger border-danger" : ""
              }`}
              id="confirmPassword"
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row my-2">
          {error ? (
            <div className="alert alert-danger">
              Las contraseñas nuevas no coinciden.
            </div>
          ) : (
            <div className="col d-flex justify-content-center">
              <input
                className="btn btn-primary"
                type="submit"
                title="Cambiar"
                disabled={!newPassword || !confirm || newPassword !== confirm}
              />
            </div>
          )}
        </div>
        {peopleResult.error && (
          <ErrorModal
            message={peopleResult.error}
            close={() => dispatch(peopleActions.resetResult())}
          />
        )}
        {peopleResult.success && (
          <SuccessModal
            message={"Contraseña actualizada exitosamente"}
            close={handleCloseSuccess}
          />
        )}
      </form>
    </div>
  );
}

function NavBar() {
  const { userData } = useSelector((state) => state.people);
  const isAdmin = userData.access === "Admin";
  const [visible, setVisible] = useState(false);
  const [pass, setPass] = useState(false);

  const navOptions = [
    { section: "Órdenes de Trabajo", url: "/ots" },
    { section: "Equipos", url: "/equipos" },
    { section: "Plan", url: "/plan" },
  ];

  const mode = {
    dev: "desarrollo",
    test: "prueba",
  }[process.env.REACT_APP_ENV];

  function handleToggle(e) {
    e.preventDefault();
    setVisible(!visible);
  }

  function handleLogOut() {
    setVisible(false);
    localStorage.removeItem("tecnoToken");
    window.location = "/";
  }

  function handlePassForm(e) {
    e.preventDefault();
    setPass(!pass);
    setVisible(false);
  }

  return (
    <>
      {userData ? (
        <nav
          className={`navBar ${
            mode ? "bg-dark" : "bg-nav"
          } text-light d-flex align-items-center`}
        >
          <div className="container p-0">
            <div className="row m-0">
              <div className="col-md-auto d-flex p-0 justify-content-between">
                <Link
                  className="position-relative mx-1 my-0 p-0 d-flex justify-content-center"
                  to="/panel"
                  onClick={() => setVisible(false)}
                >
                  <img className="navBarLogo navbar-brand" src={logo} alt="" />
                  {mode && (
                    <div
                      className="position-absolute badge badge-pill badge-danger bottom-0"
                      style={{ backgroundColor: "darkred" }}
                    >
                      modo {mode}
                    </div>
                  )}
                </Link>
                {pass && <PasswordForm close={() => setPass(!pass)} />}
                <button
                  className="btn btn-outline-dark toggleMenu my-auto"
                  onClick={handleToggle}
                  style={{ height: "fit-content" }}
                >
                  <i className="fas fa-bars" />
                </button>
              </div>
              <div
                className={`col-sm-auto p-0 d-flex flex-grow-1 navBarLinkContainer ${
                  visible ? "visibleNavBar" : ""
                }`}
              >
                <div className="container-fluid p-0 my-2">
                  <div className="row m-0">
                    {navOptions.map((option, index) => (
                      <div key={index} className="col-sm-auto p-0 d-grid gap-2">
                        <NavLink
                          to={option.url}
                          key={index}
                          onClick={() => setVisible(false)}
                          className={(navData) =>
                            `col btn nav-item navBarLink ${
                              navData.isActive ? "activeNavLink" : ""
                            } px-1`
                          }
                        >
                          {option.section}
                        </NavLink>
                      </div>
                    ))}
                    <div className="col-sm-auto p-0 d-grid gap-2">
                      {isAdmin && (
                        <NavLink
                          to={"/admin"}
                          onClick={() => setVisible(false)}
                          className={(navData) =>
                            `btn nav-item navAdminLink ${
                              navData.isActive ? "activeAdminLink" : ""
                            }`
                          }
                        >
                          Menú Admin
                        </NavLink>
                      )}
                    </div>
                    <div className="col-sm-auto p-0 flex flex-grow-1">
                      <div className="container p-0">
                        <div className="row m-0 pe-2 d-flex justify-content-end">
                          <button
                            className="col-sm-3 px-1 btn btn-outline-warning"
                            style={{ minWidth: "fit-content" }}
                            title="Cambiar contraseña"
                            onClick={handlePassForm}
                          >
                            <i className="fas fa-exchange-alt" />
                            <i className="fas fa-key" />
                          </button>
                          <button
                            className="col-sm-3 px-1 btn btn-outline-secondary"
                            onClick={handleLogOut}
                            style={{
                              height: "fit-content",
                              minWidth: "fit-content",
                            }}
                          >
                            Salir <i className="fas fa-sign-out-alt" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="navBar bg-nav text-light d-flex align-items-center">
          <div className="container p-0">
            <div className="row m-0">
              <div className="col-md-auto d-flex p-0 justify-content-between">
                <Link className="mx-1 my-0 p-0" to="/">
                  <img className="navBarLogo navbar-brand" src={logo} alt="" />
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
export default NavBar;
