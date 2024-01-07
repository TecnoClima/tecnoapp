import React, { useState } from "react";
import "./index.css";
import Logo from "../../assets/icons/logoTecnoclima.png";
import LoginForm from "../../components/forms/LoginForm";
import RegisterForm from "../../components/forms/RegisterForm";
import Carrousell from "../../components/Carrousell/index";

export default function Landing() {
  const [register, setRegister] = useState(false);

  const mode = {
    dev: "desarrollo",
    test: "prueba",
  }[process.env.REACT_APP_ENV];

  return (
    <div className="landingBackground">
      {mode && (
        <div className="alert alert-danger fw-bold my-0 py-1">
          Aplicación en modo {mode}
        </div>
      )}
      <div className="landingWelcome">
        <div className="landingCorp ">
          <img className="landingLogo" src={Logo} alt="" />
          <div className="carouselContainer">
            <Carrousell />
          </div>
        </div>

        {register ? (
          <div className="d-flex flex-column align-items-center">
            <RegisterForm />
            Si ya tiene cuenta puede
            <div className="redirectLink" onClick={() => setRegister(false)}>
              Iniciar sesión
            </div>
          </div>
        ) : (
          <div className="landingForms">
            <LoginForm />
            ¿No tiene una cuenta?{" "}
            <div className="redirectLink" onClick={() => setRegister(true)}>
              Regístrese
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
