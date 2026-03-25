import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { OrderField } from "../workOrder/OrderFields";
import { useDispatch, useSelector } from "react-redux";
import { optionActions } from "../../actions/StoreActions";
import { ErrorModal, SuccessModal } from "../warnings";
import { appConfig } from "../../config";
const { headersRef } = appConfig;

export function CreateOrderOptionValues({ order, targetCollection, type }) {
  const { optionResult } = useSelector((state) => state.options);
  const [openModal, setOpenModal] = useState(false);
  const [newValue, setNewValue] = useState("");
  const dispatch = useDispatch();

  function handleInput(e) {
    e.preventDefault(e);
    const { value } = e.currentTarget;
    setNewValue(value);
  }

  function handleSubmit(e) {
    e.preventDefault(e);
    const newOption = {
      active: true,
      label: newValue,
      order,
      targetCollection,
      type,
      value: newValue.toLowerCase().split(" ").join("_"),
    };
    dispatch(optionActions.create(newOption));
  }

  function handleClose() {
    setOpenModal(false);
    setNewValue("");
  }

  function handleCloseSucces() {
    dispatch(optionActions.resetResult());
    handleClose();
  }

  function handleError() {
    dispatch(optionActions.resetResult());
  }

  return (
    <>
      {openModal ? (
        <dialog className="modal w-full h-full" open={openModal}>
          <div className="modal-box w-fit bg-base-200 p-4 relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
              className="absolute top-2 right-2"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 mx-1" />
            </button>
            <h3 className="font-bold text-lg mb-3">
              Nueva opción de {headersRef[type]}
            </h3>
            <OrderField
              field="Valor"
              name="label"
              onInput={handleInput}
              value={newValue}
            />

            <div className="modal-action mt-2">
              <button
                onClick={handleSubmit}
                className="btn btn-sm btn-error bg-neutral/50 text-base-content border-none"
              >
                Agregar
              </button>
            </div>
          </div>
          {optionResult.success && (
            <SuccessModal
              message="Opción guardada exitosamente."
              close={handleCloseSucces}
              open
            />
          )}
          {optionResult.error && (
            <ErrorModal
              message={`Error: ${optionResult.error}`}
              close={handleError}
              open
            />
          )}
        </dialog>
      ) : (
        <button
          onClick={() => setOpenModal(true)}
          className="btn btn-xs btn-info btn-outline"
        >
          <FontAwesomeIcon icon={faPlus} /> Agregar opción
        </button>
      )}
    </>
  );
}
