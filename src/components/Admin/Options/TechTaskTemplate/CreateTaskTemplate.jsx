import { faPencil, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { techTaskTemplateActions } from "../../../../actions/StoreActions";
import { ErrorModal, SuccessModal } from "../../../warnings";
import { OrderField, TextAreaField } from "../../../workOrder/OrderFields";
import AddSubtaskModal from "../../../workOrder/TechOrderForm/AddSubtaskModal";
import { mapToFormSubtask } from "../../../workOrder/TechOrderForm/helpers";
import SubtasksSection from "../../../workOrder/TechOrderForm/SubtasksSection";

const emptyTask = {
  name: "",
  description: "",
  subtasks: [],
};
export function CreateTaskTemplate({ editTemplateTask }) {
  const { techTaskTemplateResult } = useSelector(
    (state) => state.techTaskTemplates,
  );
  const { list: subtaskList } = useSelector((state) => state.subTasks);
  const [searchKey, setSearchKey] = useState("");
  const [addSubtasks, setAddSubtasks] = useState(false);
  const [subtasks, setSubtasks] = useState(editTemplateTask?.subtasks || []);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [newTask, setNewTask] = useState(editTemplateTask || emptyTask);

  function handleInput(e) {
    e.preventDefault(e);
    const { name, value } = e.currentTarget;
    setNewTask({ ...newTask, [name]: value || "" });
  }

  function handleClose() {
    setOpenModal(false);
    setNewTask(emptyTask);
  }

  function handleCloseSuccess() {
    dispatch(techTaskTemplateActions.resetResult());
    handleClose();
  }

  function handleError() {
    dispatch(techTaskTemplateActions.resetResult());
  }
  function handleAddSubtask(subtask) {
    setSubtasks((prev) => [
      mapToFormSubtask(subtask, 0),
      ...prev.map((s, i) => ({ ...s, order: i + 1 })),
    ]);
  }
  function handleSubmit() {
    const payload = {
      ...newTask,
      subtasks,
    };
    if (editTemplateTask) {
      dispatch(techTaskTemplateActions.update(editTemplateTask._id, payload));
    } else {
      dispatch(techTaskTemplateActions.create(payload));
    }
  }

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="btn btn-xs btn-info btn-outline"
      >
        {editTemplateTask ? (
          <>
            <FontAwesomeIcon icon={faPencil} /> Editar Tarea
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faPlus} /> Agregar Tarea
          </>
        )}
      </button>
      {openModal && (
        <dialog className="modal w-full h-full bg-neutral/50" open={openModal}>
          <div className="modal-box bg-base-200 p-4 relative flex flex-col gap-2 w-11/12 max-w-7xl">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
              className="absolute top-2 right-2"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 mx-1" />
            </button>
            <h3 className="font-bold text-lg mb-3">Nueva Tarea</h3>
            <OrderField
              className="w-full"
              field="Nombre"
              name="name"
              displayEmpty
              onInput={handleInput}
              value={newTask.name}
              required={!newTask.name}
            />
            <TextAreaField
              className="w-full"
              field="Descripción"
              name="description"
              onInput={handleInput}
              value={newTask.description}
            />
            <div className="flex gap-2 w-full items-center justify-between">
              <div className="font-bold">Subtareas:</div>
              <button
                className="btn btn-xs btn-secondary btn-outline"
                onClick={() => setAddSubtasks(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
                Agregar Subtareas
              </button>
            </div>
            {subtasks.length === 0 ? (
              <p className="text-sm opacity-40 py-6 text-center">
                Seleccioná un template o cargá subtareas manualmente.
              </p>
            ) : (
              <div className="mt-2">
                <SubtasksSection
                  subtasks={subtasks}
                  setSubtasks={setSubtasks}
                  schemaOnly
                />
              </div>
            )}

            <div className="modal-action mt-2">
              <button onClick={handleSubmit} className="btn btn-sm btn-success">
                {editTemplateTask ? "Guardar" : "Crear"} Tarea
              </button>
            </div>
          </div>
          {techTaskTemplateResult.success && (
            <SuccessModal
              message="Tarea guardada exitosamente."
              close={handleCloseSuccess}
              open
            />
          )}
          {techTaskTemplateResult.error && (
            <ErrorModal
              message={`Error: ${techTaskTemplateResult.error}`}
              close={handleError}
              open
            />
          )}
        </dialog>
      )}
      {addSubtasks && (
        <AddSubtaskModal
          open={true}
          onClose={() => setAddSubtasks(false)}
          onAdd={handleAddSubtask}
          currentIds={subtasks.map((s) => s._id)}
        />
      )}
    </>
  );
}
