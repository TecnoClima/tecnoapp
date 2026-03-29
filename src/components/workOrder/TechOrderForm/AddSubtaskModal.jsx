import ModalBase from "../../../Modals/ModalBase";
import { SubTaskList } from "../../Admin/Options/Subtasks/SubTaskList";

export default function AddSubtaskModal({ open, onClose, onAdd, currentIds }) {
  function handleAdd(subtask) {
    onAdd(subtask);
  }

  function isSubtaskDisabled(subtask) {
    return currentIds.includes(subtask._id);
  }

  return (
    <ModalBase
      open={open}
      title="Seleccionar subtarea"
      onClose={onClose}
      className="w-11/12 sm:max-w-[56rem!important]"
    >
      <div className="max-h-[80vh] h-full overflow-y-auto">
        <SubTaskList
          handleAdd={handleAdd}
          isSubtaskDisabled={isSubtaskDisabled}
        />
      </div>
    </ModalBase>
  );
}
