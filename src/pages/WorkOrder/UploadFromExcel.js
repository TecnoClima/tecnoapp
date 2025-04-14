import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  peopleActions,
  plantActions,
  workOrderActions,
} from "../../actions/StoreActions";
import { orderFields } from "../../constants/OrderData";
import * as XLSX from "xlsx/xlsx.mjs";
import ExcelTableViewer from "./ExcelTableViewer";
import { SuccessModal } from "../../components/warnings";
import { Navigate } from "react-router-dom";

const options = {
  CLASE: "class",
  TIPO: "issue",
  CAUSA: "cause",
  SUPERVISOR: "supervisor",
  RESPONSABLE: "responsible",
};

const errors = {
  EMISION: "Fecha no válida",
  FECHA_PLAN: "Fecha no válida",
};
function validateRow(row, data) {
  const device = row["EQUIPO"];
  const date = row["EMISION"];
  const OTclass = row["CLASE"];
  const duplicate =
    data.filter(
      (e) =>
        e["EQUIPO"] === device &&
        e["EMISION"].split(" ")[0] === date.split(" ")[0] &&
        e["CLASE"] === OTclass
    ).length > 1;
  return duplicate
    ? "Se repite Equipo, clase y fecha en el mismo listado"
    : false;
}

export default function LoadOrdersFromExcel() {
  const [modal, setModal] = useState(false);
  const [requested, setRequested] = useState(false);
  const { workOrderOptions, orderResult, checkedData } = useSelector(
    (state) => state.workOrder
  );
  const { workersList, userData } = useSelector((s) => s.people);
  const { plant } = useSelector((s) => s.plants);
  const [data, setData] = useState([]);
  const [dataToCheck, setDataToCheck] = useState(null);
  const [errorChecks, setErrorChecks] = useState([]);
  const [approved, setApproved] = useState(false);
  const fileInput = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (dataToCheck) dispatch(workOrderActions.checkData(dataToCheck));
  }, [dataToCheck, dispatch]);

  useEffect(() => {
    if (checkedData && dataToCheck) {
      const checkedDevices = checkedData.devices || null;
      const checkedSP = checkedData.servicePoints || null;
      setErrorChecks({
        EQUIPO: ({ EQUIPO }) =>
          !checkedDevices.includes(EQUIPO)
            ? "El equipo no existe en base de datos"
            : "",
        LUGAR_SERVICIO: ({ LUGAR_SERVICIO }) => {
          return !checkedSP.includes(LUGAR_SERVICIO)
            ? "El lugar de servicio no existe en base de datos"
            : "";
        },
        FECHA_PLAN: ({ EQUIPO, FECHA_PLAN }) => {
          return FECHA_PLAN &&
            !checkedData.taskDates[EQUIPO]?.includes(FECHA_PLAN)
            ? "La fecha no corresponde las fechas de planificadas para el equipo"
            : "";
        },
      });
    }
  }, [checkedData, dataToCheck]);

  useEffect(() => {
    if (requested) return;
    if (Object.keys(workOrderOptions).length === 0)
      dispatch(workOrderActions.getWOOptions());
    if (!workersList[0]) dispatch(peopleActions.getWorkers());
    if (!plant) dispatch(plantActions.getPlants());
    setRequested(true);
  }, [workOrderOptions, workersList, plant, requested, dispatch]);

  const fields =
    Object.keys(workOrderOptions).length > 0 && workersList[0]
      ? orderFields.map((f, i) => {
          const field = { field: f };
          if (options[f]) {
            field.options = {
              ...workOrderOptions,
              ...{
                responsible: workersList,
              },
            }[options[f]]
              .filter((e) =>
                e.plant && userData.plant ? e.plant === userData.plant : true
              )
              .map((o) => o.name || o);
          }
          return field;
        })
      : null;

  const maxLength = fields
    ? Math.max(...fields.map((f) => f.options?.length || 0))
    : 0;

  const headers = fields
    ? Array.from({ length: maxLength + 1 }, (_, i) => i).map((i) => {
        if (i === 0) return fields.map((f) => f.field);
        return Array.from({ length: fields.length }, (_, j) => j).map((j) => {
          return fields[j].options?.[i - 1] || "";
        });
      })
    : null;

  function toggleModal(e) {
    e.preventDefault();
    if (modal) {
      setData([]);
      setApproved(false);
    }
    setModal(!modal);
  }

  function buildXLSX(data) {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OT_a_cargar");
    XLSX.writeFile(workbook, "plantilla_OTs.xlsx");
  }

  function buildExcel(e) {
    e.preventDefault();
    return buildXLSX(headers);
  }

  function buildDate(excelDate) {
    const parsedDate = XLSX.SSF.parse_date_code(excelDate);
    const { y, m, d, H, M, S } = parsedDate;
    if (y === 1900) return errors["EMISION"];
    const date = new Date(
      y,
      m - 1,
      d,
      H - 3 || 0,
      M || 0,
      S || 0
    ).toISOString();

    return `${date.split("T")[0]} ${date
      .split("T")[1]
      .split(".")[0]
      .split(":")
      .slice(0, 2)
      .join(":")}`;
  }

  async function changeFile(e) {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    /* data is an ArrayBuffer */
    const fileData = await file.arrayBuffer();
    let workbook = XLSX.readFile(fileData);
    let data = XLSX.utils.sheet_to_json(workbook.Sheets["OT_a_cargar"]);
    // tranform excel date into ISO date
    data.forEach((e) => {
      e["EMISION"] = buildDate(e["EMISION"] + e["HORA_EMISION"]);
      e["FECHA_PLAN"] = e["FECHA_PLAN"]
        ? buildDate(e["FECHA_PLAN"]).split(" ")[0]
        : "";
      delete e["HORA_EMISION"];
    });

    setDataToCheck(
      data.map((e) => ({
        deviceCode: e["EQUIPO"],
        spCode: e["LUGAR_SERVICIO"],
        planDate: e["FECHA_PLAN"],
      }))
    );
    setData(data);
    if (fileInput.current) fileInput.current.value = "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dataToSend = [...data];
    dataToSend.forEach((d) => {
      d.SUPERVISOR_ID = workOrderOptions.supervisor.find(
        (s) => s.name === d.SUPERVISOR
      ).id;
      d.RESPONSABLE_ID = workersList.find(
        (w) => w.name === d.RESPONSABLE
      )?.idNumber;
    });
    dispatch(workOrderActions.loadFromExcel(dataToSend));
  }

  useEffect(() => {
    if (orderResult.success) {
      setModal(false);
    }
  }, [orderResult, modal]);

  return (
    <>
      <button className="btn btn-info" onClick={toggleModal}>
        Cargar desde Excel
      </button>

      {orderResult.success && (
        <SuccessModal
          message={"Se han cargado las órdenes exitosamente"}
          link="/ots"
          close={() => {
            dispatch(workOrderActions.resetOrderResult());
            Navigate("/ots");
          }}
        />
      )}

      <div
        className={`modal fade ${modal ? "show" : ""}`}
        id="loadWorkOrderFromExcel"
        tabIndex="-1"
        style={{ display: modal ? "block" : "none" }}
        data-bs-backdrop="static"
        aria-labelledby="loadWorkOrderFromExcelLabel"
        aria-hidden={modal ? false : true}
        role="dialog"
      >
        <div
          className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${
            data[0] ? "modal-fullscreen" : ""
          }`}
        >
          <div className="modal-content" style={{ height: "fit-content" }}>
            <div className="modal-header">
              <h5 className="modal-title" id="loadWorkOrderFromExcelLabel">
                Cargar Órdenes desde Archivo Excel
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={toggleModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row d-flex flex-wrap justify-content-between w-full border-2 border-danger mb-3 gap-2">
                <div className="input-group w-auto">
                  <input
                    ref={fileInput}
                    type="file"
                    onInput={changeFile}
                    className="form-control"
                    id="inputGroupFile02"
                  />
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupFile02"
                  >
                    Subir
                  </label>
                </div>
                <div className="d-flex gap-2 w-auto h-auto">
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={buildExcel}
                  >
                    Descargar plantilla
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#intructionsCollapse"
                    aria-expanded="false"
                    aria-controls="intructionsCollapse"
                  >
                    Ver/ocultar instructivo
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="collapse" id="intructionsCollapse">
                    <ul>
                      <li>Descargar la plantilla</li>
                      <li>
                        Comenzar a llenarla desde la fila siguiente a la última
                        ocupada
                      </li>
                      <li>
                        <b>EQUIPO y LUGAR_SERVICIO:</b> Requieren los
                        respectivos códigos de nuestra base de datos.
                      </li>
                      <li>
                        <b>ESTADO:</b> Siempre se carga como "Abierta"
                      </li>
                      <li>
                        <b>CLASE, TIPO, SUPERVISOR, CAUSA, RESPONSABLE:</b>{" "}
                        Seleccionar de la lista de opciones según el caso del
                        que se trate. Los valores tienen que ser textualmente
                        iguales. Preferiblemente, copiar el valor de la lista y
                        pegarlo. Evitar lo más posible opciones genéricas como
                        "OTRO"
                      </li>
                      <li>
                        <b>EMISION,FECHA_PLAN:</b> Fecha en formato dd/mm/aaaa
                      </li>
                      <li>
                        <b>HORA_EMISION:</b> Hora en formato hh:mm
                      </li>
                      <li>
                        <b>OT_PLANTA:</b> Código de la orden de trabajo proveída
                        por la planta, si es que existe.
                      </li>
                      <li>
                        <b>SOLICITANTE, TELEFONO</b> Persona a la que contactar
                        por asuntos relacionados con la tarea.
                      </li>
                      <li>
                        <b>DESCRIPCION:</b> Tarea que debe realizarse.
                      </li>
                      <li>
                        Una vez completada la lista, eliminar las filas que
                        muestran las opciones.{" "}
                        <b>
                          Deben quedar sólo los encabezados y las órdenes a
                          cargar.
                        </b>
                        .
                      </li>
                      <li>
                        <b>
                          Todas las órdenes se cargan con el estado "Abierta"
                        </b>
                        .
                      </li>
                      <li>
                        <span className="text-danger fw-bold">IMPORTANTE:</span>{" "}
                        Los datos que presenten errores en el chequeo previo a
                        la carga se verán en rojo{" "}
                        <span className="alert-danger text-danger fw-bold">
                          con este formato
                        </span>
                        . Al dejar el puntero del mouse sobre la celda, se
                        indicará el error.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {fields && data[0] && (
                <ExcelTableViewer
                  fields={fields.filter(
                    ({ field }) => field !== "HORA_EMISION"
                  )}
                  data={data}
                  errors={errors}
                  errorChecks={errorChecks}
                  validateRow={validateRow}
                  setApproved={setApproved}
                  deseableFields={
                    ['LUGAR_SERVICIO','OT_PLANTA']
                  }
                  requiredFields={
                    ['EQUIPO','CLASE','TIPO','SOLICITANTE','TELEFONO','SUPERVISOR','EMISION','HORA_EMISION','DESCRIPCION','CAUSA','RESPONSABLE','FECHA_PLAN']
                  }
                />
              )}
              {approved && (
                <button
                  className="btn btn-success mx-auto"
                  onClick={handleSubmit}
                >
                  Cargar Órdenes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
