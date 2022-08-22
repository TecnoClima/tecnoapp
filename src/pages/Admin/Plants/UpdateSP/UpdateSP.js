import React from "react";
import { useDispatch } from "react-redux";

import {
  getPlantLocation,
  getPlantLines,
  getLineServicePoints,
  updateServicePoint,
} from "../../../../actions/addPlantsActions.js";

import styles from "./UpdateSP.module.css";

const UpdateSP = ({
  updateSPData,
  setUpdateSPData,
  plantName,
  areaName,
  lineName,
  setShowModalUpdate,
  showModalUpdate,
}) => {
  const dispatch = useDispatch();

  const showHideClassName = showModalUpdate ? "displayblock" : "displaynone";

  //Función boton editar una planta de la lista

  const handleUpdateSP = async (event) => {
    setUpdateSPData({
      ...updateSPData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmitUpdateArea = async (event) => {
    event.preventDefault();
    let response = await dispatch(updateServicePoint(updateSPData));
    await dispatch(getPlantLocation(plantName));
    await dispatch(getPlantLines(areaName));
    await dispatch(getLineServicePoints(lineName));
    if (response.spUpdated.acknowledged) {
      alert("Cambios Realizados");
    } else {
      alert("No se pudieron hacer los cambios");
    }
    setUpdateSPData({
      newName: "",
      newCode: "",
      newGate: "",
      newAceria: false,
      newCaloria: false,
      newTareaPeligrosa: false,
      oldName: "",
      oldCode: "",
    });

    setShowModalUpdate(false);
  };
  //Fin funciones para editar una planta de la lista

  return (
    <div className={styles[showHideClassName]}>
      <section className={styles.modalmain}>
        <h4>Editar planta</h4>
        <div className={styles.container}>
          <form onSubmit={(e) => handleSubmitUpdateArea(e)} id="updateSP">
            <div className={styles.inputs}>
              <label>Nombre: </label>
              <input
                type="text"
                name="newName"
                autoComplete="off"
                value={updateSPData.newName}
                onChange={(e) => handleUpdateSP(e)}
                placeholder="Ingrese el nombre..."
              />
            </div>
            <div className={styles.inputs}>
              <label>Código: </label>
              <input
                type="text"
                name="newCode"
                autoComplete="off"
                defaultValue={updateSPData.newCode}
                onChange={(e) => handleUpdateSP(e)}
                placeholder="Ingrese el código..."
              />
            </div>

            <div>
              <label>Puerta </label>
              <input
                type="text"
                name="newGate"
                autoComplete="off"
                defaultValue={updateSPData.newGate}
                onChange={(e) => handleUpdateSP(e)}
                placeholder="Ingrese la puerta..."
              />
            </div>

            <div>
              <label>Aceria </label>
              <select
                name="newAceria"
                onChange={(e) => handleUpdateSP(e)}
                defaultValue={updateSPData.newAceria}
              >
                <option value={false}>No</option>
                <option value={true}>Si</option>
              </select>
            </div>
            <div>
              <label>Caloria </label>
              <select
                name="newCaloria"
                onChange={(e) => handleUpdateSP(e)}
                defaultValue={updateSPData.newCaloria}
              >
                <option value={false}>No</option>
                <option value={true}>Si</option>
              </select>
            </div>
            <div>
              <label>Tarea Peligrosa </label>
              <select
                name="newTareaPeligrosa"
                onChange={(e) => handleUpdateSP(e)}
                defaultValue={updateSPData.newTareaPeligrosa}
              >
                <option value={false}>No</option>
                <option value={true}>Si</option>
              </select>
            </div>
          </form>
          <div className={styles.buttonContainer}>
            <button type="submit" key="submitFormButton" form="updateSP">
              Guardar Cambios SP
            </button>

            <button onClick={() => setShowModalUpdate(false)}>Cerrar</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateSP;
