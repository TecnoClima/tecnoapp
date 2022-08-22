import React from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  getPlantLines,
  getPlantLocation,
  addServPoint,
  getLineData,
  getLineServicePoints,
} from "../../../../actions/addPlantsActions.js";

import styles from "./addServicePoints.module.css";

const AddServicePoints = ({
  lineName,
  plantName,
  areaName,
  setShowModal,
  showModal,
}) => {
  const dispatch = useDispatch();

  const showHideClassName = showModal ? "displayblock" : "displaynone";

  let [inputServicePoint, setInputServicePoint] = useState({
    name: "",
    code: "",
    gate: "",
    aceria: false,
    caloria: false,
    tareaPeligrosa: false,
  });
  let [inputServicePoints, setInputServicePoints] = useState([]);
  const [errors, setErrors] = useState(true);

  //Función crear sp
  const handleChangServicePoint = (event) => {
    setInputServicePoint({
      ...inputServicePoint,
      [event.target.name]: event.target.value,
    });
    if (
      inputServicePoint.name.length !== 0 &&
      inputServicePoint.code.length !== 0
    )
      setErrors(false);
    else setErrors(true);
  };

  const handleSubmitLines = async (event) => {
    event.preventDefault();

    let lineCode = await dispatch(getLineData(lineName));
    let datos = { servPoints: inputServicePoints, lineCode: lineCode.code };
    let response = await dispatch(addServPoint(datos));
    await dispatch(getPlantLocation(plantName));
    await dispatch(getPlantLines(areaName));
    await dispatch(getLineServicePoints(lineName));
    if (response.length === 0) {
      alert(response.message);
    } else {
      alert("Los Service Points fueron creados");
    }
    setInputServicePoints([]);
    setInputServicePoint({
      name: "",
      code: "",
      gate: "",
      aceria: false,
      caloria: false,
      tareaPeligrosa: false,
    });
    setShowModal(false);
  };
  //Fin de la función para agregar una sp nueva

  const hanldeDeleteServicePoint = (event) => {
    setInputServicePoints(
      inputServicePoints.filter((countr) => countr.code !== event.target.value)
    );
  };

  //Funcion para agregar sp al listado
  const handleAddServicePoint = () => {
    setInputServicePoints([...inputServicePoints, inputServicePoint]);
    setInputServicePoint({
      name: "",
      code: "",
      gate: "",
      aceria: false,
      caloria: false,
      tareaPeligrosa: false,
    });
    setErrors(true);
  };

  //fin funmción de agregar sp al listado

  const handleClose = () => {
    setInputServicePoints([]);
    setInputServicePoint({
      name: "",
      code: "",
      gate: "",
      aceria: false,
      caloria: false,
      tareaPeligrosa: false,
    });
    setShowModal(false);
    setErrors(true);
  };

  return (
    <div className={styles[showHideClassName]}>
      <section className={styles.modalmain}>
        <h4>Agregar areas</h4>
        <div className={styles.colContent}>
          <div className={styles.container}>
            <form onSubmit={(e) => handleSubmitLines(e)} id="addServicePoint">
              <div>
                <label>Nombre: </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  defaultValue={inputServicePoint.name}
                  onBlur={(e) => handleChangServicePoint(e)}
                  placeholder="Ingrese el nombre..."
                />
              </div>
              <div>
                <label>Código: </label>
                <input
                  type="text"
                  name="code"
                  autoComplete="off"
                  defaultValue={inputServicePoint.code}
                  onBlur={(e) => handleChangServicePoint(e)}
                  placeholder="Ingrese el código..."
                />
              </div>
              <div>
                <label>Puerta: </label>
                <input
                  type="text"
                  name="gate"
                  autoComplete="off"
                  defaultValue={inputServicePoint.gate}
                  onBlur={(e) => handleChangServicePoint(e)}
                  placeholder="Ingrese la puerta..."
                />
              </div>

              <div>
                <label>Aceria: </label>
                <select
                  name="aceria"
                  onBlur={(e) => handleChangServicePoint(e)}
                  defaultValue={false}
                >
                  <option value={false}>No</option>
                  <option value={true}>Si</option>
                </select>
              </div>
              <div>
                <label>Caloria: </label>
                <select
                  name="caloria"
                  onBlur={(e) => handleChangServicePoint(e)}
                  defaultValue={false}
                >
                  <option value={false}>No</option>
                  <option value={true}>Si</option>
                </select>
              </div>
              <div>
                <label>Tarea Peligrosa: </label>
                <select
                  name="tareaPeligrosa"
                  onBlur={(e) => handleChangServicePoint(e)}
                  defaultValue={false}
                >
                  <option value={false}>No</option>
                  <option value={true}>Si</option>
                </select>
              </div>
            </form>

            <div>
              {errors ? (
                <button
                  key="addSPDisabled"
                  disabled={errors}
                  className="disabledButton"
                >
                  Agregar SP
                </button>
              ) : (
                <button
                  key="addServicePoint"
                  onClick={() => handleAddServicePoint()}
                >
                  Agregar SP
                </button>
              )}

              {inputServicePoints.length === 0 ? (
                <button
                  disabled={inputServicePoints.length === 0}
                  className="disabledButton"
                >
                  Crear SP
                </button>
              ) : (
                <button
                  type="submit"
                  key="submitFormButton"
                  form="addServicePoint"
                >
                  Crear SP
                </button>
              )}
              <button onClick={() => handleClose()}>Cerrar</button>
            </div>
          </div>

          <div className={styles.inputsSPList}>
            <h5>Áreas a agregar:</h5>
            {inputServicePoints.length !== 0 &&
              inputServicePoints.map((element) => {
                return (
                  <div>
                    <span>
                      ({element.code}) {element.name}
                    </span>
                    <button
                      onClick={(event) => hanldeDeleteServicePoint(event)}
                      key={element.name}
                      value={element.code}
                      id={element.name + element.code}
                    >
                      X
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddServicePoints;
