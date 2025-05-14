import { useState } from "react";
import { useSelector } from "react-redux";

export default function FrequencyToMany({ filters }) {
  const { devicePage } = useSelector((state) => state.devices);
  const [openModal, setOpenModal] = useState(false);

  function toggleModal(e) {
    e.preventDefault();
    setOpenModal(!openModal);
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-primary"
        disabled={devicePage.quantity < 1}
        onClick={toggleModal}
      >
        <i className="far fa-calendar-alt me-2"></i>
        Asignar Frecuencia
      </button>

      {openModal && (
        <div className="modal" aria-labelledby="exampleModalLabel">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Asignar frecuencia en rango
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={toggleModal}
                />
              </div>
              <div className="modal-body">
                <p>
                  La frecuencia seleccionada le será asignada a los siguientes
                  equipos:
                </p>
                <p>{JSON.stringify(filters)}</p>
              </div>
              {/* <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
