import React from "react";
import { useDispatch } from "react-redux";
import {
  getPlantList,
  updatePlant,
} from "../../../../actions/addPlantsActions.js";
import { FormInput } from "../../../../components/forms/FormInput/index.js";
import styles from "./UpdatePlant.module.css";
const UpdatePlant = ({
  updatePlantData,
  setUpdatePlantData,
  setShowModalUpdate,
  showModalUpdate,
}) => {
  const dispatch = useDispatch();

  //Función boton editar una planta de la lista

  const handleUpdatePlant = async (event) => {
    setUpdatePlantData({
      ...updatePlantData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmitUpdatePlant = async (event) => {
    event.preventDefault();
    let response = await dispatch(updatePlant(updatePlantData));

    dispatch(getPlantList());

    if (response.plantUpdated.acknowledged) {
      alert("Cambios Realizados");
    } else {
      alert("No se pudieron hacer los cambios");
    }
    setUpdatePlantData({
      newName: "",
      newCode: "",
      oldName: "",
      oldCode: "",
    });
    setShowModalUpdate(false);
  };
  //Fin funciones para editar una planta de la lista
  const showHideClassName = showModalUpdate ? "displayblock" : "displaynone";

  return (
    <div className={styles[showHideClassName]}>
      <section className="modal">
        <div className="container bg-light rounded-2 w-auto">
          <form
            className="flex flex-column align-items-center p-4 gap-4"
            onSubmit={(e) => handleSubmitUpdatePlant(e)}
            id="addPlant"
          >
            <div className="container">
              <h4 className="text-center mb-4">Editar planta</h4>
              <FormInput
                label={"Nombre"}
                placeholder="Nombre de la planta"
                value={updatePlantData.newName}
                onChange={(e) => handleUpdatePlant(e)}
              />
              <FormInput
                label={"Código"}
                placeholder="Código de la planta"
                value={updatePlantData.code}
                onChange={(e) => handleUpdatePlant(e)}
              />
            </div>
            <div className="flex w-100 justify-content-evenly">
              <button
                className="btn btn-success col-4"
                type="submit"
                key="submitFormButton"
                form="updatePlant"
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

      {/* <section className={styles.modalmain}>
        <div className={styles.container}>
          <form onSubmit={(e) => handleSubmitUpdatePlant(e)} id="updatePlant">
            <div className={styles.containerInputs}>
              <h4>Editar planta</h4>
              <div>
                <div className={styles.inputs}>
                  <label>Nombre: </label>
                  <input
                    type="text"
                    name="newName"
                    autoComplete="off"
                    value={updatePlantData.newName}
                    onChange={(e) => handleUpdatePlant(e)}
                    placeholder="Ingrese el nombre..."
                  />
                </div>
                <div className={styles.inputs}>
                  <label>Código: </label>
                  <input
                    type="text"
                    name="newCode"
                    autoComplete="off"
                    value={updatePlantData.newCode}
                    onChange={(e) => handleUpdatePlant(e)}
                    placeholder="Ingrese el código..."
                  />
                </div>
              </div>
            </div>
          </form>
          <div className={styles.buttonContainer}>
            <button type="submit" key="submitFormButton" form="updatePlant">
              Guardar Cambios
            </button>
            <button onClick={() => setShowModalUpdate(false)}>Cerrar</button>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default UpdatePlant;
