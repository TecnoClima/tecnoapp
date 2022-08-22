import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser, updateUser } from "../../../actions/peopleActions";
import { FormInput, FormSelector } from "../../../pages/Admin/Devices";
import "./index.css";

export default function UserDetail(props) {
  //Create, View and Update
  const { user } = props;
  const [newUser, setNewUser] = useState(user === "new" ? {} : { ...user });
  const dispatch = useDispatch();

  const inputFields = [
    { label: "Nombre", item: "name", placeholder: "Nombre y Apellido" },
    { label: "Usuario", item: "name", placeholder: "Nombre de usuario" },
    { label: "Contraseña", item: "name", placeholder: "Contraseña Temporal" },
    { label: "N° ID", item: "name", placeholder: "DNI sin puntos ni espacios" },
    { label: "Email", item: "name", placeholder: "ejemplo@host.com" },
    { label: "Teléfono", item: "name", placeholder: "Teléfono de contacto" },
  ];

  const selectFields = [
    { label: "Cargo", item: "charge", array: props.charge },
    { label: "Acceso", item: "access", array: props.access },
    { label: "Planta", item: "plant", array: props.plant },
  ];

  function updateNewUser(e) {
    const item = e.target.name;
    const value = e.target.value;
    setNewUser({ ...newUser, [item]: value });
  }

  //   function UserField(props) {
  //     return (
  //       <div className="formInput">
  //         <label className="dropdownLabel">{props.label}</label>
  //         <input
  //           className="textInput"
  //           id={`user${props.item}`}
  //           placeholder={props.placeholder}
  //           defaultValue={
  //             props.item === "password"
  //               ? undefined
  //               : user[props.item] || undefined
  //           }
  //           onBlur={(event) =>
  //             setNewUser({ ...newUser, [props.item]: event.target.value })
  //           }
  //           readOnly={false}
  //         />
  //       </div>
  //     );
  //   }

  function handleSubmit(e) {
    e.preventDefault();
    if (user === "new") {
      dispatch(addUser(newUser));
    } else {
      dispatch(updateUser(user.idNumber, newUser));
    }
  }

  return (
    <div className="modal">
      <form
        className="bg-light rounded-2 w-auto"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="container px-3 pb-3">
          <div className="row justify-content-end mt-2">
            <button
              className="btn btn-close float-end"
              onClick={() => props.close()}
            />
          </div>
          <div className="row">
            <h4>{`${user === "new" ? "Nuevo" : "Editar"} usuario`}</h4>
          </div>

          <div className="row">
            <div className="col">
              {inputFields.map((e) => (
                <div className="d-flex w-100">
                  <FormInput
                    className={"w-100"}
                    label={e.label}
                    item={e.item}
                    placeholder={e.placeholder}
                    select={updateNewUser}
                    type={e.item === "password" ? "password" : undefined}
                  />
                </div>
              ))}
              {props.charge &&
                props.plant &&
                props.access &&
                selectFields.map((e) => (
                  <FormSelector
                    className={"w-100"}
                    label={e.label}
                    array={e.array}
                    item={e.item}
                    placeholder={props[e.item] || undefined}
                    select={updateNewUser}
                  />
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
        {/* 
        {UserField({
          label: "Nombre",
          placeholder: "Nombre y apellido",
          item: "name",
        })}
        {UserField({
          label: "Usuario",
          placeholder: "ingrese nombre de usuario",
          item: "username",
        })}
        {UserField({
          label: "Contraseña",
          placeholder: "Contraseña temporal",
          item: "password",
        })}
        {UserField({
          label: "N° ID",
          placeholder: "Ingrese DNI",
          item: "idNumber",
        })}
        {UserField({
          label: "Email",
          placeholder: "Ingrese correo electrónico",
          item: "email",
        })}
        {UserField({
          label: "Teléfono",
          placeholder: "Ingrese teléfono de contacto",
          item: "phone",
        })} */}

        {/* {DropdownChoice(
          "charge",
          props.charge,
          (item, value) => setNewUser({ ...newUser, [item]: value }),
          user.charge || undefined
        )}
        {DropdownChoice(
          "access",
          props.access,
          (item, value) => setNewUser({ ...newUser, [item]: value }),
          user.access || undefined
        )}
        {DropdownChoice(
          "plant",
          props.plant,
          (item, value) => setNewUser({ ...newUser, [item]: value }),
          user.plant ? user.plant.name : undefined
        )} */}

        {/* <button
          type="submit"
          className="btn btn-success m-1"
          disabled={JSON.stringify(newUser) === JSON.stringify(user)}
        >
          GUARDAR USUARIO
        </button> */}
      </form>
    </div>
  );
}
