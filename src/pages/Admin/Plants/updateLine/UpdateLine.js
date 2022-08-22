import React from "react";
import { useDispatch } from "react-redux";
import {
  getPlantLocation,
  updateLine,
  getPlantLines,
} from "../../../../actions/addPlantsActions.js";

import styles from "./UpdateLine.module.css";

const UpdateLine = ({
  updateLineData,
  setUpdateLineData,
  plantName,
  areaName,
  setShowModalUpdate,
  showModalUpdate,
}) => {
  const dispatch = useDispatch();

  const showHideClassName = showModalUpdate ? "displayblock" : "displaynone";

  //Función boton editar una planta de la lista

  const handleUpdateLine = async (event) => {
    setUpdateLineData({
      ...updateLineData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitUpdateArea = async (event) => {
    event.preventDefault();
    let response = await dispatch(updateLine(updateLineData));
    await dispatch(getPlantLocation(plantName));
    await dispatch(getPlantLines(areaName));
    if (response.lineUpdated.acknowledged) {
      alert("Cambios Realizados");
    } else {
      alert("No se pudieron hacer los cambios");
    }
    setUpdateLineData({
      newName: "",
      newCode: "",
      oldName: "",
      oldCode: "",
    });
    setShowModalUpdate(false);
  };

  //Fin funciones para editar una planta de la lista

  return (
    <div className={styles[showHideClassName]}>
      <section className={styles.modalmain}>
        <div className={styles.container}>
          <form onSubmit={(e) => handleSubmitUpdateArea(e)} id="updateLine">
            <div className={styles.containerInputs}>
              <h4>Editar planta</h4>
              <div>
                <div className={styles.inputs}>
                  <label>Nombre: </label>
                  <input
                    type="text"
                    name="newName"
                    autoComplete="off"
                    value={updateLineData.newName}
                    onChange={(e) => handleUpdateLine(e)}
                    placeholder="Ingrese el nombre..."
                  />
                </div>
                <div className={styles.inputs}>
                  <label>Código: </label>
                  <input
                    type="text"
                    name="newCode"
                    autoComplete="off"
                    value={updateLineData.newCode}
                    onChange={(e) => handleUpdateLine(e)}
                    placeholder="Ingrese el código..."
                  />
                </div>
              </div>
            </div>
          </form>
          <div className={styles.buttonContainer}>
            <button type="submit" key="submitFormButton" form="updateLine">
              Guardar Cambios Linea
            </button>
            <button onClick={() => setShowModalUpdate(false)}>Cerrar</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateLine;
