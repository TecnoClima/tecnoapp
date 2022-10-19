import { useEffect, useState } from "react";
import { appConfig } from "../../../config";
const { headersRef } = appConfig;
const unassigned = "SIN PROGRAMA ASIGNADO";

export default function DeviceFilters(props) {
  const { list, hiddenFields } = props;
  const emptyfilters = {
    plant: "",
    area: "",
    line: "",
    device: "",
    power: { min: "", max: "", unit: "TR" },
    refrigerant: "",
    category: "",
    environment: "",
    service: "",
    age: { min: "", max: "" },
    status: "",
    reclaims: { min: "", max: "" },
    program: "",
  };
  // const [filters, setFilters] = useState(
  //   props.plan ? { ...emptyfilters, program: "" } : emptyfilters
  // );
  const [filters, setFilters] = useState(emptyfilters);
  const [options, setOptions] = useState({});

  useEffect(() => {
    const { plant, area } = filters;
    const newOptions = {
      plant: [...new Set(list.map((d) => d.plant).filter((e) => !!e))],
      area: [
        ...new Set(
          list
            .filter((d) => (plant ? d.plant === plant : true))
            .map((d) => d.area)
        ),
      ],
      line: [
        ...new Set(
          list.filter((d) => (area ? d.area === area : true)).map((d) => d.line)
        ),
      ],
    };
    if (Object.keys(filters).includes("program")) {
      newOptions.program = [
        ...new Set([
          unassigned,
          ...list.filter((d) => !!d.strategy).map((d) => d.strategy.name),
        ]),
      ];
    }
    for (let key of [
      "refrigerant",
      "category",
      "environment",
      "service",
      "status",
    ]) {
      newOptions[key] = Object.keys(filters).includes(key) && [
        ...new Set(list.filter((d) => !!d[key]).map((d) => d[key])),
      ];
    }
    setOptions(newOptions);
  }, [list, filters]);

  function handleFilter(e, key) {
    e.preventDefault();
    const { name, value } = e.target;
    const newFilters = key
      ? { ...filters, [key]: { ...filters[key], [name]: value } }
      : { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(list, newFilters);
  }

  function applyFilters(list, newFilters) {
    const filteredList = list.filter((d, i) => {
      const {
        line,
        area,
        plant,
        device,
        power,
        age,
        reclaims,
        refrigerant,
        category,
        environment,
        service,
        status,
        program,
      } = newFilters;
      let check = true;
      if (line && d.line !== line) {
        check = false;
      } else if (area && d.area !== area) {
        check = false;
      } else if (plant && d.area !== plant) {
        check = false;
      }
      if (
        device &&
        !d.name.toLowerCase().includes(device.toLowerCase()) &&
        !d.code.toLowerCase().includes(device.toLowerCase())
      )
        check = false;
      for (let key of Object.keys({ power, age, reclaims })) {
        let min = Number(newFilters[key].min);
        let max = Number(newFilters[key].max);
        if (filters[key].unit && filters[key].unit === "TR") {
          max *= 3000;
          min *= 3000;
        }
        if (min && d[key] < Number(min)) check = false;
        if (max && d[key] > Number(max)) check = false;
      }
      if (program) {
        if (program === unassigned && d.strategy && d.strategy.name)
          check = false;
        if (
          program !== unassigned &&
          (!d.strategy || (d.strategy && d.strategy.name !== program))
        )
          check = false;
      }
      for (let key of Object.keys({
        refrigerant,
        category,
        environment,
        service,
        status,
      })) {
        if (filters[key] && d[key] !== filters[key]) check = false;
      }
      return check;
    });
    props.select && props.select(filteredList);
  }

  function handleDelete(e, key) {
    e.preventDefault();
    const newFilters = { ...filters, [key]: emptyfilters[key] || "" };
    applyFilters(list, newFilters);
    setFilters(newFilters);
  }

  function handleReset(e) {
    e.preventDefault();
    applyFilters(list, emptyfilters);
    setFilters(emptyfilters);
  }

  function handleUnits(e) {
    e.preventDefault();
    const { value } = e.target;
    const newFilters = { ...filters, power: { ...filters.power, unit: value } };
    applyFilters(list, newFilters);
    setFilters(newFilters);
  }

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
      >
        Filtrar Equipos
      </button>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            Filtros de equipo
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          {Object.keys(filters)
            .filter((k) => !hiddenFields.includes(k))
            .map((k, i) => (
              <div className="input-group mb-1" key={i}>
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    {headersRef[k]}
                  </span>
                </div>
                {Object.keys(options).includes(k) ? (
                  <select
                    value={filters[k]}
                    type="text"
                    name={k}
                    className="form-control"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    onChange={handleFilter}
                  >
                    <option value="">Todas las opciones</option>
                    {options[k].map((o, i) => (
                      <option key={i} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : Object.keys(filters[k]).includes("max") ? (
                  ["min", "max"].map((name, i) => (
                    <input
                      key={i}
                      type="number"
                      min="0"
                      name={name}
                      className="form-control"
                      aria-label="Default"
                      value={filters[k][name]}
                      aria-describedby="inputGroup-sizing-default"
                      onChange={(e) => handleFilter(e, k)}
                    />
                  ))
                ) : (
                  <input
                    type="text"
                    name={k}
                    value={filters[k]}
                    className="form-control"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    onChange={handleFilter}
                  />
                )}
                {k === "power" &&
                  ["frig", "TR"].map((unit) => (
                    <button
                      key={unit}
                      className={`btn ${
                        filters.power.unit === unit
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={handleUnits}
                      value={unit}
                    >
                      {unit}
                    </button>
                  ))}

                {(Object.keys(filters[k]).includes("max")
                  ? filters[k].min || filters[k].max
                  : filters[k]) && (
                  <button
                    type="button"
                    className="btn btn-outline-danger col-1 px-0"
                    onClick={(e) => handleDelete(e, k)}
                  >
                    <i className="fas fa-backspace" />
                  </button>
                )}
              </div>
            ))}
          <button
            className="btn btn-danger"
            onClick={handleReset}
            disabled={
              !Object.keys(filters).find(
                (k) =>
                  JSON.stringify(filters[k]) !== JSON.stringify(emptyfilters[k])
              )
            }
          >
            Resetar Filtros
          </button>
        </div>
      </div>
    </>
  );
}
