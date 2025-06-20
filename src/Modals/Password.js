import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions } from "../actions/StoreActions";
import { ErrorModal, SuccessModal } from "../components/warnings";
import TextInput from "../components/forms/FormFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function PasswordForm({ close, open }) {
  const { userData, peopleResult } = useSelector((state) => state.people);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  function handleClose(e) {
    e.preventDefault();
    close && close();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirm)
      return setError("Las contraseñas nuevas no coinciden.");
    dispatch(
      peopleActions.updateUser(userData.id, {
        currentPassword: password,
        newPassword: newPassword,
      })
    );
  }

  function handleCloseSuccess() {
    dispatch(peopleActions.resetResult());
    close && close();
  }

  return (
    <>
      <dialog className="modal" open={open}>
        <form
          className="modal-box bg-base-200 w-11/12 max-w-sm flex flex-col"
          onSubmit={handleSubmit}
        >
          <button className="ml-auto -mt-2 opacity-75 hover:opacity-100">
            <FontAwesomeIcon icon={faTimes} onClick={handleClose} />
          </button>
          <h3 className="font-bold text-lg pb-4">Cambio de Contraseña</h3>
          <div className="relative flex flex-col items-center">
            <TextInput
              label="Contraseña actual"
              name="currentPassword"
              handleChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
              placeholder="Escribe tu contraseña actual"
            />
            <TextInput
              label="Contraseña Nueva"
              name="newPassword"
              handleChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type="password"
              placeholder="Escribe tu nueva contraseña"
            />
            <TextInput
              label="Confirma tu nueva contraseña"
              name="confirmPassword"
              handleChange={(e) => setConfirm(e.target.value)}
              value={confirm}
              type="password"
              placeholder="Escribe otra vez tu nueva contraseña"
            />
          </div>
          <div className="relative w-full pt-2">
            <div
              role="alert"
              className={`alert alert-error p-2 text-sm gap-2 transition-all duration-300 ${
                error
                  ? "opacity-100 translate-y-0"
                  : "translate-y-full opacity-0"
              }`}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-0" />
              <span>"Las contraseñas nuevas no coinciden."</span>
              <button
                className="-translate-y-2 -translate-x-1"
                onClick={(e) => {
                  e.preventDefault();
                  setError("");
                }}
              >
                <FontAwesomeIcon icon={faTimes} className="mr-0" />
              </button>
            </div>
          </div>

          <div className="modal-action">
            {/* if there is a button, it will close the modal */}
            <button
              className="btn btn-primary btn-sm"
              type="submit"
              disabled={!newPassword || !confirm}
            >
              Cambiar
            </button>
          </div>
        </form>
      </dialog>
      <ErrorModal
        message={peopleResult.error}
        close={() => dispatch(peopleActions.resetResult())}
        open={peopleResult.error}
      />
      <SuccessModal
        message={"Contraseña actualizada exitosamente"}
        close={handleCloseSuccess}
        open={peopleResult.success}
      />
    </>
  );
}
