import React from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  getPlantList,
  addPlant,
} from "../../../../actions/addPlantsActions.js";
import { FormInput } from "../../../../components/forms/FormInput";
import styles from "./addPlant.module.css";

const AddPlant = ({ setShowModal, showModal }) => {
  const dispatch = useDispatch();

  const showHideClassName = showModal ? "displayblock" : "displaynone";

  let [inputPlant, setInputPlant] = useState({
    name: "",
    code: "",
  });

  const [errors, setErrors] = useState(true);

  //Función crear planta
  const handleChangePlant = (event) => {
    setInputPlant({ ...inputPlant, [event.target.name]: event.target.value });
    if (inputPlant.name.length !== 0 && inputPlant.code.length !== 0)
      setErrors(false);
    else setErrors(true);
  };

  const handleSubmitPlant = async (event) => {
    event.preventDefault();
    let response = await dispatch(addPlant(inputPlant));

    dispatch(getPlantList());
    if (response.message) {
      alert(response.message);
    } else {
      alert("La planta " + response.plantStored.name + " fue creada");
    }
    setInputPlant({
      name: "",
      code: "",
    });
    setShowModal(false);
  };
  //Fin de la función para agregar una planta nueva

  const handleClose = () => {
    setInputPlant({
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
            onSubmit={(e) => handleSubmitPlant(e)}
            id="addPlant"
          >
            <div className="container">
              <h4 className="text-center mb-4">Agregar nueva planta</h4>
              <FormInput
                label={"Nombre"}
                placeholder="Nombre de la planta"
                value={inputPlant.name}
                onBlur={(e) => handleChangePlant(e)}
              />
              <FormInput
                label={"Código"}
                placeholder="Código de la planta"
                value={inputPlant.code}
                onBlur={(e) => handleChangePlant(e)}
              />
              {/* 
              <div className={styles.inputs}>
                <label>Nombre: </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  value={inputPlant.name}
                  onBlur={(e) => handleChangePlant(e)}
                  placeholder="Ingrese el nombre..."
                />
              </div>
              <div className={styles.inputs}>
                <label>Código: </label>
                <input
                  type="text"
                  name="code"
                  autoComplete="off"
                  value={inputPlant.code}
                  onBlur={(e) => handleChangePlant(e)}
                  placeholder="Ingrese el código..."
                />
              </div> */}
            </div>
            <div className="flex w-100 justify-content-evenly">
              <button
                className="btn btn-success col-4"
                type="submit"
                key="submitFormButton"
                form="addPlant"
                disabled={errors}
              >
                Crear
              </button>
              <button
                className="btn btn-danger col-4"
                onClick={() => handleClose()}
              >
                Cancelar
              </button>
            </div>
          </form>
          {/* <div className={styles.buttonContainer}>
            {errors ? (
              <button
                type="submit"
                key="submitFormButton"
                form="addPlant"
                disabled={errors}
                className="disabledButton"
              >
                Crear Planta
              </button>
            ) : (
              <button type="submit" key="submitFormButton" form="addPlant">
                Crear Planta
              </button>
            )}

            <button onClick={() => handleClose()}>Cerrar</button>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default AddPlant;
