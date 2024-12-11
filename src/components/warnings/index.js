import { Link } from "react-router-dom";

export const ErrorModal = (props) => {
  const { message, close } = props;
  function handleClose(e) {
    e.preventDefault();
    close();
  }
  // <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button>
  return (
    <dialog id="error-modal" className="modal w-full h-full" open>
      <div className="modal-box bg-error text-error-content">
        <h3 className="font-bold text-lg">Ocurrió un error</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" onClick={handleClose}>
              Entendido
            </button>
          </form>
        </div>
      </div>
    </dialog>
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
