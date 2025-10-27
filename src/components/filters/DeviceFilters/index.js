import { useEffect, useState } from "react";
import { appConfig } from "../../../config";
const { headersRef, frequencies } = appConfig;
const unassigned = "SIN PROGRAMA ASIGNADO";

export default function DeviceFilters(props) {
  const { list, hiddenFields, select } = props;
  const emptyfilters = {
    plant: "",
    area: "",
    line: "",
    device: "",
    type: "",
    power: { min: "", max: "", unit: "TR" },
    refrigerant: "",
    category: "",
    environment: "",
    service: "",
    age: { min: "", max: "" },
    status: "",
    reclaims: { min: "", max: "" },
    frequency: "",
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
      "type",
      "refrigerant",
      "category",
      "environment",
      "service",
      "frequency",
      "status",
    ]) {
      newOptions[key] = Object.keys(filters).includes(key) && [
        ...new Set(list.filter((d) => !!d[key]).map((d) => d[key])),
      ];
    }
    setOptions({ newOptions, frequency: frequencies.map((f) => f.frequency) });
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
        type,
        power,
        age,
        reclaims,
        refrigerant,
        category,
        environment,
        service,
        status,
        program,
        frequency,
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
        if (newFilters[key].unit && newFilters[key].unit === "TR") {
          max *= 3000;
          min *= 3000;
        }
        if (min && d[key] < Number(min)) check = false;
        if (max && d[key] > Number(max)) check = false;
      }
      if (frequency) {
        const weeks = frequencies.find((f) => f.frequency === frequency)?.weeks;
        if (weeks !== d.frequency) {
          check = false;
        }
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
        type,
        refrigerant,
        category,
        environment,
        service,
        status,
      })) {
        if (newFilters[key] && d[key] !== newFilters[key]) check = false;
      }

      return check;
    });
    select && select(filteredList);
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
    <div className="drawer drawer-end z-10 w-fit">
      <input
        id="device-filters-drawer"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content">
        <label
          htmlFor="device-filters-drawer"
          className="btn btn-primary btn-sm drawer-button"
        >
          Filtrar Equipos
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="device-filters-drawer"
          className="drawer-overlay"
        ></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h5 className="text-lg font-bold">Filtros de equipo</h5>
            <label
              htmlFor="device-filters-drawer"
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </label>
          </div>

          {Object.keys(filters)
            .filter((k) => !hiddenFields.includes(k))
            .map((k) => {
              const isSelect = Object.keys(options).includes(k);
              const isRanged =
                !isSelect && Object.keys(filters[k]).includes("max");

              if (isSelect) {
                return (
                  <div
                    className="join text-sm bg-base-content/10 w-full border border-base-content/20"
                    key={k}
                  >
                    <label className="label w-28 flex-none input-sm join-item px-2 min-w-fit">
                      {headersRef[k]}
                    </label>
                    <select
                      value={filters[k]}
                      name={k}
                      onChange={handleFilter}
                      className="select join-item select-sm flex-grow px-1"
                    >
                      <option value="">Todas</option>
                      {options[k] &&
                        options[k].map((o, i) => (
                          <option key={i} value={o}>
                            {o}
                          </option>
                        ))}
                    </select>
                    <button
                      className="btn btn-sm join-item btn-ghost"
                      onClick={(e) => handleDelete(e, k)}
                    >
                      ✕
                    </button>
                  </div>
                );
              } else if (isRanged) {
                return (
                  <div className="join w-full" key={k}>
                    <label className="label input-xs md:input-sm bg-base-content/10 w-28 join-item border border-base-content/20 min-w-fit">
                      {headersRef[k]}
                    </label>
                    {["min", "max"].map((name) => (
                      <input
                        key={name}
                        type="number"
                        min="0"
                        name={name}
                        className="input input-xs md:input-sm input-bordered join-item flex-grow"
                        placeholder={name}
                        value={filters[k][name]}
                        onChange={(e) => handleFilter(e, k)}
                      />
                    ))}
                    {k === "power" &&
                      ["frig", "TR"].map((unit) => (
                        <button
                          key={unit}
                          className={`btn btn-sm join-item ${
                            filters.power.unit === unit
                              ? "btn-primary"
                              : "btn-ghost"
                          }`}
                          onClick={handleUnits}
                          value={unit}
                        >
                          {unit}
                        </button>
                      ))}
                    <button
                      className="btn btn-sm join-item btn-ghost"
                      onClick={(e) => handleDelete(e, k)}
                    >
                      ✕
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className="join w-full" key={k}>
                    <label className="label input-xs md:input-sm bg-base-content/10 w-28 join-item border border-base-content/20 min-w-fit">
                      {headersRef[k]}
                    </label>
                    <input
                      value={filters[k]}
                      type="text"
                      name={k}
                      className="input input-xs md:input-sm input-bordered join-item flex-grow"
                      onChange={handleFilter}
                    />
                    <button
                      className="btn btn-sm join-item btn-ghost"
                      onClick={(e) => handleDelete(e, k)}
                    >
                      ✕
                    </button>
                  </div>
                );
              }
            })}
          <div className="flex justify-between mt-4">
            <button
              onClick={handleReset}
              className="btn btn-secondary btn-sm"
              disabled={
                !Object.keys(filters).find(
                  (k) =>
                    JSON.stringify(filters[k]) !==
                    JSON.stringify(emptyfilters[k])
                )
              }
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
