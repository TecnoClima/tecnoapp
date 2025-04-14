export default function ExcelTableViewer({
  fields,
  data,
  errors,
  errorChecks,
  validateRow,
  setApproved,
  deseableFields,
  requiredFields,
}) {
  let approved = true;
  return (
    <div style={{ fontSize: ".7rem", maxHeight: "75vh", minHeight:"0", overflowY: "auto", marginBottom: "1rem" }}>
    <table
      className="table"
      
    >
      <thead>
        <tr>
          {fields.map(({ field }) => (
            <th key={field} scope="col">
              {field}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => {
          const rowError = validateRow(d, data);
          if (rowError) approved = false;
          return (
            <tr
              key={i}
              className={rowError ? "table-danger text-danger fw-bold" : ""}
              title={rowError || ""}
            >
              {fields.map(({ field, options }) => {
                const value = d[field];
                const emptyDeseable = deseableFields.includes(field) && !value;
                let error;
                if (options && !options.includes(value)) {
                  error = "El dato no está en la lista de opciones";
                }
                if (errorChecks && errorChecks[field]) {
                  error = errorChecks[field](d);
                }
                if (errors && errors[field] === value) {
                  error = errors[field];
                }
                if(!error && requiredFields.includes(field) && !value) error = "Dato requerido";
                if (error) approved = false;
                if (i === data.length - 1) setApproved(approved);
                return (
                  <td
                    className={error ? "table-danger text-danger fw-bold" : emptyDeseable?"table-warning text-warning fw-bold":""}
                    data-bs-toggle={rowError||error||emptyDeseable?"tooltip":''} data-bs-placement="top" title={rowError||error||emptyDeseable?'Dato deseable':''}
                    key={field}
                  >
                    <div
                      title={rowError || error || ""}
                      className="cursor-default"
                    >
                      {value}
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
}
