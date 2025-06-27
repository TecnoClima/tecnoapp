import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions } from "../../../actions/StoreActions";
import { ErrorModal } from "../../warnings";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { peopleResult } = useSelector((state) => state.people);
  const [loginData, setLoginData] = useState({});

  function login(e) {
    e.preventDefault();
    dispatch(peopleActions.auth(loginData));
  }

  function setValue(e) {
    e.preventDefault();
    dispatch(peopleActions.resetResult());
    const data = { ...loginData };
    const { name, value } = e.currentTarget;
    data[name] = value;
    setLoginData(data);
  }
  function handleClose() {
    dispatch(peopleActions.resetResult());
  }

  useEffect(() => {
    if (peopleResult.success) {
      const { token } = peopleResult.success;
      localStorage.setItem("tecnoToken", token);
      window.location = "/panel";
    }
  }, [peopleResult]);

  return (
    <>
      <div className="card bg-base-200 w-full max-w-sm shadow-xl shadow-neutral m-auto overflow-y-auto max-h-full">
        <form className="card-body p-4 md:p-8" onSubmit={(e) => login(e)}>
          <h2 className="card-title text-center mb-8">
            Sistema de Gestión de Mantenimiento
          </h2>
          <p className="mb-4">Ingresa tus credenciales para iniciar sesión</p>
          <label className="input input-bordered input-sm md:input-md flex items-center gap-2 text-base-content/75 font-bold">
            <span className="w-20 text-sm flex-none">Usuario</span>
            <input
              type="text"
              name="username"
              className="grow text-base-content font-normal"
              onChange={setValue}
            />
          </label>
          <label className="input input-bordered input-sm md:input-md flex items-center gap-2 text-base-content/75 font-bold">
            <span className="w-20 text-sm flex-none">Contraseña</span>
            <input
              type="password"
              className="grow text-base-content font-normal"
              name="password"
              onChange={setValue}
            />
          </label>
          <div className="card-actions justify-end mt-4">
            <button
              disabled={!loginData.username || !loginData.password}
              className="btn btn-primary btn-sm md:btn-md"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
      {peopleResult.error && (
        <ErrorModal
          open={true}
          message={peopleResult.error}
          close={handleClose}
        />
      )}
    </>
  );
}
