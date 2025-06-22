import React, { useEffect, useState } from "react";
import * as xlsx from "xlsx/xlsx.mjs";
import { useSelector } from "react-redux";
import { appConfig } from "../../../config";
import ErrorMessage from "../../../components/forms/ErrorMessage";
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
    <div className="flex w-full flex-col">
      <div className="flex gap-2">
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
        <div className="alert alert-error py-1 mt-2 flex-grow-1" role="alert">
          <b>ERROR: </b>
          {error}
        </div>
      )}
      <table className="table no-padding">
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
                          className={`flex flex-col ${
                            bool
                              ? "justify-center h-full my-auto"
                              : "items-start"
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
                              className={`input input-sm input-bordered ${
                                rowError?.used.includes(field) ||
                                rowError?.repeated.includes(field)
                                  ? "bg-error text-base-content"
                                  : ""
                              }
                          `}
                              type="text"
                              name={field}
                              value={row[field]}
                              // onChange={(e) => handleChange(e, rowIndex, field)}
                              readOnly
                            />
                          )}
                          {rowError?.used.includes(field) && (
                            <div className="w-full">
                              <ErrorMessage>{`${headersRef[field]}: ${row[field]} ya está en uso`}</ErrorMessage>
                            </div>
                          )}
                          {rowError?.repeated.includes(field) && (
                            <div className="w-full">
                              <ErrorMessage>{`Estás repitiendo ${headersRef[field]}`}</ErrorMessage>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td>
                    <button
                      className="btn btn-error btn-sm"
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
