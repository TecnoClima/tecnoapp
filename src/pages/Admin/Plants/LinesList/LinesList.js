import React from "react";

import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

// import styles from "./LinesList.module.css";

import {
  getLineServicePoints,
  getPlantLines,
  getPlantLocation,
  deleteLine,
  getLineData,
} from "../../../../actions/addPlantsActions.js";

import AddLines from "../AddLines/addLines";
import UpdateLine from "../updateLine/UpdateLine";

export default function LinesList({
  lines,
  plantName,
  areaName,
  setSelectedData,
  selectedData,
}) {
  const dispatch = useDispatch();

  let [showModal, setShowModal] = useState(false);
  let [showModalUpdate, setShowModalUpdate] = useState(false);
  let [habilButtonCreate, setHabilButtonCreate] = useState(true);

  useEffect(() => {
    if (areaName !== "") setHabilButtonCreate(false);
    else setHabilButtonCreate(true);
  }, [areaName]);

  const handleChangeLines = (e) => {
    dispatch(getLineServicePoints(e.target.id));
    setSelectedData({
      ...selectedData,
      linesName: e.target.id,
      spName: "",
    });
  };

  //Función boton editar una linea de la lista
  let [updateLineData, setUpdateLineData] = useState({
    newName: "",
    newCode: "",
    oldName: "",
    oldCode: "",
  });

  const handleEditLine = async (event) => {
    let response = await dispatch(getLineData(event.target.value));

    setUpdateLineData({
      newName: response.name,
      newCode: response.code,
      oldName: response.name,
      oldCode: response.code,
    });

    setShowModalUpdate(true);
  };

  //Fin funciones para editar una linea de la lista

  //Funcion para borrar una linea

  const handleDeleteLine = async (event) => {
    event.preventDefault();
    let plantLocations = await dispatch(
      getLineServicePoints(event.target.value)
    );
    if (plantLocations.length === 0) {
      let response = dispatch(deleteLine({ name: event.target.value }));
      if (response.message) {
        alert(response.message);
      } else {
        alert("El área fue borrada");
      }
      dispatch(getPlantLocation(plantName));
      dispatch(getPlantLines(areaName));
    } else {
      alert("La planta contiene LÍNEAS debe eliminarlas primero");
    }
  };
  //Fin función para borrar una linea

  return (
    <div className="container px-0">
      <AddLines
        areaName={areaName}
        plantName={plantName}
        setShowModal={setShowModal}
        showModal={showModal}
      />

      <UpdateLine
        setUpdateLineData={setUpdateLineData}
        updateLineData={updateLineData}
        plantName={selectedData.plantName}
        areaName={selectedData.areaName}
        setShowModalUpdate={setShowModalUpdate}
        showModalUpdate={showModalUpdate}
      />

      <div className="row">
        <div className="flex align-items-center justify-content-evenly">
          <h5>Lineas</h5>
          <button
            className="btn btn-info"
            title={habilButtonCreate ? "Seleccione Area" : "Agregar Linea"}
            onClick={() => setShowModal(true)}
            disabled={habilButtonCreate}
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mt-2 h-50 overflow-auto">
          {lines.length > 0 &&
            lines.map((element) => {
              return (
                <div className="d-flex">
                  <button
                    id={element}
                    className={`btn ${
                      selectedData.linesName === element
                        ? "btn-primary"
                        : "btn-outline-primary"
                    } w-100 flex flex-grow-1 justify-content-start align-items-center`}
                    key={"divCuerpo" + element}
                    onClick={(e) => handleChangeLines(e)}
                  >
                    {element}
                  </button>

                  <button
                    className="btn btn-danger m-1 p-1"
                    key={"delete" + element}
                    title="Eliminar"
                    value={element}
                    onClick={(e) => handleDeleteLine(e)}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                  <button
                    className="btn btn-info m-1 p-1"
                    title="Edit"
                    key={"edit" + element}
                    value={element}
                    onClick={(e) => handleEditLine(e)}
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
