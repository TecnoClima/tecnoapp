import React from "react";
import { useDispatch } from "react-redux";
import {
  getPlantLocation,
  updateArea,
} from "../../../../actions/addPlantsActions.js";
import { FormInput } from "../../../../components/forms/FormInput/index.js";

import styles from "./UpdatePlant.module.css";

const UpdateArea = ({
  updateAreaData,
  setUpdateAreaData,
  plantName,
  setShowModalUpdate,
  showModalUpdate,
}) => {
  const dispatch = useDispatch();

  console.log("updateAreaData", updateAreaData);

  const showHideClassName = showModalUpdate ? "displayblock" : "displaynone";

  //Función boton editar una planta de la lista

  const handleUpdateArea = async (event) => {
    setUpdateAreaData({
      ...updateAreaData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitUpdateArea = async (event) => {
    event.preventDefault();
    let response = dispatch(updateArea(updateAreaData));

    dispatch(getPlantLocation(plantName));
    if (response.areaUpdated.acknowledged) {
      alert("Cambios Realizados");
    } else {
      alert("No se pudieron hacer los cambios");
    }
    setUpdateAreaData({
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
      <section className="modal">
        <div className="container bg-light rounded-2 w-auto pt-4">
          <form onSubmit={(e) => handleSubmitUpdateArea(e)} id="updateArea">
            <div className="container">
              <h4 className="text-center mb-4">Editar Area</h4>
              <FormInput
                label={"Nombre"}
                placeholder="Nombre del área"
                defaultValue={updateAreaData.newName}
                onBlur={(e) => handleUpdateArea(e)}
              />
              <FormInput
                label={"Código"}
                placeholder="Código del área"
                defaultValue={updateAreaData.newCode}
                onChange={(e) => handleUpdateArea(e)}
              />
            </div>
            <div className="flex w-100 justify-content-evenly my-4">
              <button
                className="btn btn-success col-4"
                type="submit"
                key="submitFormButton"
                form="updateArea"
              >
                Guardar
              </button>
              <button
                className="btn btn-danger col-4"
                onClick={() => setShowModalUpdate(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className={styles.modalmain}>
        <div className={styles.container}>
          <form onSubmit={(e) => handleSubmitUpdateArea(e)} id="updateArea">
            <div className={styles.containerInputs}>
              <h4>Editar planta</h4>
              <div>
                <div className={styles.inputs}>
                  <label>Nombre: </label>
                  <input
                    type="text"
                    name="newName"
                    autoComplete="off"
                    defaultValue={updateAreaData.newName}
                    onBlur={(e) => handleUpdateArea(e)}
                    placeholder="Ingrese el nombre..."
                  />
                </div>
                <div className={styles.inputs}>
                  <label>Código: </label>
                  <input
                    type="text"
                    name="newCode"
                    autoComplete="off"
                    defaultValue={updateAreaData.newCode}
                    onChange={(e) => handleUpdateArea(e)}
                    placeholder="Ingrese el código..."
                  />
                </div>
              </div>
            </div>
          </form>
          <div className={styles.buttonContainer}>
            <button type="submit" key="submitFormButton" form="updateArea">
              Guardar Cambios Area
            </button>
            <button onClick={() => setShowModalUpdate(false)}>Cerrar</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateArea;
