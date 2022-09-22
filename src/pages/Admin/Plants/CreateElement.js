import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";
import { FormInput } from "../../../components/forms/FormInput/index.js";
import {
  ErrorModal,
  SuccessModal,
} from "../../../components/warnings/index.js";
import { appConfig } from "../../../config.js";

const { headersRef } = appConfig;
const servicePoint = "servicePoint";

export default function CreateElement(props) {
  const { item, close, element, save, data } = props;
  const { plantResult } = useSelector((state) => state.plants);
  const [codeName, setCodeName] = useState(
    element
      ? { code: element.code, name: element.name }
      : { code: "", name: "" }
  );
  const [error, setError] = useState(undefined);
  const [bodyArray, setBodyArray] = useState([]);
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  function handleChange(e) {
    const { name, value } = e.target;
    setCodeName({ ...codeName, [name]: value.toUpperCase() });
  }

  const [adds, setAdds] = useState(
    item === servicePoint
      ? {
          steelMine: element ? element.steelMine : false,
          calory: element ? element.calory : false,
          dangerTask: element ? element.dangerTask : false,
          insalubrity: element ? element.insalubrity : false,
        }
      : undefined
  );

  const parent = {
    plant: null,
    area: "plant",
    line: "area",
    servicePoint: "line",
  };

  function setAddValue(e) {
    e.preventDefault();
    const { value } = e.target;
    setAdds({
      ...adds,
      [value]: !adds[value],
    });
  }

  function saveData(e) {
    e.preventDefault();
    const body = {};
    if (element) {
      body[item] = { ...codeName, ...adds };
      body.previous = element;
    } else {
      const key = item + "s";
      body[key] = bodyArray;
      if (parent[item])
        body[key].map((e) => (e[parent[item]] = data[parent[item]]));
    }
    setSaving(true);
    dispatch(save(body));
  }

  function addToArrayBody(e) {
    e.preventDefault();
    const { code, name } = codeName;
    const check = bodyArray.find(
      (e) => (code && e.code === code) || (name && e.name === name)
    );
    if (check) {
      setError("Código o Nombre ya presentes en la lista");
    } else {
      let newItem = { ...codeName };
      if (adds) newItem = { ...newItem, ...adds };
      setBodyArray([...bodyArray, newItem]);
      setCodeName({ code: "", name: "" });
      let resetAdds = { ...adds };
      Object.keys(resetAdds).map((k) => (resetAdds[k] = false));
      setAdds(resetAdds);
    }
  }

  function handleDelete(e, element) {
    e.preventDefault();
    setBodyArray(
      bodyArray.filter((e) =>
        e.code ? e.code !== element.code : e.name !== element.name
      )
    );
  }

  useEffect(() => {
    if (!error) return;
    !bodyArray.find(
      (e) =>
        e.code.toLowerCase() === codeName.code.toLowerCase() ||
        e.name.toLowerCase() === codeName.name.toLowerCase()
    ) && setError(undefined);
  }, [codeName, bodyArray, error]);

  return (
    <div className="modal">
      <form className="bg-light container w-auto rounded-2 py-2">
        <div className="row justify-content-end">
          <button className="btn btn-close" onClick={close} />
        </div>
        <h4 className="text-center">
          {(element ? "Editar " : "Crear ") +
            headersRef[item] +
            (element ? " " + element.name : "")}
        </h4>
        {parent[item] && (
          <div className="my-1 fw-bold">
            {headersRef[parent[item]]}: {data[parent[item]].name}
          </div>
        )}
        {item !== servicePoint && (
          <FormInput
            label="Código"
            name="code"
            value={codeName.code}
            placeholder={`ingrese código de ${headersRef[item]}`}
            changeInput={handleChange}
          />
        )}
        <FormInput
          label="Nombre"
          name="name"
          value={codeName.name}
          placeholder={`ingrese nombre de ${headersRef[item]}`}
          changeInput={handleChange}
        />
        {item === servicePoint && (
          <div>
            {["steelMine", "calory", "dangerTask", "insalubrity"].map(
              (key, i) => (
                <button
                  key={i}
                  value={key}
                  className={`btn ${
                    adds[key] ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={setAddValue}
                >
                  {headersRef[key]}
                </button>
              )
            )}
          </div>
        )}
        {!element && (
          <div className="row justify-content-center pt-2">
            {error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <button
                className="btn btn-info w-auto py-0"
                disabled={
                  (item !== servicePoint && !codeName.code) || !codeName.name
                }
                onClick={(e) => addToArrayBody(e)}
              >
                Agregar {headersRef[item]} a crear
              </button>
            )}
          </div>
        )}
        {bodyArray.map((element, i) => (
          <div
            key={i}
            className="flex border-4 justify-content-between align-items-center mt-1 border-bottom"
          >
            <div>
              <div>
                {element.code && "[" + element.code + "]"} {element.name}
              </div>
              <div className="d-flex gap-1">
                {adds &&
                  Object.keys(adds)
                    .filter((k) => !!element[k])
                    .map((k, i) => (
                      <span key={i} className="badge bg-primary">
                        {headersRef[k]}
                      </span>
                    ))}
              </div>
            </div>

            <button
              className="btn btn-danger py-0"
              onClick={(event) => handleDelete(event, element)}
            >
              <i className="fas fa-minus" />
            </button>
          </div>
        ))}
        <div className="flex w-100 justify-content-evenly mt-4">
          <button
            className="btn btn-success col-5"
            onClick={saveData}
            disabled={!bodyArray[0] && element === codeName}
          >
            GUARDAR
          </button>
        </div>
        {plantResult.error && (
          <ErrorModal
            message={plantResult.error}
            close={() => dispatch(plantActions.resetResult())}
          />
        )}
        {plantResult.success && saving && (
          <SuccessModal
            message="Guardado exitoso"
            close={() => {
              dispatch(plantActions.resetResult());
              setSaving(false);
              close();
            }}
          />
        )}
      </form>
    </div>
  );
}
