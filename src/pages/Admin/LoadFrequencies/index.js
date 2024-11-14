import * as xlsx from "xlsx/xlsx.mjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions } from "../../../actions/StoreActions";
import { appConfig } from "../../../config";
import { ErrorModal, SuccessModal } from "../../../components/warnings";
import waiting from "../../../assets/searching.gif";
const { putExcel } = deviceActions;
const { frequencies } = appConfig;

const excelCodeCol = "Código de Equipo";
const excelFreqCol = "Frecuencia";
const excelPageName = "Frecuencias_a_cargar";
const excelFileName = "plantilla_frecuencias.xlsx";

function buildXLSX(data) {
  const worksheet = xlsx.utils.aoa_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, excelPageName);
  xlsx.writeFile(workbook, excelFileName);
}

export function LoadFrequencies() {
  const { deviceResult } = useSelector((state) => state.devices);
  const [errors, setErrors] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const dispatch = useDispatch();

  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  function checkAndUpload(fileData) {
    try {
      setErrors(null);
      const workbook = xlsx.read(fileData);
      const worksheet = workbook.Sheets[excelPageName];
      const rows = xlsx.utils.sheet_to_json(worksheet);
      const data = rows.map((item) => ({
        deviceCode: item[excelCodeCol],
        frequency: frequencies.find((f) => f.frequency === item[excelFreqCol])
          .weeks,
        __rowNum__: item["__rowNum__"],
      }));
      setUpdateData(data);
    } catch (e) {
      setErrors(e);
      console.log(e);
    }
  }

  async function changeFile(e) {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const fileData = await file.arrayBuffer();
    checkAndUpload(fileData);
  }

  useEffect(() => setUploading(false), [deviceResult]);

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      schema: "Device",
      items: updateData,
    };
    dispatch(putExcel(data));
    setUploading(true);
  }

  return (
    <div className="adminOptionSelected p-4">
      <div className="w-100 flex flex-column">
        <h3>Cargar Frecuencias desde archivo excel</h3>
        <p>
          Tené en cuenta que se requiere el{" "}
          <b>código del equipo que figura en la base de datos</b>
        </p>
        <div className="w-100 overflow-auto">
          <table
            className="table h-25 text-center"
            style={{
              fontSize: "90%",
            }}
          >
            <thead>
              <tr>
                <th>Código de Equipo</th>
                <th>Frecuencia</th>
              </tr>
            </thead>
            <tbody>
              {frequencies.map(({ weeks, frequency }, index) => (
                <tr key={weeks}>
                  <td>CC1-00{index + 1}</td>
                  <td>{frequency}</td>
                </tr>
              ))}
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
            <div className="d-flex my-3 flex-wrap-reverse">
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
                  disabled={!updateData?.[0]}
                >
                  <i className="fas fa-file-upload me-2" />
                  Subir
                </button>
              </form>
              <button
                className="btn btn-outline-info"
                onClick={() =>
                  buildXLSX([
                    [excelCodeCol, excelFreqCol], // Encabezados
                    ...frequencies.map((item, index) => [
                      `CC1-00${index + 1}`, // Código de equipo
                      item.frequency, // Frecuencia
                    ]),
                  ])
                }
              >
                Descargar plantilla
              </button>
            </div>
            {updateData?.[0] && !errors && (
              <div className="alert alert-success">
                Click en [<i className="fas fa-file-upload me-2" />
                Subir] para cargar los equipos
              </div>
            )}
          </div>
        )}

        {errors && (
          <div className="alert-danger h-50 overflow-auto">
            <p className="fw-bold">Error al cargar el archivo</p>
            {errors.message}
          </div>
        )}
      </div>
      {deviceResult.error && (
        <ErrorModal
          message={deviceResult.error}
          close={() => dispatch(deviceActions.resetResult())}
        />
      )}
      {deviceResult.success && (
        <SuccessModal
          message="Equipos actualizados exitosamente"
          close={() => dispatch(deviceActions.resetResult())}
        />
      )}
    </div>
  );
}
