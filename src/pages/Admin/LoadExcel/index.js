import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as xlsx from "xlsx/xlsx.mjs";
import { deviceActions } from "../../../actions/StoreActions";
import waiting from "../../../assets/searching.gif";
import { ErrorModal, SuccessModal } from "../../../components/warnings";
import { appConfig } from "../../../config";
import ModalBase from "../../../Modals/ModalBase";
import { excelDateToJSDate } from "../../../utils/utils";
import { LoadLocations } from "./form";
const { postExcel, allOptions } = deviceActions;
const { headersRef } = appConfig;

const valueTypes = {
  list: "(texto, de lista)",
  unique: "texto, (único)",
  text: "texto",
  power: "Número en kCal",
  date: "dd/mm/yyy",
  none: "",
  gasAmount: "Número en gramos",
};

function buildXLSX(data) {
  const worksheet = xlsx.utils.aoa_to_sheet([data]);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Equipos_a_cargar");
  xlsx.writeFile(workbook, "plantilla_equipos.xlsx");
}

function copyToClipboard(e) {
  e.preventDefault();
  const { value } = e.currentTarget;
  try {
    navigator.clipboard.writeText(value);
  } catch (e) {
    console.error(e.message);
  }
}

export function LoadExcel() {
  const { deviceOptions, deviceResult } = useSelector((state) => state.devices);
  const [errors, setErrors] = useState(null);
  const [deviceList, setDeviceList] = useState(null);
  const [addLocations, setAddLocations] = useState(false);
  const [file, setFile] = useState(null);
  const [openErrors, setOpenErrors] = useState(false);
  const dispatch = useDispatch();

  const [data, setData] = useState({});
  const [options, setOptions] = useState({});
  const [filters, setFilters] = useState({});
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => dispatch(allOptions()), [dispatch]);

  useEffect(() => setOptions(deviceOptions), [deviceOptions]);

  useEffect(() => {
    if (!options.locations) return;
    let items = {
      plant: { subtitle: valueTypes.list, examples: [] },
      area: { subtitle: valueTypes.list, examples: [] },
      line: { subtitle: valueTypes.list, examples: [] },
      spCode: { subtitle: valueTypes.unique, examples: [] },
      servicePoints: {
        subtitle: valueTypes.unique,
        examples: [],
      },
      code: { subtitle: valueTypes.unique, examples: ["AAA-001"] },
      name: { subtitle: valueTypes.unique, examples: [] },
      type: { subtitle: valueTypes.list, examples: [] },
      power: { subtitle: valueTypes.power, examples: [] },
      refrigerant: { subtitle: valueTypes.list, examples: [] },
      gasAmount: { subtitle: valueTypes.gasAmount, examples: [] },
      extraDetails: { subtitle: valueTypes.text, examples: [] },
      service: { subtitle: valueTypes.list, examples: [] },
      status: { subtitle: valueTypes.list, examples: [] },
      category: { subtitle: valueTypes.list, examples: [] },
      regDate: { subtitle: valueTypes.date, examples: ["26/11/2013"] },
      environment: { subtitle: valueTypes.list, examples: [] },
      active: { subtitle: valueTypes.none, examples: ["Si", "No"] },
    };

    Object.keys(items).forEach((key) => {
      if (Object.keys(options).includes(key)) {
        items[key].examples = options[key].map((item) => item.name || item);
      } else if (key === "spCode") {
        items[key].examples = options.spList.map((item) => item.code);
      } else if (key === "servicePoints") {
        items[key].examples = options.spList.map((item) => item.name);
      } else {
        items[key].examples = options[key];
      }
    });

    setData(items);
  }, [options]);

  async function changeFile(e) {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    /* data is an ArrayBuffer */
    const fileData = await file.arrayBuffer();
    setFile(fileData);
  }

  useEffect(() => {
    if (!file && data && deviceOptions) return;
    function checkData(fileData) {
      try {
        setErrors(null);
        const workbook = xlsx.read(fileData);
        const worksheet = workbook.Sheets["Equipos_a_cargar"];
        const rows = xlsx.utils.sheet_to_json(worksheet);
        const keys = Object.keys(data);
        for (let row of rows)
          for (let key of keys) {
            row[key] = row[headersRef[key]];
            delete row[headersRef[key]];
          }
        const errors = [];
        for (let device of rows) {
          console.log("device", device);
          const { plant, area, line, spCode } = device;

          let error = {};
          const servicePoints = device.servicePoints.split(";");
          let ls = [];
          for (let sp of servicePoints) {
            const servicePoint = options.spList.find(
              (item) => item?.name?.toUpperCase() === sp.toUpperCase()
            );
            if (!servicePoint) {
              ls.push({ plant, area, line, code: spCode, servicePoint: sp });
            } else {
              const spLine = options.line.find(
                (item) => item._id === servicePoint.line
              );
              const spArea = options.area.find(
                (item) => item._id === spLine.area
              );
              const spPlant = options.plant.find(
                (item) => item._id === spArea.plant
              );
              const loc = {
                name: sp,
                line: options.line.find((item) => item.name === line)?.name,
                area: options.area.find((item) => item.name === area)?.name,
                plant: options.plant.find((item) => item.name === plant)?.name,
              };
              if (
                !(
                  loc.name.toUpperCase() === sp.toUpperCase() &&
                  loc.area.toUpperCase() === area.toUpperCase() &&
                  loc.line.toUpperCase() === line.toUpperCase() &&
                  loc.plant.toUpperCase() === plant.toUpperCase()
                )
              ) {
                ls.push({ plant, area, line, code: spCode, servicePoint: sp });
              }
            }
          }
          if (ls[0]) {
            error.ls = ls;
          } else {
            device.servicePoints = servicePoints;
          }
          console.log("keys", keys);
          for (let key of keys) {
            if (!["code", "spCode"].includes(key)) {
              const { examples } = data[key];
              if (examples && examples[0]) {
                if (typeof examples[0] === "string") {
                  if (!device[key] && key !== "extraDetails") {
                    error[key] = `dato no completado`;
                  } else if (key === "regDate") {
                    if (excelDateToJSDate(device[key]) > new Date()) {
                      error[key] = "La fecha debe ser menor a la fecha actual";
                    }
                  } else {
                    let check = false;
                    if (Array.isArray(device[key])) {
                      device[key].forEach((item) => {
                        if (
                          examples
                            .map((item) => item.toUpperCase())
                            .includes(item.toUpperCase())
                        ) {
                          check = true;
                        }
                      });
                    } else {
                      check = examples
                        .map((item) => item.toUpperCase())
                        .includes(device[key].toUpperCase());
                    }
                    if (!check) {
                      error[key] = `${
                        device[key]
                      } no es una opción válida para ${headersRef[
                        key
                      ].toUpperCase()}`;
                    }
                  }
                }
              }
            }
          }
          if (Object.keys(error).length)
            errors.push({ device: device.name, ...error });
        }
        if (errors.find((e) => e.ls)) setAddLocations(true);
        console.log("errors", errors);
        if (errors.length) {
          setErrors(errors);
        } else {
          setDeviceList(rows);
        }
      } catch (e) {
        console.log(e);
        // alert("No se pudo procesar archivo: " + e.message);
      }
    }
    checkData(file);
  }, [file, data, deviceOptions, options]);

  function filterLocation(field, value) {
    const locationFields = ["plant", "area", "line", "spList"];
    if (!locationFields.includes(field)) return;
    let newFilters = { ...filters };
    if (!newFilters[field]) {
      newFilters[field] = value;
    } else {
      if (newFilters[field] === value) {
        delete newFilters[field];
        value = null;
      } else {
        newFilters[field] = value;
      }
    }
    setFilters(newFilters);

    const newOptions = { ...deviceOptions };
    const item = deviceOptions[field].find((p) => p.name === value);

    const parents = {},
      children = {};
    locationFields.forEach((loc, i) => {
      if (!locationFields[i + 1]) return;
      parents[locationFields[i + 1]] = loc;
      children[loc] = locationFields[i + 1];
    });

    let child = children[field];

    function initialCriteria(field) {
      child = children[field];
      const parent = parents[field];
      return deviceOptions[field].filter((i) =>
        value ? i[parent] === item._id : true
      );
    }

    function getItemByParent(field) {
      child = children[field];
      const parent = parents[field];
      return deviceOptions[field].filter((element) =>
        value
          ? newOptions[parent].map((item) => item._id).includes(element[parent])
          : true
      );
    }

    newOptions[field] = value ? [item] : deviceOptions[field];

    locationFields.forEach((location) => {
      if (field === location) newOptions[child] = initialCriteria(child);
      if (field === child) newOptions[child] = getItemByParent(child);
    });

    setOptions(newOptions);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      schema: "Device",
      items: deviceList,
    };
    dispatch(postExcel(data));
    setUploading(true);
  }

  useEffect(() => setUploading(false), [deviceResult]);

  useEffect(() => {
    if (uploading && deviceResult.success) {
      setFile(null);
      setDeviceList(null);
    }
  }, [uploading, deviceResult]);

  function closeLoadLocations(loaded) {
    inputRef.current.value = null;
    setFile(null);
    setAddLocations(false);
    setErrors(null);
    loaded && dispatch(allOptions());
  }

  useEffect(() => {
    if (deviceResult.errors?.[0]) setOpenErrors(true);
  }, [deviceResult.errors]);

  useEffect(() => console.log("errors", errors), [errors]);

  return (
    <div className="page-container">
      <div className="flex w-full justify-between flex-wrap">
        <div className="page-title">Cargar datos desde archivo excel</div>
      </div>
      <div className="w-full overflow-auto">
        <table className="table no-padding text-xs">
          <thead className="sticky top-0 bg-base-100">
            <tr>
              {Object.keys(data).map((field, index) => (
                <td key={index} className="text-center font-bold">
                  {headersRef[field]}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="sticky top-4 bg-base-100">
              {Object.keys(data).map((field, index) => (
                <td key={index}>
                  <div className="h-full w-full flex items-center justify-center text-center">
                    {data[field].subtitle}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              {Object.keys(data).map((field, index) => (
                <td
                  key={index}
                  className="border border-base-content/25 px-2 align-top"
                >
                  <div className="flex flex-col h-96 min-h-0 overflow-x-hidden overflow-y-auto">
                    {data[field].examples &&
                      data[field].examples.sort().map((value, index) => {
                        const selected = filters[field] === value;
                        return (
                          <div
                            key={index}
                            className={`
                              flex items-center cursor-pointer hover:bg-primary/25
                              ${selected ? "bg-primary" : ""}
                            `}
                            style={{
                              cursor: "pointer",
                              borderTop: "1px dotted black",
                              borderBottom: "1px dotted black",
                            }}
                          >
                            <button
                              title="Copiar al portapapeles"
                              className="bg-transparent"
                              value={value}
                              onClick={copyToClipboard}
                            >
                              <FontAwesomeIcon
                                icon={faCopy}
                                className={
                                  selected
                                    ? "text-base-content mr-1"
                                    : "text-base-content/75 mr-1"
                                }
                              />
                            </button>
                            <span
                              className="text-base-content/75"
                              onClick={() => filterLocation(field, value)}
                            >
                              {value}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-full flex flex-col mt-4">
        {uploading && (
          <div className="w-1/4 min-w-40 flex flex-col m-auto text-center">
            <img className="" src={waiting} alt="ventilador girando" />
            <b>Cargando Equipos</b>
          </div>
        )}
        {!uploading && (
          <div className="flex flex-col items-center w-fit ">
            <div className="flex gap-2">
              <form
                onSubmit={handleSubmit}
                method="POST"
                encType="multipart/form-data"
                className="flex gap-2 items-center"
              >
                <input
                  type="file"
                  name="file"
                  ref={inputRef}
                  onChange={changeFile}
                  onClick={() => setErrors(null)}
                  className="file-input file-input-sm min-w-fit file-input-bordered file-input-primary w-full max-w-xs"
                />

                <button
                  className="btn btn-warning btn-outline btn-sm"
                  type="submit"
                  disabled={!(deviceList && deviceList[0])}
                >
                  <FontAwesomeIcon icon={faFileUpload} /> Subir
                </button>
              </form>
              <button
                className="btn btn-info btn-outline btn-sm"
                onClick={() =>
                  buildXLSX(Object.keys(data).map((key) => headersRef[key]))
                }
              >
                Descargar plantilla
              </button>
            </div>
            {deviceList && !errors && (
              <div className="alert py-2 mt-2 alert-success w-fit opacity-75">
                Click en [<i className="fas fa-file-upload me-2" />
                Subir] para cargar los equipos
              </div>
            )}
          </div>
        )}

        {errors && (
          <ModalBase
            open={true}
            title="Ooops!"
            className="bg-error"
            onClose={() => {
              inputRef.current.value = "";
              setErrors(null);
            }}
          >
            Hubo algunos errores... Hay que corregir lo siguiente para poder
            subir el archivo
            <div className="max-h-48 overflow-y-auto">
              {errors.map((error, index) => (
                <div key={index} className="p-2">
                  <b>Equipo: {error.device}</b>
                  <ul className="list-disc pl-8">
                    {Object.keys(error)
                      .filter((key) => !["device", "ls"].includes(key))
                      .map((key, index) => (
                        <li key={index}>
                          {headersRef[key]}: {error[key]}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </ModalBase>
        )}
        {deviceResult.errors && deviceResult.errors[0] && (
          <ModalBase
            open={openErrors}
            title="Se encontraron los siguientes errores:"
            className="flex flex-col bg-error text-error-content"
            onClose={() => setOpenErrors(false)}
          >
            <div className="h-3/4 min-h-0 overflow-y-auto">
              <ul className="list-disc pl-4">
                {deviceResult.errors.map((item) => (
                  <li>{item.error}</li>
                ))}
              </ul>
            </div>
          </ModalBase>
        )}
      </div>
      {addLocations && (
        <LoadLocations
          locations={errors ? errors.map((e) => e.ls).flat(1) : []}
          close={closeLoadLocations}
        />
      )}
      {deviceResult.error && (
        <ErrorModal
          message={deviceResult.error}
          close={() => dispatch(deviceActions.resetResult())}
        />
      )}
      {deviceResult.success && (
        <SuccessModal
          message="Equipos cargados exitosamente"
          close={() => dispatch(deviceActions.resetResult())}
        />
      )}
    </div>
  );
}
