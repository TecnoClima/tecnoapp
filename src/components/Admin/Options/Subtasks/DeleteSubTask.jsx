import { useDispatch, useSelector } from "react-redux";
import { subTaskActions } from "../../../../actions/StoreActions";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import WarningErrors from "../../../warnings/WarningErrors";
import { ErrorModal, SuccessModal } from "../../../warnings";

export function DeleteSubTask({ id, procedure }) {
  const { subTaskResult } = useSelector((state) => state.subTasks);

  const [subtaskToDelete, setSubTaskToDelete] = useState("");
  const dispatch = useDispatch();

  function deleteSubtask() {
    dispatch(subTaskActions.delete(subtaskToDelete));
  }
  function handleClickDelete(e) {
    const { value } = e.currentTarget;
    setSubTaskToDelete(value);
  }
  function handleCancel() {
    setSubTaskToDelete("");
  }
  function handleClosSuccess() {
    setSubTaskToDelete("");
    dispatch(subTaskActions.resetResult());
  }
  function handleCloseError() {
    dispatch(subTaskActions.resetResult());
  }

  return (
    <>
      <button
        onClick={handleClickDelete}
        className="btn btn-xs btn-error my-1"
        value={id}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
      {subtaskToDelete && (
        <WarningErrors
          warnings={[
            <>
              ¿Confirma que desea eliminar la subtarea <b>{procedure}</b>?
            </>,
          ]}
          proceed={deleteSubtask}
          open={true}
          close={handleCancel}
        />
      )}
      {subtaskToDelete && subTaskResult.success && (
        <SuccessModal
          message="Subtarea eliminada exitosamente."
          close={handleClosSuccess}
          open
        />
      )}
      {subtaskToDelete && subTaskResult.error && (
        <ErrorModal
          message={`Error: ${subTaskResult.error}`}
          close={handleCloseError}
          open
        />
      )}
    </>
  );
}
