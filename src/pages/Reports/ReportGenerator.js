import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import * as XLSX from "xlsx/xlsx.mjs";

export function ReportGenerator({ data, className, dates }) {
  const fromDate = new Date(dates.from).toISOString().split("T")[0];
  const toDate = new Date(dates.to).toISOString().split("T")[0];

  function generateReport() {
    // 1. Transformar los datos
    const mappedData = data.map((item) => ({
      Código: item.device,
      Equipo: item.name,
      Reclamos: item.totalReclaims,
      MTTR: item.mttr,
      MTBF: item.mtbf,
    }));

    // 2. Crear el Excel
    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    XLSX.writeFile(workbook, `MTTR-MTTBF ${fromDate} a ${toDate}.xlsx`);
  }

  return (
    <button
      className={`btn btn-sm btn-info ${className}`}
      onClick={generateReport}
    >
      <FontAwesomeIcon icon={faDownload} />
      Generar Reporte
    </button>
  );
}
