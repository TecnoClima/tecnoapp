import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addServPoint,
  addPlantCreationReset,
} from "../../../../actions/addPlantsActions";
import { appConfig } from "../../../../config";
const { headersRef } = appConfig;

export function LoadLocations(props) {
  const { close, locations } = props;
  const { creationResult } = useSelector((state) => state.addPlants);
  const [newLocations, setNewLocations] = useState(locations);
  const [toCreate, setToCreate] = useState([]);
  const [keys, setKeys] = useState([]);

  const [extraKeys] = useState([
    "calory",
    "dangerTask",
    "steelMine",
    "insalubrity",
    "checked",
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    const newKeys = newLocations[0]
      ? Object.keys(newLocations[0]).filter((key) => !extraKeys.includes(key))
      : [];
    setKeys([...newKeys, ...extraKeys]);
  }, [newLocations, extraKeys]);

  function onCheck(e) {
    const { id, name, checked } = e.target;
    let locs = [...newLocations];
    locs[id][name] = checked;
    setToCreate(locs.filter((loc) => loc.checked));
    setNewLocations(locs);
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(addServPoint({ servicePoints: toCreate }));
  }

  function handleClose() {
    dispatch(addPlantCreationReset);
    close();
  }

  return (
    <div className="modal">
      <form
        className="bg-light p-4 rounded-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="d-flex flex-row justify-content-end">
          <button className="btn btn-close" onClick={() => close()} />
        </div>
        <h4>Los siguientes lugares de servicios no existen en base de datos</h4>
        <p>
          Por favor revise que hayan sido escritos correctamente y tilde los que
          desee dar de alta en este momento
        </p>
        <table className="table">
          <thead className="text-center">
            <tr>
              {keys
                .filter((key) => key !== "checked")
                .map((key, index) => (
                  <th key={index}>{headersRef[key] || key}</th>
                ))}
              <th scope="col">Cargar</th>
            </tr>
          </thead>
          <tbody>
            {newLocations.map((location, index) => (
              <tr
                key={index}
                className={location.checked ? "alert-success" : ""}
              >
                {keys
                  .filter((key) => !extraKeys.includes(key))
                  .map((key, i) => (
                    <td key={i}>{location[key]}</td>
                  ))}
                {extraKeys.map((key, i) => (
                  <td key={i}>
                    <div className="flex w-100 h-100 justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name={key}
                        id={index}
                        checked={location[key] || false}
                        onChange={(e) => onCheck(e)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex w-100 justify-content-center">
          {creationResult &&
            creationResult.error &&
            creationResult.error.length && (
              <div className="alert alert-danger" role="alert">
                Se encontraron los siguientes errores:
                <ul>
                  {creationResult.error.map((sp) => (
                    <li>
                      <b>{`${sp.plant}>${sp.area}>${sp.line}>${sp.name}`}:</b>{" "}
                      {sp.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          {creationResult &&
            creationResult.success &&
            creationResult.success.length > 0 && (
              <div className="d-flex flex-column align-items-center gap-2">
                <div className="fw-bold text-success">
                  Lugares de servicio creados: {creationResult.success.length}
                </div>
                <button className="btn btn-info" onClick={handleClose}>
                  OK
                </button>
              </div>
            )}
          {!creationResult && (
            <button
              className="btn btn-success mx-auto"
              type="submit"
              disabled={!toCreate.length}
            >
              Cargar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
