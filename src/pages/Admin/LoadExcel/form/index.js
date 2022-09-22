import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions, plantActions } from "../../../../actions/StoreActions";
import { appConfig } from "../../../../config";
const { headersRef } = appConfig;

export function LoadLocations(props) {
  const { close, locations } = props;
  const { plantResult } = useSelector((state) => state.plants);
  const [newLocations, setNewLocations] = useState(
    locations.filter(
      (loc, i) =>
        !!loc &&
        !locations
          .slice(0, i)
          .find((sp) => !!sp && sp.servicePoint === loc.servicePoint)
    )
  );
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
    dispatch(plantActions.createSP({ servicePoints: toCreate }));
  }

  function handleClose(e, loaded) {
    e.preventDefault();
    dispatch(plantActions.resetResult());
    close && close(loaded);
  }

  useEffect(
    () => plantResult.success && dispatch(deviceActions.allOptions()),
    [dispatch, plantResult]
  );

  return (
    <div className="modal">
      <form
        className="bg-light p-4 rounded-2"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
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
        <table className="table" style={{ maxHeight: "50vh" }}>
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
        <div className="flex flex-column w-100 align-items-center">
          {plantResult.success && plantResult.success[0] && (
            <div className="d-flex flex-column align-items-center gap-2">
              <div className="fw-bold text-success">
                Lugares de servicio creados: {plantResult.success.length}
              </div>
              <button
                className="btn btn-info"
                onClick={(e) => handleClose(e, true)}
              >
                OK
              </button>
            </div>
          )}
          {plantResult.errors && plantResult.errors[0] && (
            <div className="alert alert-danger" role="alert">
              Se encontraron los siguientes errores:
              <ul>
                {plantResult.errors.map((sp) => (
                  <li>
                    <b>{`${sp.plant}>${sp.area}>${sp.line}>${sp.name}`}:</b>{" "}
                    {sp.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!plantResult.success && (
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
