import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  getPlantLines,
  deleteArea,
  getPlantLocation,
  getAreaData,
} from "../../../../actions/addPlantsActions.js";

import AddAreas from "../AddAreas/addAreas.js";
import UpdateArea from "../UpdateArea/UpdateArea.js";

// import styles from "./AreasList.module.css";

export default function AreasList({
  areas,
  plantName,
  setSelectedData,
  selectedData,
}) {
  const dispatch = useDispatch();
  let [showModal, setShowModal] = useState(false);
  let [showModalUpdate, setShowModalUpdate] = useState(false);
  let [habilButtonCreate, setHabilButtonCreate] = useState(true);

  useEffect(() => {
    if (plantName !== "") setHabilButtonCreate(false);
    else setHabilButtonCreate(true);
  }, [plantName]);

  console.log("areas", areas);

  const handleChangeAreas = (e) => {
    dispatch(getPlantLines(e.target.id));
    setSelectedData({
      ...selectedData,
      areaName: e.target.id,
      linesName: "",
      spName: "",
    });
  };

  //Función boton editar un area de la lista
  let [updateAreaData, setUpdateAreaData] = useState({
    newName: "",
    newCode: "",
    oldName: "",
    oldCode: "",
  });

  const handleEditArea = async (event) => {
    let response = dispatch(getAreaData(event.target.value));
    setUpdateAreaData({
      newName: response.name,
      newCode: response.code,
      oldName: response.name,
      oldCode: response.code,
    });
    setShowModalUpdate(true);
  };
  //Fin funciones para editar un area de la lista

  //Funcion para borrar una planta

  const handleDeleteArea = async (event) => {
    event.preventDefault();
    let plantLocations = await dispatch(getPlantLocation(plantName));

    if (plantLocations[event.target.value].length === 0) {
      let response = await dispatch(deleteArea({ name: event.target.value }));
      if (response.message) {
        alert(response.message);
      } else {
        alert("El área fue borrada");
      }
      dispatch(getPlantLocation(plantName));
    } else {
      alert("La planta contiene LÍNEAS debe eliminarlas primero");
    }
  };
  //Fin función para borrar una planta

  return (
    <div className="container px-0">
      <AddAreas
        plantName={plantName}
        setShowModal={setShowModal}
        showModal={showModal}
      />

      <UpdateArea
        setUpdateAreaData={setUpdateAreaData}
        updateAreaData={updateAreaData}
        plantName={plantName}
        setShowModalUpdate={setShowModalUpdate}
        showModalUpdate={showModalUpdate}
      />

      <div className="row">
        <div className="flex align-items-center justify-content-evenly">
          <h5>Areas</h5>
          <button
            title={habilButtonCreate ? "Seleccione Planta" : "Seleccione Area"}
            className="btn btn-info"
            onClick={() => setShowModal(true)}
            disabled={habilButtonCreate}
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mt-2">
          {areas.length > 0 &&
            areas.map((element) => {
              return (
                <div className="d-flex">
                  <button
                    id={element}
                    className={`btn ${
                      selectedData.areaName === element
                        ? "btn-primary"
                        : "btn-outline-primary"
                    } w-100 flex flex-grow-1 justify-content-start align-items-center`}
                    key={"divCuerpo" + element}
                    onClick={(e) => handleChangeAreas(e)}
                  >
                    {element}
                  </button>

                  <button
                    className="btn btn-danger m-1 p-1"
                    key={"delete" + element}
                    title="Eliminar"
                    value={element}
                    onClick={(e) => handleDeleteArea(e)}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                  <button
                    className="btn btn-info m-1 p-1"
                    title="Edit"
                    key={"edit" + element}
                    value={element}
                    onClick={(e) => handleEditArea(e)}
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
