import React from "react";
import { useState } from "react";
import {
  getPlantList,
  deletePlant,
  getPlantData,
  getPlantLocation,
} from "../../../../actions/addPlantsActions.js";
import { useDispatch } from "react-redux";

// import styles from "./PlantList.module.css";
import AddPlant from "../AddPlant/addPlant.js";
import UpdatePlant from "../UpdatePlant/UpdatePlant.js";

export default function PlantList({ plants, setSelectedData, selectedData }) {
  const dispatch = useDispatch();
  let [showModal, setShowModal] = useState(false);
  let [showModalUpdate, setShowModalUpdate] = useState(false);
  //Función boton editar una planta de la lista
  let [updatePlantData, setUpdatePlantData] = useState({
    newName: "",
    newCode: "",
    oldName: "",
    oldCode: "",
  });

  const handleEditPlant = async (event) => {
    let response = await dispatch(getPlantData(event.target.value));
    setUpdatePlantData({
      newName: response.name,
      newCode: response.code,
      oldName: response.name,
      oldCode: response.code,
    });
    setShowModalUpdate(true);
  };
  //Fin funciones para editar un area de la lista

  //Funcion para borrar una planta

  const handleDeletePlant = async (event) => {
    let plantLocations = await dispatch(getPlantLocation(event.target.value));
    if (Object.keys(plantLocations).length === 0) {
      let response = await dispatch(deletePlant({ name: event.target.value }));
      if (response.message) {
        alert(response.message);
      } else {
        alert("La planta fue borrada");
      }
      dispatch(getPlantList());
    } else {
      alert("La planta contiene ÁREAS debe eliminarlas primero");
    }
  };
  //Fin función para borrar una planta

  const handleChangePlants = (e) => {
    dispatch(getPlantLocation(e.target.id));
    setSelectedData({
      plantName: e.target.id,
      areaName: "",
      linesName: "",
      spName: "",
    });
  };

  return (
    <div className="container px-0">
      <AddPlant setShowModal={setShowModal} showModal={showModal} />

      <UpdatePlant
        setUpdatePlantData={setUpdatePlantData}
        updatePlantData={updatePlantData}
        setShowModalUpdate={setShowModalUpdate}
        showModalUpdate={showModalUpdate}
      />
      <div className="row">
        <div className="flex align-items-center justify-content-evenly">
          <h5>Plantas</h5>
          <button className="btn btn-info" onClick={() => setShowModal(true)}>
            Agregar
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-2">
          {plants.length !== 0 &&
            plants.map((element, i) => {
              return (
                <div key={i} className="d-flex">
                  <button
                    id={element}
                    className={`btn ${
                      selectedData.plantName === element
                        ? "btn-primary"
                        : "btn-outline-primary"
                    } w-100 flex flex-grow-1 justify-content-start align-items-center`}
                    key={"divCuerpo" + element}
                    onClick={(e) => handleChangePlants(e)}
                  >
                    {element}
                  </button>

                  <button
                    className="btn btn-danger m-1 p-1"
                    key={"delete" + element}
                    title="Eliminar"
                    value={element}
                    onClick={(e) => handleDeletePlant(e)}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                  <button
                    className="btn btn-info m-1 p-1"
                    title="Edit"
                    key={"edit" + element}
                    value={element}
                    onClick={(e) => handleEditPlant(e)}
                  >
                    <i className="fas fa-pencil-alt" />
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
