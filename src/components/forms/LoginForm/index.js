import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions } from "../../../actions/StoreActions";
import { ErrorModal } from "../../warnings";
import { FormInput } from "../FormInput";
import "./index.css";

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
    const data = { ...loginData };
    const { name, value } = e.target;
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
  useEffect(() => console.log("loginData", loginData), [loginData]);

  return (
    <form className="container" onSubmit={(e) => login(e)}>
      <h2>Inicie sesión para comenzar</h2>
      <div className="row">
        <div className="col">
          <FormInput label="Usuario" name="username" changeInput={setValue} />
        </div>
      </div>
      <div className="row pt-2">
        <div className="col">
          <FormInput
            label="Contraseña"
            name="password"
            type="password"
            changeInput={setValue}
          />
        </div>
        <div className="row py-2 justify-content-center">
          <button
            className="btn btn-danger w-auto"
            type="sumbit"
            disabled={!loginData.username || !loginData.password}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
      {peopleResult.error && (
        <ErrorModal message={peopleResult.error} close={handleClose} />
      )}
    </form>
  );
}
