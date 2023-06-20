import React, { useEffect, useState } from "react";
import * as xlsx from "xlsx/xlsx.mjs";
import { useSelector } from "react-redux";
import { appConfig } from "../../../config";
const { headersRef } = appConfig;

export default function ExcelPasteToTable({
  item,
  mayusc = false,
  setData,
  data,
}) {
  const { plants } = useSelector((state) => state);
  const [error, setError] = useState("");
  const sp = item === "servicePoint";

  const validFields = sp
    ? ["code", "name", "steelMine", "calory", "dangerTask", "insalubrity"]
    : ["code", "name"];

  async function handlePaste(e) {
    e.preventDefault();
    setError("");
    // try {
    setData([]);
    let clipboardData = await (window.clipboardData?.getData("Text") ||
      navigator.clipboard.readText());
    if (!clipboardData?.includes("\n") || !clipboardData?.includes("\t")) {
      throw new Error("No hay datos copiados");
    }
    if (mayusc) clipboardData = clipboardData.toUpperCase();
    const rows = clipboardData.split("\n").map((row) => row.split("\t"));
    //continuar: definir códigos y nombres desde el pegado.
    const jsonRows = createRowArray(rows);
    setData(jsonRows);
    // } catch (e) {
    setError(e.message);
    // }
  }

  function createRowArray(rows) {
    const newRows = [];
    rows.forEach((row, i) => {
      if (row[0]) {
        const element = {
          code: row[0].replace("\r", ""),
          name: row[1].replace("\r", ""),
          error: "",
        };
        if (sp) {
          element.steelMine = row[2].replace("\r", "").toUpperCase() === "SI";
          element.calory = row[3].replace("\r", "").toUpperCase() === "SI";
          element.dangerTask = row[4].replace("\r", "").toUpperCase() === "SI";
          element.insalubrity = row[5].replace("\r", "").toUpperCase() === "SI";
        }
        if (
          row[0] !== headersRef[validFields[0]].toUpperCase() &&
          row[1] !== headersRef[validFields[1]].toUpperCase()
        ) {
          //validations
          newRows.push(element);
        }
      }
    });
    validateRow(newRows);
    return newRows;
  }

  function validateRow(rows) {
    const locationList = sp ? "spList" : item + "List";
    const idFields = ["code", "name"];
    const used = {};
    idFields.forEach(
      (field) => (used[field] = plants[locationList].map((loc) => loc[field]))
    );
    rows.forEach((row) => {
      row.error = { used: [], repeated: [] };
      idFields.forEach((key) => {
        if (used[key].includes(row[key])) {
          row.error.used.push(key);
        }
        if (rows.filter((r) => r[key] === row[key]).length > 1) {
          row.error.repeated.push(key);
        }
      });
      if (!row.error?.used.length && !row.error?.repeated.length)
        delete row.error;
    });
  }

  function handleChange(e, i, f) {
    const { value, checked } = e.target;
    const locations = [...data];
    locations[i][f] = value || checked;
    validateRow(locations);
    setData(locations);
  }

  function deleteRow(e) {
    e.preventDefault();
    const { value } = e.currentTarget;
    const locations = [...data];
    locations.splice(value, 1);
    setData(locations);
  }

  useEffect(() => {
    setError(
      data.find((e) => !!e.error) ? "Hay algunas cosas por corregir" : ""
    );
  }, [data]);

  function downloadSnippet(e) {
    e.preventDefault(e);
    const worksheet = xlsx.utils.aoa_to_sheet([
      validFields.map((field) => headersRef[field]),
    ]);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(
      workbook,
      worksheet,
      `${headersRef[item]} a cargar`
    );
    xlsx.writeFile(workbook, `plantilla_${headersRef[item]}.xlsx`);
  }

  return (
    <div className="flex w-100 flex-column">
      <div className="d-flex gap-2">
        <button
          className="btn btn-primary btn-sm mx-auto"
          onClick={handlePaste}
        >
          <i className="fas fa-paste" /> Pegar rango de excel
        </button>
        <button
          className="btn btn-primary btn-sm mx-auto"
          onClick={downloadSnippet}
        >
          <i className="fas fa-table" /> Descargar Plantilla
        </button>
      </div>
      {error && (
        <div className="alert alert-danger py-1 mt-2 flex-grow-1" role="alert">
          <b>ERROR: </b>
          {error}
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            {validFields.map((field) => (
              <th className="px-1" key={field}>
                {headersRef[field]}
              </th>
            ))}
          </tr>
        </thead>
        {data[0] && (
          <tbody>
            {data.map((row, rowIndex) => {
              let fields = Object.keys(row).filter((e) =>
                validFields.includes(e)
              );
              const rowError = row.error;

              return (
                <tr key={rowIndex}>
                  {fields.map((field) => {
                    let bool = typeof row[field] === "boolean";
                    return (
                      <td key={field}>
                        <div
                          className={`d-flex flex-column ${
                            bool
                              ? "justify-content-center h-100 my-auto"
                              : "align-items-start"
                          }`}
                        >
                          {bool ? (
                            <input
                              type="checkbox"
                              checked={row[field]}
                              onChange={handleChange}
                            />
                          ) : (
                            <input
                              className={`excelInput
                            ${
                              rowError?.used.includes(field) ||
                              rowError?.repeated.includes(field)
                                ? "bg-danger text-light"
                                : ""
                            }
                          `}
                              type="text"
                              name={field}
                              value={row[field]}
                              onChange={(e) => handleChange(e, rowIndex, field)}
                            />
                          )}

                          {rowError?.used.includes(field) && (
                            <div className="errorMessage">{`${headersRef[field]}: ${row[field]} ya está en uso`}</div>
                          )}
                          {rowError?.repeated.includes(field) && (
                            <div className="errorMessage">{`Estás repitiendo ${headersRef[field]}`}</div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      title="Eliminar"
                      value={rowIndex}
                      onClick={deleteRow}
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}
