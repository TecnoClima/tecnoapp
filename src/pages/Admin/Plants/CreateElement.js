import { faCheck, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";
import { FormInput } from "../../../components/forms/FormInput/index.js";
import {
  ErrorModal,
  SuccessModal,
} from "../../../components/warnings/index.js";
import { appConfig } from "../../../config.js";
import ModalBase from "../../../Modals/ModalBase";
import ExcelPasteToTable from "./ExcelToTable";

const { headersRef } = appConfig;
const servicePoint = "servicePoint";

export default function CreateElement(props) {
  const { item, close, element, save, data } = props;
  const { plantResult } = useSelector((state) => state.plants);
  const [codeName, setCodeName] = useState(
    element
      ? { code: element.code, name: element.name }
      : { code: "", name: "" }
  );
  const [error, setError] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [fromExcel, setFromExcel] = useState(false);
  const [manuallyAdded, setManuallyAdded] = useState([]);
  const [addedByExcel, setAddedByExcel] = useState([]);

  const dispatch = useDispatch();

  function handleChange(e) {
    const { name, value } = e.target;
    setCodeName({ ...codeName, [name]: value.toUpperCase() });
  }

  const [adds, setAdds] = useState(
    item === servicePoint
      ? {
          steelMine: element ? element.steelMine : false,
          calory: element ? element.calory : false,
          dangerTask: element ? element.dangerTask : false,
          insalubrity: element ? element.insalubrity : false,
        }
      : undefined
  );

  const parent = {
    plant: null,
    area: "plant",
    line: "area",
    servicePoint: "line",
  };

  function handleSetExcel(e) {
    e.preventDefault();
    setFromExcel(false);
    setFromExcel(!!e.target.value);
  }

  function setAddValue(e) {
    e.preventDefault();
    const { value } = e.target;
    setAdds({
      ...adds,
      [value]: !adds[value],
    });
  }

  function saveData(e) {
    e.preventDefault();
    const body = {};
    if (element) {
      body[item] = { ...codeName, ...adds };
      body.previous = element;
    } else {
      const key = item + "s";
      body[key] = fromExcel ? addedByExcel : manuallyAdded;
      if (parent[item])
        body[key].map((e) => (e[parent[item]] = data[parent[item]]));
    }
    setSaving(true);
    dispatch(save(body));
  }

  function addToArrayBody(e) {
    e.preventDefault();
    const { code, name } = codeName;
    const check = manuallyAdded.find(
      (e) => (code && e.code === code) || (name && e.name === name)
    );
    if (check) {
      setError("Código o Nombre ya presentes en la lista");
    } else {
      let newItem = { ...codeName };
      if (adds) newItem = { ...newItem, ...adds };
      setManuallyAdded([...manuallyAdded, newItem]);
      setCodeName({ code: "", name: "" });
      let resetAdds = { ...adds };
      Object.keys(resetAdds).map((k) => (resetAdds[k] = false));
      setAdds(resetAdds);
    }
  }

  function handleDelete(e, element) {
    e.preventDefault();
    setManuallyAdded(
      manuallyAdded.filter((e) =>
        e.code ? e.code !== element.code : e.name !== element.name
      )
    );
  }

  useEffect(() => {
    if (!error) return;
    !manuallyAdded.find(
      (e) =>
        e.code.toLowerCase() === codeName.code.toLowerCase() ||
        e.name.toLowerCase() === codeName.name.toLowerCase()
    ) && setError(undefined);
  }, [codeName, manuallyAdded, error]);

  function handleCloseSuccess() {
    dispatch(plantActions.resetResult());
    setSaving(false);
    close();
  }

  const title = `${element ? "Editar" : "Crear"} ${headersRef[item]}${
    element ? ` ${element.name}` : ""
  }`;

  return (
    <>
      <ModalBase
        title={title}
        open={true}
        onClose={close}
        className="max-h-[90vh] overflow-y-auto"
      >
        <form className="flex flex-col gap-4 p-4" onSubmit={saveData}>
          {/* Parent Info */}
          {parent[item] && (
            <div className="text-center font-bold text-primary">
              {headersRef[parent[item]]}: {data[parent[item]].name}
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex w-full gap-2">
            <button
              type="button"
              className={`btn btn-sm flex-grow btn-primary ${
                !fromExcel ? "" : "btn-outline"
              }`}
              onClick={handleSetExcel}
            >
              Alta Individual
            </button>
            <button
              type="button"
              className={`btn btn-sm flex-grow btn-primary ${
                fromExcel ? "" : "btn-outline"
              }`}
              onClick={handleSetExcel}
              value={1}
            >
              Desde Excel
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {fromExcel ? (
              <ExcelPasteToTable
                item={item}
                mayusc={true}
                setData={setAddedByExcel}
                data={addedByExcel}
              />
            ) : (
              <div className="space-y-4">
                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-2">
                  {item !== servicePoint && (
                    <FormInput
                      label="Código"
                      name="code"
                      value={codeName.code}
                      placeholder={`Ingrese código de ${headersRef[item]}`}
                      changeInput={handleChange}
                    />
                  )}
                  <FormInput
                    label="Nombre"
                    name="name"
                    value={codeName.name}
                    placeholder={`Ingrese nombre de ${headersRef[item]}`}
                    changeInput={handleChange}
                  />
                </div>

                {/* Service Point Options */}
                {item === servicePoint && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["steelMine", "calory", "dangerTask", "insalubrity"].map(
                      (key, i) => (
                        <button
                          key={i}
                          type="button"
                          value={key}
                          className={`btn btn-sm ${
                            adds[key] ? "btn-primary" : "btn-outline"
                          }`}
                          onClick={setAddValue}
                        >
                          {headersRef[key]}
                        </button>
                      )
                    )}
                  </div>
                )}

                {/* Add Button */}
                {!element && (
                  <div className="flex justify-center">
                    {error ? (
                      <div className="alert alert-error text-sm">{error}</div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-info btn-sm"
                        disabled={
                          (item !== servicePoint && !codeName.code) ||
                          !codeName.name
                        }
                        onClick={addToArrayBody}
                      >
                        Agregar {headersRef[item]} a crear
                      </button>
                    )}
                  </div>
                )}

                {/* Manual Items List */}
                {manuallyAdded.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">
                      Elementos a crear:
                    </h4>
                    {manuallyAdded.map((element, i) => (
                      <div
                        key={element.code}
                        className="flex justify-between items-center px-3 py-1 bg-base-200 rounded-lg border"
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {element.code && `[${element.code}] `}
                            {element.name}
                          </div>
                          {adds && (
                            <div className="flex gap-1 mt-1">
                              {Object.keys(adds)
                                .filter((k) => !!element[k])
                                .map((k, i) => (
                                  <span
                                    key={i}
                                    className="badge badge-primary badge-sm"
                                  >
                                    {headersRef[k]}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={(event) => handleDelete(event, element)}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              className="btn btn-success btn-sm"
              type="submit"
              disabled={
                (fromExcel
                  ? !addedByExcel[0] || addedByExcel.find((row) => !!row.error)
                  : !manuallyAdded[0]) || element === codeName
              }
            >
              <FontAwesomeIcon icon={faCheck} />
              GUARDAR
            </button>
          </div>
        </form>
      </ModalBase>

      {/* Error Modal */}
      {plantResult.error && (
        <ErrorModal
          open={true}
          message={plantResult.error}
          close={() => dispatch(plantActions.resetResult())}
        />
      )}

      {/* Success Modal */}
      {plantResult.success && saving && (
        <SuccessModal
          open={true}
          message="Guardado exitoso"
          close={handleCloseSuccess}
        />
      )}
    </>
  );
}
