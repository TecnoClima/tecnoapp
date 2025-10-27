import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as xlsx from "xlsx/xlsx.mjs";
import { deviceActions } from "../../../actions/StoreActions";
import waiting from "../../../assets/searching.gif";
import { ErrorModal, SuccessModal } from "../../../components/warnings";
import { appConfig } from "../../../config";
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
    <div className="page-container">
      <div className="flex w-full justify-between flex-wrap">
        <div className="page-title">Cargar Frecuencias desde archivo excel</div>
      </div>
      <p className="mt-2">
        Tené en cuenta que se requiere el{" "}
        <b>código del equipo que figura en la base de datos</b>
      </p>
      <div className="w-full max-w-md mx-auto my-4 overflow-auto">
        <table className="table no-padding text-xs">
          <thead className="sticky top-0 bg-base-100">
            <tr>
              <th className="text-center font-bold">Código de Equipo</th>
              <th className="text-center font-bold">Frecuencia</th>
            </tr>
          </thead>
          <tbody>
            {frequencies.map(({ weeks, frequency }, index) => (
              <tr key={weeks}>
                <td className="text-center">CC1-00{index + 1}</td>
                <td className="text-center">{frequency}</td>
              </tr>
            ))}
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
          <div className="flex flex-col items-center w-fit">
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
                  disabled={!updateData?.[0]}
                >
                  <i className="fas fa-file-upload me-2" />
                  Subir
                </button>
              </form>
              <button
                className="btn btn-info btn-outline btn-sm"
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
              <div className="alert py-2 mt-2 alert-success w-fit opacity-75">
                Click en [<i className="fas fa-file-upload me-2" />
                Subir] para cargar los equipos
              </div>
            )}
          </div>
        )}

        {errors && (
          <div className="alert alert-error mt-4">
            <p className="font-bold">Error al cargar el archivo</p>
            {errors.message}
          </div>
        )}
      </div>
      {deviceResult.error && (
        <ErrorModal
          message={deviceResult.error}
          open={true}
          close={() => dispatch(deviceActions.resetResult())}
        />
      )}
      {deviceResult.success && (
        <SuccessModal
          message="Equipos actualizados exitosamente"
          open={true}
          close={() => dispatch(deviceActions.resetResult())}
        />
      )}
    </div>
  );
}
