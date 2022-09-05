import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions, plantActions } from "../../../actions/StoreActions";
import { ErrorModal, SuccessModal } from "../../warnings";
import { FormInput, FormSelector } from "../FormInput";

export default function RegisterForm() {
  const { plantList, areaList, lineList } = useSelector(
    (state) => state.plants
  );
  const { peopleResult } = useSelector((state) => state.people);
  const [newUser, setNewUser] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => dispatch(plantActions.getPlants()), [dispatch]);
  useEffect(() => dispatch(plantActions.getAreas()), [dispatch]);
  useEffect(() => dispatch(plantActions.getLines()), [dispatch]);

  const formFields = useMemo(
    () => [
      {
        label: "Nombre",
        name: "name",
        placeholder: "Nombre y Apellido",
      },
      {
        label: "DNI",
        name: "idNumber",
        type: "number",
        placeholder: "DNI de 8 dígitos sin puntos",
        min: 0,
        max: 99999999,
        validation:
          newUser.idNumber &&
          (newUser.idNumber.length !== 8 || newUser.idNumber.includes(".")) &&
          "Debe tener 8 dígitos, sin puntos",
      },
      {
        label: "E-mail",
        name: "email",
        placeholder: "correo@host.com",
        validation:
          newUser.email &&
          (!newUser.email.includes("@") ||
            newUser.email.split("@")[1].split(".").length <= 1) &&
          `debe tener la forma 'usuario@correo.com'`,
      },
      {
        label: "Contraseña",
        name: "password",
        type: "password",
        placeholder: "contraseña",
      },
      {
        label: "Teléfono",
        name: "phone",
        validation:
          newUser.phone &&
          (newUser.phone.length !== 10 || isNaN(newUser.phone)) &&
          "Debe tener 10 dígitos, sin 0 ni 15",
      },
    ],
    [newUser]
  );

  function addNewUser() {
    dispatch(peopleActions.addNew(newUser));
  }

  function setValue(e) {
    e.preventDefault();
    const { name, value } = e.target;
    const user = { ...newUser };
    if (!value) {
      delete user[name];
    } else {
      user[name] = value;
    }
    setNewUser(user);
  }

  function setPlant(e) {
    e.preventDefault();
    const { name, value } = e.target;
    const user = { ...newUser };
    if (!value) {
      delete user[name];
      if (name === "plant") delete user.area;
      if (["area", "plant"].includes(name)) delete user.line;
    } else {
      user[name] = value;
    }
    setNewUser(user);
  }

  useEffect(() => {
    const props = ["plant", ...formFields.map((f) => f.name)];
    let errors = [];
    for (let prop of props) {
      const field = formFields.find((f) => f.name === prop);
      const validation = field ? field.validation : undefined;
      if (!newUser[prop] || validation) {
        errors.push(prop);
      }
    }
    setErrors(errors);
  }, [formFields, newUser]);

  return (
    <div className="container">
      <div className="row">
        <h2>Alta de usuario</h2>
      </div>
      <div className="row">
        <div className="col py-4">
          <FormSelector
            label="Planta"
            valueField="_id"
            captionField="name"
            name="plant"
            options={plantList}
            onSelect={setPlant}
          />
          {newUser.plant && (
            <FormSelector
              label="Area"
              valueField="_id"
              captionField="name"
              name="area"
              options={areaList.filter((a) =>
                newUser.plant ? a.plant === newUser.plant : a
              )}
              onSelect={setPlant}
            />
          )}
          {newUser.area && (
            <FormSelector
              label="Linea"
              valueField="_id"
              captionField="name"
              name="line"
              options={lineList.filter((l) =>
                newUser.area ? l.area === newUser.area : l
              )}
              onSelect={setPlant}
            />
          )}
          {!newUser.plant && <div className="errorMessage">Dato necesario</div>}
        </div>
      </div>
      <div className="row">
        <div className="col">
          {formFields.map((item) => {
            const { validation } = item;
            return (
              <div>
                <FormInput
                  label={item.label}
                  placeholder={item.placeholder}
                  name={item.name}
                  type={item.type || "text"}
                  value={newUser[item.name]}
                  changeInput={setValue}
                  min={item.min}
                  max={item.max}
                />
                {!newUser[item.name] && (
                  <div className="errorMessage">Dato necesario</div>
                )}
                {newUser[item.name] && validation && (
                  <div className="errorMessage">{validation}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="row justify-content-center pt-2 pb-4">
        <button
          className="btn btn-success w-auto "
          disabled={errors.length > 0}
          onClick={addNewUser}
        >
          Registrar Usuario
        </button>
      </div>
      <div className=""></div>
      {peopleResult.error && (
        <ErrorModal
          message={peopleResult.error}
          close={() => dispatch(peopleActions.resetResult())}
        />
      )}
      {peopleResult.success && (
        <SuccessModal
          message={`Su nombre de usuario es '${peopleResult.success.username}'`}
          close={() => dispatch(peopleActions.resetResult())}
        />
      )}
    </div>
  );
}
