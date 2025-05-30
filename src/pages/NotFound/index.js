import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logoTecnoclima.png";
// import waiting from "../../assets/icons/waiting.gif";
import fan from "../../assets/fan.gif";

export default function NotFound({ location }) {
  const navigate = useNavigate();

  return (
    <div className="page-container h-full bg-base-200">
      <img className="w-80" src={logo} alt="logo Tecnoclima"></img>
      <div className="flex flex-col items-center my-auto">
        <div className="text-5xl font-bold">Oopsss...</div>

        <div className="flex flex-wrap-reverse w-3/4">
          <div className="flex min-w-60 flex-col w-1/2 justify-evenly flex-grow gap-8">
            <div className="page-subtitle text-base sm:text-lg">
              <div className="page-title">Página no encontrada</div>
              La ruta a la que intentas acceder no existe o requiere permisos
              para acceder. Intenta iniciar sesión o volver a la página
              anterior.
            </div>
            <div className="flex gap-3 mx-auto">
              <Link to="/" className="btn btn-info">
                Iniciar sesión
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="btn btn-outline btn-info"
              >
                Página Anterior
              </button>
            </div>
          </div>
          <div className="flex w-1/2 flex-grow">
            <div className="relative aspect-square flex justify-center overflow-hidden">
              <img className="object-cover" src={fan} alt="esperando" />
              <div className="absolute w-[140%] h-full bg-radial-gradient from-transparent via-base-200 to-base-200 -mx-[20%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
