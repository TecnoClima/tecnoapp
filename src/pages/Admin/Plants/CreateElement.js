import React, { useEffect, useRef } from "react";
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

export default function CreateElement(props) {
  const { item, close, element, save, data } = props;
  const { plantResult } = useSelector((state) => state.plants);
  const [code, setCode] = useState(element ? element.code : "");
  const [name, setName] = useState(element ? element.name : "");
  const [error, setError] = useState(undefined);
  const [bodyArray, setBodyArray] = useState([]);
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  const parent = {
    plant: null,
    area: "plant",
    line: "area",
    servicePoint: "line",
  };

  useEffect(() => console.log("bodyArray", bodyArray), [bodyArray]);

  function saveData(e) {
    e.preventDefault();
    const body = {};
    if (element) {
      body[item] = { code, name };
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
    const check = bodyArray.find((e) => e.code === code || e.name === name);
    if (check) {
      setError("Código o Nombre ya presentes en la lista");
    } else {
      setBodyArray([
        ...bodyArray,
        { code: code.toUpperCase(), name: name.toUpperCase() },
      ]);
      setCode("");
      setName("");
    }
  }
  function handleDelete(e, element) {
    e.preventDefault();
    setBodyArray(bodyArray.filter((e) => e.code !== element.code));
  }
  useEffect(() => {
    if (!error) return;
    !bodyArray.find(
      (e) =>
        e.code.toLowerCase() === code.toLowerCase() ||
        e.name.toLowerCase() === name.toLowerCase()
    ) && setError(undefined);
  }, [code, name, bodyArray, error]);

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
        <FormInput
          label="Código"
          value={code}
          placeholder={`ingrese código de ${headersRef[item]}`}
          changeInput={(e) => setCode(e.target.value)}
        />
        <FormInput
          label="Nombre"
          value={name}
          placeholder={`ingrese nombre de ${headersRef[item]}`}
          changeInput={(e) => setName(e.target.value)}
        />
        {!element && (
          <div className="row">
            {error ? (
              <div class="alert alert-danger">{error}</div>
            ) : (
              <button
                className="btn btn-info w-100 py-0"
                disabled={!code || !name}
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
            className="flex w-100 justify-content-between align-items-center mt-1 border-bottom"
          >
            [{element.code}] {element.name}
            <button
              className="btn btn-danger py-0"
              onClick={(event) => handleDelete(event, element)}
            >
              <i className="fas fa-minus" />
            </button>
          </div>
        ))}
        <div className="flex w-100 justify-content-evenly mt-4">
          <button className="btn btn-success col-5" onClick={saveData}>
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
