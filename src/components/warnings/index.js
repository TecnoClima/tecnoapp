import { Link } from "react-router-dom";

export const ErrorModal = ({ message, close, open }) => {
  function handleClose(e) {
    e.preventDefault();
    close();
  }
  return (
    <dialog id="error-modal" className="modal w-full h-full" open={open}>
      <div className="modal-box bg-error text-error-content p-4 relative">
        <h3 className="font-bold text-lg">Ocurrió un error</h3>
        <p className="py-1">{message}</p>
        <div className="modal-action mt-2">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-error bg-neutral/50 text-base-content border-none"
              onClick={handleClose}
            >
              Entendido
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export const SuccessModal = ({ message, link, close, open }) => {
  function handleClose(e) {
    e.preventDefault();
    close();
  }
  return (
    <dialog id="success-modal" className="modal w-full h-full" open={open}>
      <div className="modal-box bg-success text-success-content p-4 relative">
        <h3 className="font-bold text-lg">¡Éxito!</h3>
        <p className="py-1">{message}</p>
        {link && (
          <Link to={link} className="py-1 underline">
            Click aquí para acceder
          </Link>
        )}
        <div className="modal-action mt-2">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-success bg-neutral/50 text-base-content border-none"
              onClick={handleClose}
            >
              Entendido
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
