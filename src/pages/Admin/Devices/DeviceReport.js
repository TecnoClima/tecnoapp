import * as xlsx from "xlsx/xlsx.mjs";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions } from "../../../actions/StoreActions";
import { useEffect, useState } from "react";

export default function DeviceReport({ filters }) {
  const { deviceReportData } = useSelector((state) => state.devices);
  const [fetchingData, setFetchingData] = useState(false);
  const dispatch = useDispatch();
  function getReportData(e) {
    e.preventDefault();
    setFetchingData(true);
    dispatch(deviceActions.getReportData(filters));
  }

  useEffect(() => {
    if (!deviceReportData[0]) return;
    const worksheet = xlsx.utils.json_to_sheet(deviceReportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "EQUIPOS+LS");
    xlsx.writeFile(workbook, "Listado_de_Equipos.xlsx");
    setFetchingData(false);
  }, [deviceReportData]);

  return (
    <button
      type="button"
      className="btn btn-info btn-sm"
      title={filters.plant ? "Debe seleccionar planta" : "Generar Reporte"}
      disabled={!filters.plant}
      onClick={getReportData}
    >
      <i className="fas fa-download me-1" />
      Generar listado
    </button>
  );
}
