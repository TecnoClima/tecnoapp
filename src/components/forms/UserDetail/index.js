import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions } from "../../../actions/StoreActions";
// import { FormInput, FormSelector } from "../../../pages/Admin/Devices";
import { FormInput, FormSelector } from "../../../components/forms/FormInput";

import { ErrorModal, SuccessModal } from "../../warnings";
import "./index.css";

export default function UserDetail(props) {
  const emptyUser = {
    name: "",
    username: "",
    password: "",
    idNumber: "",
    email: "",
    phone: "",
    charge: "",
    access: "",
    plant: "",
  };
  const [user, setUser] = useState(props.user);
  const { peopleResult } = useSelector((state) => state.people);
  const [newUser, setNewUser] = useState(
    user === "new" ? emptyUser : { ...user }
  );
  const dispatch = useDispatch();

  const inputFields = [
    { label: "Nombre", item: "name", placeholder: "Nombre y Apellido" },
    { label: "Usuario", item: "username", placeholder: "Nombre de usuario" },
    {
      label: "Contraseña",
      item: "password",
      placeholder: "Contraseña Temporal",
    },
    {
      label: "N° ID",
      item: "idNumber",
      placeholder: "DNI sin puntos ni espacios",
    },
    { label: "Email", item: "email", placeholder: "ejemplo@host.com" },
    { label: "Teléfono", item: "phone", placeholder: "Teléfono de contacto" },
  ];

  const selectFields = [
    { label: "Cargo", item: "charge", array: props.charge },
    {
      label: "Acceso",
      item: "access",
      array: props.access,
      valueField: "access",
      captionField: "acceso",
    },
    { label: "Planta", item: "plant", array: props.plant },
  ];

  function updateNewUser(e) {
    const item = e.target.name;
    const value = e.target.value;
    setNewUser({ ...newUser, [item]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    for (let key of Object.keys(newUser))
      if (!newUser[key]) delete newUser[key];
    if (user === "new") {
      dispatch(peopleActions.addNew(newUser));
    } else {
      const update = { ...newUser };
      for (let key of Object.keys(update))
        if (update[key] === user[key]) delete update[key];
      dispatch(peopleActions.updateUser(user._id, update));
    }
  }

  function handleCloseSuccess() {
    dispatch(peopleActions.resetResult());
    if (props.user === "new") {
      setNewUser(emptyUser);
    } else {
      setUser(newUser);
    }
  }

  return (
    <div className="modal">
      <form className="bg-light rounded-2 w-auto" onSubmit={handleSubmit}>
        <div className="container px-3 pb-3">
          <div className="row justify-content-end mt-2">
            <button className="btn btn-close float-end" onClick={props.close} />
          </div>
          <div className="row">
            <h4>{`${user === "new" ? "Nuevo" : "Editar"} usuario`}</h4>
          </div>

          <div className="row">
            <div className="col">
              {inputFields.map((e, i) => (
                <div className="d-flex w-100 mb-1" key={i}>
                  <FormInput
                    className={"w-100"}
                    label={e.label}
                    name={e.item}
                    value={newUser[e.item]}
                    placeholder={e.placeholder}
                    changeInput={updateNewUser}
                    type={e.item === "password" ? "password" : undefined}
                  />
                </div>
              ))}
              {props.charge &&
                props.plant &&
                props.access &&
                selectFields.map((e, i) => (
                  <div key={i}>
                    <FormSelector
                      className={"w-100 mb-1"}
                      label={e.label}
                      options={e.array}
                      valueField={e.valueField || undefined}
                      captionField={e.captionField || undefined}
                      name={e.item}
                      placeholder={props[e.item] || undefined}
                      value={newUser[e.item]}
                      onSelect={updateNewUser}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="row justify-content-center">
            <button
              type="submit"
              className="btn btn-success m-1 w-auto"
              disabled={JSON.stringify(newUser) === JSON.stringify(user)}
            >
              GUARDAR USUARIO
            </button>
          </div>
        </div>
      </form>
      {peopleResult.success && (
        <SuccessModal
          message="Los cambios se han guardado"
          close={handleCloseSuccess}
        />
      )}
      {peopleResult.error && (
        <ErrorModal
          message={peopleResult.error}
          close={() => dispatch(peopleActions.resetResult())}
        />
      )}
    </div>
  );
}
