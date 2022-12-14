import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./index.css";
import { FormInput, FormSelector } from "../FormInput";
import { cylinderActions } from "../../../actions/StoreActions.js";
import { appConfig } from "../../../config";
const { cylinderStatuses } = appConfig;

const NewCylinder = ({ cylinder, onClose, statuses }) => {
  const dispatch = useDispatch();
  const [inputCylinder, setInputCylinder] = useState(
    cylinder
      ? { ...cylinder, assignedTo: cylinder.user ? cylinder.user.id : "" }
      : {}
  );
  const { refrigerants, cylinderResult } = useSelector(
    (state) => state.adminCylinders
  );
  const { workersList } = useSelector((s) => s.people);
  const [errors, setErrors] = useState(true);
  const [alarm, setAlarm] = useState(false);

  useEffect(() => {
    if (!cylinder || !cylinder.assignedTo) return;
    const newCylinder = { ...cylinder };
    newCylinder.assignedTo = cylinder.user.id || "";
    setInputCylinder(newCylinder);
  }, [cylinder]);

  const handleChange = (event) => {
    event.preventDefault();
    setAlarm(false);
    let { name, value } = event.target;
    if (name === "assignedTo") value = Number(value);
    const newCylinder = { ...inputCylinder };
    value ? (newCylinder[name] = value) : delete newCylinder[name];
    let errorList = [];
    if (!newCylinder.code) errorList.push("Falta ingresar código");
    if (!newCylinder.refrigerant) errorList.push("Falta ingresar refrigerante");
    if (name === "assignedTo") {
      newCylinder.user = workersList.find((w) => w.idNumber === value);
      delete newCylinder.status;
    }
    if (!newCylinder.initialStock) errorList.push("Falta asignar peso inicial");
    if (!newCylinder.status) errorList.push("Falta asignar estado");
    setErrors(errorList[0] ? errorList : false);
    setInputCylinder(newCylinder);
  };

  //Función para agregar una garrafa
  const handleSubmitCylinder = async (event) => {
    event.preventDefault();
    if (errors[0]) {
      setAlarm(true);
    } else if (inputCylinder.id) {
      dispatch(cylinderActions.update(inputCylinder));
    } else {
      dispatch(cylinderActions.addNew(inputCylinder));
    }
  };

  //Fin de la función para agregar una garrafa
  const handleClose = () => {
    dispatch(cylinderActions.resetResult());
    setInputCylinder({});
    setErrors(false);
    setAlarm(false);
    onClose();
  };

  useEffect(() => {
    if (cylinderResult.error) {
      setErrors([cylinderResult.error]);
      setAlarm(true);
    }
  }, [cylinderResult, dispatch]);

  return (
    <div className="modal">
      <form
        onSubmit={(e) => handleSubmitCylinder(e)}
        id="addCylinder"
        className="form bg-light p-3 container w-auto"
        style={{ alignItems: "center" }}
      >
        <div className="row justify-content-between">
          <div className="col">
            <h5>{inputCylinder.id ? "Editar " : "Agregar Nueva "} Garrafa</h5>
          </div>
          <div className="col-auto">
            <button className="btn btn-close" onClick={() => handleClose()} />
          </div>
        </div>
        <div className="row">
          <div className="col-12 d-flex flex-column gap-1">
            <FormInput
              label="Código"
              changeInput={(e) => handleChange(e)}
              name="code"
              defaultValue={inputCylinder.code}
              placeholder="Ingrese el código..."
            />

            <FormSelector
              label="Freon"
              name="refrigerant"
              options={refrigerants}
              valueField="id"
              defaultValue={inputCylinder.refrigerant}
              captionField="refrigerante"
              disabled={!inputCylinder.code}
              onSelect={(e) => handleChange(e)}
            />

            <FormInput
              label="Peso Inicial (kg)"
              name="initialStock"
              defaultValue={inputCylinder.initialStock}
              type="number"
              min="0"
              max="16"
              step=".1"
              placeholder="Peso [kg]"
              disabled={!inputCylinder.refrigerant}
              changeInput={(e) => handleChange(e)}
            />

            {inputCylinder.user && !inputCylinder.user.active && (
              <div className="errorMessage">
                El usuario asignado no se encuentra activo
              </div>
            )}
            <FormSelector
              label="Destino"
              name="assignedTo"
              valueField="idNumber"
              captionField="name"
              value={inputCylinder.assignedTo}
              disabled={!inputCylinder.initialStock}
              options={workersList}
              onSelect={handleChange}
            />

            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Estado</span>
              </div>
              {cylinderStatuses
                .filter(
                  (s) =>
                    s.name !== (inputCylinder.assignedTo ? "Nueva" : "En uso")
                )
                .map((s, i) => (
                  <button
                    key={i}
                    className={`btn ${
                      inputCylinder.status === s.name
                        ? s.class.selected
                        : s.class.unselected
                    }`}
                    name="status"
                    value={s.name}
                    onClick={handleChange}
                  >
                    {s.name}
                  </button>
                ))}
            </div>

            {!cylinderResult.success && (
              <div className="formField">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={!inputCylinder.status}
                >
                  GUARDAR GARRAFA
                </button>
              </div>
            )}
          </div>
        </div>

        {alarm && (
          <div className="alert alert-danger" role="alert">
            {errors.join(" - ")}
          </div>
        )}
        {cylinderResult.success && (
          <div
            className="alert alert-success"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            role="alert"
          >
            <div>{cylinderResult.success}</div>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleClose()}
            >
              Salir
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewCylinder;
