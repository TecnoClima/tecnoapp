import React from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  getPlantLocation,
  addArea,
  getPlantData,
} from "../../../../actions/addPlantsActions.js";

import styles from "./addAreas.module.css";
import { FormInput } from "../../../../components/forms/FormInput/index.js";

const AddAreas = ({ plantName, setShowModal, showModal }) => {
  const dispatch = useDispatch();

  const showHideClassName = showModal ? "displayblock" : "displaynone";

  let [inputArea, setInputArea] = useState({
    name: "",
    code: "",
  });
  let [inputAreas, setInputAreas] = useState([]);
  const [errors, setErrors] = useState(true);

  //Función crear area
  const handleChangArea = (event) => {
    setInputArea({
      ...inputArea,
      [event.target.name]: event.target.value.toUpperCase(),
    });
    if (inputArea.name.length !== 0 && inputArea.code.length !== 0)
      setErrors(false);
    else setErrors(true);
  };

  const handleSubmitAreas = async (event) => {
    event.preventDefault();
    let plantCode = dispatch(getPlantData(plantName));

    let datos = { areas: inputAreas, plantCode: plantCode.code };

    let response = dispatch(addArea(datos));

    dispatch(getPlantLocation(plantName));
    if (response.length === 0) {
      alert(response.message);
    } else {
      alert("Las areas fueron creadas");
    }
    setInputAreas([]);
    setInputArea({
      name: "",
      code: "",
    });
    setShowModal(false);
  };
  //Fin de la función para agregar una planta nueva

  const handleDeleteArea = (event) => {
    event.preventDefault();
    setInputAreas(inputAreas.filter((a) => a.code !== event.target.id));
  };

  //Funcion para agregar areas al listado
  const handleAddArea = (e) => {
    e.preventDefault();
    setInputAreas([...inputAreas, inputArea]);
    setInputArea({
      name: "",
      code: "",
    });
    setErrors(true);
  };

  //fin funmción de agregar áreas al listado

  const handleClose = (e) => {
    e.preventDefault();
    setInputAreas([]);
    setInputArea({
      name: "",
      code: "",
    });
    setShowModal(false);
    setErrors(true);
  };

  return (
    <div className={styles[showHideClassName]}>
      <section className="modal">
        <div className="container bg-light rounded-2 w-auto">
          <form
            className="flex flex-column align-items-center p-4 gap-4"
            onSubmit={(e) => handleSubmitAreas(e)}
            id="addArea"
          >
            <div className="container">
              <h4 className="text-center mb-4">Agregar Areas</h4>
              <FormInput
                label={"Nombre"}
                placeholder="Nombre del área"
                name="name"
                onBlur={(e) => handleChangArea(e)}
              />
              <FormInput
                label={"Código"}
                placeholder="Código del área"
                name="code"
                onBlur={(e) => handleChangArea(e)}
              />
              <button
                className="btn btn-info w-100"
                disabled={errors}
                onClick={(e) => handleAddArea(e)}
              >
                Agregar Area
              </button>
            </div>

            {inputAreas.length > 0 && (
              <div className="w-100">
                <h5 className="text-center">Areas a agregar:</h5>
                {inputAreas.map((element) => {
                  return (
                    <div className="w-100 d-flex align-items-center justify-content-between border-bottom">
                      <span>
                        <b>
                          [{element.code}] {element.name}
                        </b>
                      </span>
                      <button
                        className="btn btn-danger px-1 py-0 m-0"
                        title="Quitar"
                        onClick={(event) => handleDeleteArea(event)}
                        key={element.name}
                        id={element.code}
                      >
                        <i className="fas fa-trash-alt" id={element.code} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex w-100 justify-content-evenly">
              <button
                className="btn btn-success col-4"
                type="submit"
                key="submitFormButton"
                form="addArea"
                disabled={inputAreas.length === 0}
              >
                Crear
              </button>
              <button
                className="btn btn-danger col-4"
                onClick={(e) => handleClose(e)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* <section className={styles.modalmain}>
        <h4>Agregar areas</h4>
        <div className={styles.colContent}>
          <div className={styles.container}>
            <form onSubmit={(e) => handleSubmitAreas(e)} id="addArea">
              <div>
                <label>Nombre: </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  // value={inputArea.name}
                  onBlur={(e) => handleChangArea(e)}
                  placeholder="Ingrese el nombre..."
                />
              </div>
              <div>
                <label>Código: </label>
                <input
                  type="text"
                  name="code"
                  autoComplete="off"
                  // value={inputArea.code}
                  onBlur={(e) => handleChangArea(e)}
                  placeholder="Ingrese el código..."
                />
              </div>
            </form>
            <div>
              {errors ? (
                <button
                  key="addAreaDisabled"
                  disabled={errors}
                  className="disabledButton"
                >
                  Agregar Area
                </button>
              ) : (
                <button key="addArea" onClick={() => handleAddArea()}>
                  Agregar Area
                </button>
              )}
              {inputAreas.length === 0 ? (
                <button
                  disabled={inputAreas.length === 0}
                  className="disabledButton"
                >
                  Crear Areas
                </button>
              ) : (
                <button type="submit" key="submitFormButton" form="addArea">
                  Crear Areas
                </button>
              )}
              <button onClick={() => handleClose()}>Cerrar</button>
            </div>
          </div>

          <div className={styles.inputsAreasList}>
            <h5>Áreas a agregar:</h5>
            {inputAreas.length !== 0 &&
              inputAreas.map((element) => {
                return (
                  <div>
                    <span>
                      ({element.code}) {element.name}
                    </span>
                    <button
                      onClick={(event) => hanldeDeleteArea(event)}
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
      </section> */}
    </div>
  );
};

export default AddAreas;
