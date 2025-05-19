import { faCalendarPlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSelector } from "react-redux";
import ModalBase from "../../Modals/ModalBase";

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
        className="btn btn-sm btn-primary flex gap-2"
        disabled={devicePage.quantity < 1}
        onClick={toggleModal}
      >
        <FontAwesomeIcon icon={faCalendarPlus} /> Asignar Frecuencia
      </button>

      <ModalBase
        open={openModal}
        title="Asignar frecuencia en rango"
        className="bg-base-200"
        onClose={toggleModal}
      >
        <div className="flex flex-wrap gap-1 justify-center">
          <div className="modal-body">
            <p>
              La frecuencia seleccionada le será asignada a los siguientes
              equipos:
            </p>
            <p>{JSON.stringify(filters)}</p>
          </div>
        </div>
      </ModalBase>
    </>
  );
}
