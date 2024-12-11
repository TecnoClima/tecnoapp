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
      <div className="card bg-base-200 w-11/12 max-w-fit shadow-xl shadow-neutral m-auto">
        <form className="card-body" onSubmit={(e) => login(e)}>
          <h2 className="card-title text-center mb-8">
            Sistema de Gestión de Mantenimiento
          </h2>
          <p className="mb-4">Ingresa tus credenciales para iniciar sesión</p>
          <label className="input input-bordered flex items-center gap-2 text-base-content/75 font-bold">
            <span className="w-24">Usuario</span>
            <input
              type="text"
              name="username"
              className="grow text-base-content font-normal"
              placeholder="Ingresa aquí tu nombre de usuario"
              onChange={setValue}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 text-base-content/75 font-bold">
            <span className="w-24">Contraseña</span>
            <input
              type="password"
              className="grow text-base-content font-normal"
              name="password"
              placeholder="Ingresa aquí tu contraseña"
              onChange={setValue}
            />
          </label>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary">Iniciar sesión</button>
          </div>
        </form>
      </div>
      {peopleResult.error && (
        <ErrorModal message={peopleResult.error} close={handleClose} />
      )}
    </>
  );
}
