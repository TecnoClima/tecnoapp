import React from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  getPlantLines,
  getPlantLocation,
  addLine,
  getAreaData,
} from "../../../../actions/addPlantsActions.js";

import styles from "./addLines.module.css";

const AddLines = ({ areaName, plantName, setShowModal, showModal }) => {
  const dispatch = useDispatch();

  const showHideClassName = showModal ? "displayblock" : "displaynone";

  let [inputLine, setInputLine] = useState({
    name: "",
    code: "",
  });
  let [inputLines, setInputLines] = useState([]);
  const [errors, setErrors] = useState(true);

  //Función crear lineas
  const handleChangLine = (event) => {
    setInputLine({ ...inputLine, [event.target.name]: event.target.value });
    if (inputLine.name.length !== 0 && inputLine.code.length !== 0)
      setErrors(false);
    else setErrors(true);
  };

  const handleSubmitLines = async (event) => {
    event.preventDefault();
    let areaCode = await dispatch(getAreaData(areaName));
    let datos = { lines: inputLines, areaCode: areaCode.code };
    let response = await dispatch(addLine(datos));
    await dispatch(getPlantLocation(plantName));
    await dispatch(getPlantLines(areaName));
    if (response.length === 0) {
      alert(response.message);
    } else {
      alert("Las líneas fueron creadas");
    }
    setInputLines([]);
    setInputLine({
      name: "",
      code: "",
    });
    setShowModal(false);
  };
  //Fin de la función para agregar una línea nueva

  const hanldeDeleteLine = (event) => {
    setInputLines(
      inputLines.filter((countr) => countr.code !== event.target.value)
    );
  };

  //Funcion para agregar líneas al listado
  const handleAddLine = () => {
    setInputLines([...inputLines, inputLine]);
    setInputLine({
      name: "",
      code: "",
    });
    setErrors(true);
  };

  //fin funmción de agregar líneas al listado

  const handleClose = () => {
    setInputLines([]);
    setInputLine({
      name: "",
      code: "",
    });
    setShowModal(false);
    setErrors(true);
  };

  return (
    <div className={styles[showHideClassName]}>
      <section className={styles.modalmain}>
        <h4>Agregar Líneas</h4>
        <div className={styles.colContent}>
          <div className={styles.container}>
            <form onSubmit={(e) => handleSubmitLines(e)} id="addLine">
              <div>
                <label>Nombre: </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  defaultValue={inputLine.name}
                  onBlur={(e) => handleChangLine(e)}
                  placeholder="Ingrese el nombre..."
                />
              </div>
              <div>
                <label>Código: </label>
                <input
                  type="text"
                  name="code"
                  autoComplete="off"
                  defaultValue={inputLine.code}
                  onBlur={(e) => handleChangLine(e)}
                  placeholder="Ingrese el código..."
                />
              </div>
            </form>
            <div>
              {errors ? (
                <button
                  key="addLineDisabled"
                  disabled={errors}
                  className="disabledButton"
                >
                  Agregar Línea
                </button>
              ) : (
                <button key="addLine" onClick={() => handleAddLine()}>
                  Agregar Línea
                </button>
              )}

              {inputLines.length === 0 ? (
                <button
                  disabled={inputLines.length === 0}
                  className="disabledButton"
                >
                  Crear Lineas
                </button>
              ) : (
                <button type="submit" key="submitFormButton" form="addLine">
                  Crear Lineas
                </button>
              )}

              <button onClick={() => handleClose()}>Cerrar</button>
            </div>
          </div>

          <div className={styles.inputsLinesList}>
            <h5>Líneas a agregar:</h5>
            {inputLines.length !== 0 &&
              inputLines.map((element) => {
                return (
                  <div>
                    <span>
                      ({element.code}) {element.name}
                    </span>
                    <button
                      onClick={(event) => hanldeDeleteLine(event)}
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

export default AddLines;
