import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions, plantActions } from "../../../../actions/StoreActions";
import { appConfig } from "../../../../config";
import ModalBase from "../../../../Modals/ModalBase";
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

  function handleSelectAll(e) {
    e.preventDefault();
    const locations = [...newLocations];
    const checked = newLocations[0].checked;
    locations.map((loc) => (loc.checked = !checked));
    setToCreate(locations.filter((loc) => loc.checked));
    setNewLocations(locations);
  }

  useEffect(
    () => plantResult.success && dispatch(deviceActions.allOptions()),
    [dispatch, plantResult]
  );

  return (
    <ModalBase
      open={true}
      onClose={close}
      title="Lugares de servicios no encontrados en base de datos"
      className="md:max-w-full"
    >
      <form
        className="flex flex-col gap-2 max-h-[75vh]"
        onSubmit={(e) => handleSubmit(e)}
      >
        <p>
          Por favor revise que hayan sido escritos correctamente y tilde los que
          desee dar de alta en este momento
        </p>
        <button
          className="btn btn-info btn-outline btn-sm mr-auto"
          onClick={handleSelectAll}
        >
          Seleccionar Todos
        </button>
        <div className="flex-grow overflow-y-auto">
          <table className="table no-padding overflow-x-auto max-h-96">
            <thead className="text-center">
              <tr className="sticky top-0 bg-base-100">
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
                  className={
                    location.checked ? "bg-success/20 text-success" : ""
                  }
                >
                  {keys
                    .filter((key) => !extraKeys.includes(key))
                    .map((key, i) => (
                      <td key={i}>{location[key]}</td>
                    ))}
                  {extraKeys.map((key, i) => (
                    <td key={i}>
                      <div className="flex w-full justify-center">
                        <input
                          className="checkbox"
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
        </div>

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
                    <div className="w-100 border border-danger px-1 rounded-3">
                      <div className="fw-bold" style={{ fontSize: "80%" }}>
                        {`${sp.plant}>${sp.area}>${sp.line}>${sp.servicePoint}`}
                      </div>
                      <div>{sp.error}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!plantResult.success && (
            <button
              className="btn btn-success mx-auto mt-4"
              type="submit"
              disabled={!toCreate.length}
            >
              Cargar
            </button>
          )}
        </div>
      </form>
    </ModalBase>
  );
}
