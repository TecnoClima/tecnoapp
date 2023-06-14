import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logoTecnoclima.png";
import waiting from "../../assets/icons/waiting.gif";

export default function NotFound({ location }) {
  const navigate = useNavigate();

  return (
    <div className="container h-100">
      <div className="row">
        <div className="col d-flex justify-content-center">
          <img className="w-100" src={logo} alt="logo Tecnoclima"></img>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <h2 className="mb-4 fw-bold">Página no encontrada</h2>
          <h3 className="text-center">
            La ruta a la que intentas acceder no existe o requiere permisos para
            acceder. Intenta iniciar sesión o volver a la página anterior.
          </h3>
          <div className="d-flex mx-auto gap-3 my-4">
            <Link to="/" className="btn btn-info">
              Home
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-info"
            >
              Página Anterior
            </button>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-center">
          <img className="w-50" src={waiting} alt="esperando" />
        </div>
      </div>
    </div>
  );
}
