import * as xlsx from "xlsx/xlsx.mjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions } from "../../../actions/StoreActions";
import { appConfig } from "../../../config";
import "./index.css";
import { excelDateToJSDate } from "../../../utils/utils";
import { LoadLocations } from "./form";
import { ErrorModal, SuccessModal } from "../../../components/warnings";
import waiting from "../../../assets/searching.gif";
const { postExcel, allOptions } = deviceActions;
const { headersRef } = appConfig;

function buildXLSX(data) {
  const worksheet = xlsx.utils.aoa_to_sheet([data]);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Equipos_a_cargar");
  xlsx.writeFile(workbook, "plantilla_equipos.xlsx");
}

export function LoadExcel() {
  const { deviceOptions, deviceResult } = useSelector((state) => state.devices);
  const [errors, setErrors] = useState(null);
  const [deviceList, setDeviceList] = useState(null);
  const [addLocations, setAddLocations] = useState(false);
  const [file, setFile] = useState(null);
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
      plant: { subtitle: "(texto, de lista)", examples: [] },
      area: { subtitle: "(texto, de lista)", examples: [] },
      line: { subtitle: "(texto, de lista)", examples: [] },
      spCode: { subtitle: "texto, (único)", examples: [] },
      servicePoints: {
        subtitle: "texto",
        examples: [],
      },
      code: { subtitle: "texto, (único)", examples: ["AAA-001"] },
      name: { subtitle: "texto, (único)", examples: [] },
      type: { subtitle: "(texto, de lista)", examples: [] },
      power: { subtitle: "Número en kCal", examples: [] },
      refrigerant: { subtitle: "(texto, de lista)", examples: [] },
      extraDetails: { subtitle: "texto", examples: [] },
      service: { subtitle: "(texto, de lista)", examples: [] },
      status: { subtitle: "(texto, de lista)", examples: [] },
      category: { subtitle: "(texto, de lista)", examples: [] },
      regDate: { subtitle: "dd/mm/yyy", examples: ["26/11/2013"] },
      environment: { subtitle: "(texto, de lista)", examples: [] },
      active: { subtitle: "", examples: ["Si", "No"] },
    };
    let keys = Object.keys(items);
    keys
      .filter(
        (key) =>
          !["power", "code", "name", "extraDetails", "regDate"].includes(key)
      )
      .map(
        (key) =>
          (items[key].examples = [
            ...new Set(
              options[key] ||
                options.locations.map(
                  (loc) => loc[key === "spCode" ? "code" : key]
                )
            ),
          ])
      );
    items.servicePoints.examples = options.locations.map((loc) => loc.name);
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
    function checkAndUpload(fileData) {
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
          const { plant, area, line, spCode } = device;
          let error = {};
          const servicePoints = device.servicePoints.split(";");
          let ls = [];
          for (let sp of servicePoints) {
            const location = deviceOptions.locations.find(
              (loc) =>
                loc.name === sp &&
                loc.area === area &&
                loc.line === line &&
                loc.plant === plant
            );
            if (!location)
              ls.push({ plant, area, line, code: spCode, servicePoint: sp });
          }
          if (ls[0]) {
            error.ls = ls;
          } else {
            device.servicePoints = servicePoints;
          }
          for (let key of keys) {
            if (!["code", "spCode"].includes(key)) {
              const { examples } = data[key];
              if (examples[0]) {
                if (typeof examples[0] === "string") {
                  if (!device[key] && key !== "extraDetails") {
                    error[key] = `dato no completado`;
                  } else if (key === "regDate") {
                    if (excelDateToJSDate(device[key]) > new Date()) {
                      error[key] = "La fecha debe ser menor a la fecha actual";
                    }
                  } else if (
                    !(
                      examples.includes(device[key]) ||
                      examples.includes(...device[key])
                    )
                  ) {
                    error[key] = `${
                      device[key]
                    } no es una opción valida para ${headersRef[
                      key
                    ].toUpperCase()}`;
                  }
                }
              }
            }
          }
          if (Object.keys(error).length)
            errors.push({ device: device.name, ...error });
        }
        if (errors.find((e) => e.ls)) setAddLocations(true);
        if (errors.length) {
          setErrors(errors);
        } else {
          setDeviceList(rows);
        }
      } catch (e) {
        alert("No se pudo procesar archivo: " + e.message);
      }
    }
    checkAndUpload(file);
  }, [file, data, deviceOptions]);

  function filterLocation(field, value) {
    if (!["plant", "area", "line"].includes(field)) return;
    let newFilters = { ...filters };
    if (!newFilters[field]) {
      newFilters[field] = value;
    } else {
      if (newFilters[field] === value) {
        delete newFilters[field];
      } else {
        newFilters[field] = value;
      }
    }
    setFilters(newFilters);
    const newOptions = { ...deviceOptions };
    newOptions.locations = deviceOptions.locations.filter((e) => {
      let check = true;
      for (let field of Object.keys(newFilters))
        if (newFilters[field] !== e[field]) check = false;
      return check;
    });
    setOptions(newOptions);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      schema: "Device",
      items: deviceList,
    };
    // console.log("data", data);
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
    setAddLocations(false);
    loaded && dispatch(allOptions());
  }

  return (
    <div className="adminOptionSelected p-4">
      <div className="w-100 flex flex-column">
        <h3>Cargar datos desde archivo excel</h3>
        <div className="w-100 overflow-auto">
          <table
            className="table h-25"
            style={{
              fontSize: "70%",
            }}
          >
            <thead>
              <tr>
                {Object.keys(data).map((field, index) => (
                  <td key={index} className="text-center fw-bold">
                    {headersRef[field]}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody className="h-100">
              <tr>
                {Object.keys(data).map((field, index) => (
                  <td key={index}>
                    <div className="h-100 w-100 d-flex align-items-center justify-content-center text-center">
                      {data[field].subtitle}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="h-100">
                {Object.keys(data).map((field, index) => (
                  <td
                    key={index}
                    className="border border-1 border-secondary px-2"
                  >
                    <div
                      style={{
                        maxHeight: "25vh",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                    >
                      {data[field].examples &&
                        data[field].examples.sort().map((value, index) => {
                          const selected = filters[field] === value;
                          return (
                            <div
                              key={index}
                              className={
                                "d-flex align-items-center " +
                                (selected ? "bg-primary text-white" : "")
                              }
                              style={{
                                cursor: "pointer",
                                borderTop: "1px dotted black",
                                borderBottom: "1px dotted black",
                              }}
                            >
                              <button
                                title="Copiar al portapapeles"
                                className="border-0 bg-transparent"
                                onClick={() =>
                                  navigator.clipboard.writeText(value)
                                }
                              >
                                <i
                                  className={`far fa-copy " ${
                                    selected ? "text-white" : ""
                                  }`}
                                />
                              </button>
                              <span
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
        {uploading && (
          <div
            className="w-25 flex flex-column text-center align-self-center"
            style={{ minWidth: "10rem" }}
          >
            <img className="" src={waiting} alt="ventilador girando" />
            <b>Cargando Equipos</b>
          </div>
        )}
        {!uploading && (
          <div>
            <div className="d-flex my-3">
              <form
                onSubmit={handleSubmit}
                method="POST"
                encType="multipart/form-data"
              >
                <input
                  type="file"
                  name="file"
                  ref={inputRef}
                  onChange={changeFile}
                  onClick={() => setErrors(null)}
                />
                <button
                  className="btn btn-outline-warning mx-2"
                  type="submit"
                  disabled={!(deviceList && deviceList[0])}
                >
                  <i className="fas fa-file-upload me-2" />
                  Subir
                </button>
              </form>
              <button
                className="btn btn-outline-info"
                onClick={() =>
                  buildXLSX(Object.keys(data).map((key) => headersRef[key]))
                }
              >
                Descargar plantilla
              </button>
            </div>
            {deviceList && !errors && (
              <div className="alert alert-success">
                Click en [<i className="fas fa-file-upload me-2" />
                Subir] para cargar los equipos
              </div>
            )}
          </div>
        )}

        {errors && (
          <div className="alert-danger h-50 overflow-auto">
            Ooops! Hubo algunos errores... Hay que corregir lo siguiente para
            poder subir el archivo
            {errors.map((error, index) => (
              <div key={index} className="p-2">
                <b>Equipo: {error.device}</b>
                {Object.keys(error)
                  .filter((key) => !["device", "ls"].includes(key))
                  .map((key, index) => (
                    <div key={index} style={{ fontSize: "70%" }}>
                      {headersRef[key]}: <i>{error[key]}</i>
                    </div>
                  ))}
              </div>
            ))}
          </div>
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
