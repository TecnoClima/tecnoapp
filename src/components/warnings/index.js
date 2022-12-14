import { Link } from "react-router-dom";

export const ErrorModal = (props) => {
  const { message, close } = props;
  function handleClose(e) {
    e.preventDefault();
    close();
  }
  return (
    <div className="modal" style={{ zIndex: "none" }}>
      <form className="alert alert-danger" onSubmit={handleClose} role="alert">
        <div className="container">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col-12">
              <h3 style={{ textAlign: "center" }}>ERROR</h3>
              <h5 style={{ textAlign: "center" }}>{message}</h5>
            </div>
          </div>
          <div className="row" style={{ alignItems: "center" }}>
            Si no logra resolverlo, dé aviso al administrador.
          </div>
          <div className="row" style={{ alignItems: "center" }}>
            <button className="btn btn-danger" type="submit">
              Cerrar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const SuccessModal = ({ message, link, close }) => {
  function handleClose(e) {
    e.preventDefault();
    close();
  }
  return (
    <div className="modal" style={{ zIndex: "none" }}>
      <form className="alert alert-success" onSubmit={handleClose} role="alert">
        <div className="container">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col-12">
              <h3 style={{ textAlign: "center" }}>¡ÉXITO!</h3>
              <h5 style={{ textAlign: "center" }}>{message}</h5>
            </div>
          </div>
          {link && (
            <div className="row" style={{ alignItems: "center" }}>
              <Link to={link}>Click aquí para acceder</Link>.
            </div>
          )}
          <div className="row" style={{ alignItems: "center" }}>
            <button className="btn btn-success" type="submit">
              Aceptar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
