import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { OrderField } from "../workOrder/OrderFields";
import { useDispatch, useSelector } from "react-redux";
import { optionActions, subTaskActions } from "../../actions/StoreActions";
import { ErrorModal, SuccessModal } from "../warnings";

const resultTypes = [
  { value: "boolean", label: "Sí / No / N/A" },
  { value: "approved", label: "Aprobó / Alerta / Falló" },
  { value: "number", label: "Número" },
  { value: "text", label: "Texto" },
  { value: "gps", label: "GPS" },
];

const emptyTask = {
  devicePart: "",
  procedure: "",
  resultType: "",
};

export function CreateSubTask() {
  const { subTaskResult, list: subtaskList } = useSelector(
    (state) => state.subTasks,
  );
  const { list: optionList } = useSelector((state) => state.options);
  const targetCollection = "subTask";

  const [openModal, setOpenModal] = useState(false);
  const [newTask, setNewTask] = useState(emptyTask);
  const dispatch = useDispatch();

  const devicePartList = optionList
    .filter(({ type }) => type === "devicePart")
    .map(({ label }) => label);
  const resultTypesOptions = resultTypes.map(({ label }) => label);

  useEffect(
    () => dispatch(optionActions.getList(targetCollection)),
    [dispatch],
  );

  function handleInput(e) {
    e.preventDefault(e);
    const { name, value } = e.currentTarget;
    setNewTask({ ...newTask, [name]: value || "" });
  }

  function handleSubmit(e) {
    e.preventDefault(e);
    const newOption = {
      devicePart: optionList
        .filter(({ type }) => type === "devicePart")
        .find(({ label }) => label === newTask.devicePart),
      procedure: newTask.procedure,
      resultType: resultTypes.find(({ label }) => label === newTask.resultType)
        .value,
    };
    dispatch(subTaskActions.create(newOption));
  }

  function handleClose() {
    setOpenModal(false);
    setNewTask(emptyTask);
  }

  function handleCloseSucces() {
    dispatch(subTaskActions.resetResult());
    handleClose();
  }

  function handleError() {
    dispatch(subTaskActions.resetResult());
  }

  useEffect(() => console.log("subtaskList", subtaskList), [subtaskList]);

  return (
    <>
      {openModal && (
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
            <h3 className="font-bold text-lg mb-3">Nueva subtarea</h3>
            <OrderField
              className="w-full"
              field="Parte / Lugar"
              name="devicePart"
              displayEmpty
              options={devicePartList}
              onInput={handleInput}
              value={newTask.devicePart}
            />
            <OrderField
              className="w-full"
              field="Procedimiento"
              name="procedure"
              onInput={handleInput}
              value={newTask.procedure}
            />
            <OrderField
              className="w-full"
              field="Tipo resultado"
              name="resultType"
              displayEmpty
              options={resultTypesOptions}
              onInput={handleInput}
              value={newTask.resultType}
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
          {subTaskResult.success && (
            <SuccessModal
              message="Subtarea guardada exitosamente."
              close={handleCloseSucces}
              open
            />
          )}
          {subTaskResult.error && (
            <ErrorModal
              message={`Error: ${subTaskResult.error}`}
              close={handleError}
              open
            />
          )}
        </dialog>
      )}

      <button
        onClick={() => setOpenModal(true)}
        className="btn btn-xs btn-info btn-outline"
      >
        <FontAwesomeIcon icon={faPlus} /> Agregar subtarea
      </button>
    </>
  );
}
