import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { appConfig } from "../../config";
import { datesByYear } from "../../utils/utils";
const { headersRef } = appConfig;

const timelapses = [
  {
    label: "Este mes",
  },
  {
    label: "Año",
  },
  {
    label: "Período",
  },
];

function GroupedOptions({
  label,
  options,
  name,
  filters,
  onClick,
  onDelete,
  replacements = {},
}) {
  return (
    <div className="flex items-center gap-2 flex-grow">
      <div className="join items-stretch w-1/2 flex-grow">
        <label className="flex items-center pl-2 w-24 text-sm bg-primary/20 join-item">
          {label}
        </label>
        {options.map((option) => (
          <button
            key={option}
            value={option}
            className={`btn btn-sm w-24 flex-grow px-1 btn-primary ${
              filters[name] === option ? "" : "btn-outline opacity-75"
            } join-item`}
            name={name}
            onClick={onClick}
          >
            {replacements[option] || option}
          </button>
        ))}
      </div>
      <button
        className="disabled:opacity-0"
        title={filters[name] ? "borrar filtro" : ""}
        value={name}
        onClick={onDelete}
        disabled={!filters[name]}
      >
        <FontAwesomeIcon icon={faTimesCircle} className="text-error pl-2" />
      </button>
    </div>
  );
}

function DropdowOptions({
  value,
  onClick,
  list,
  field,
  label,
  onDelete,
  className = "",
  top,
}) {
  const options = [...new Set(list.map((order) => order[field]))].sort((a, b) =>
    a > b ? 1 : -1
  );
  function handleClick(e) {
    e.preventDefault();
    onClick(e);
    document.activeElement.blur();
  }

  return (
    <div className="flex w-1/2 sm:w-1/3 flex-grow items-center">
      <div
        className={`dropdown ${
          top ? "dropdown-top" : ""
        } w-1/2 flex-grow ${className}`}
      >
        <div
          tabIndex={0}
          role="button"
          className={`relative group input input-bordered input-sm focus-visible:outline-none min-w-0 focus:bg-base-content/10 pl-2 ${
            value ? "text-base-content " : "text-base-content/70"
          }`}
        >
          <span className="">{value || label}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="absolute right-2 top-1/2 -translate-y-1/2 group-focus:rotate-180 transition-transform duration-300 w-2 sm:w-4"
          />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-52 max-h-40 flex-nowrap overflow-y-auto p-1 shadow border border-base-content/20"
        >
          {options.map((p) => (
            <li key={p}>
              <button
                className="p-1 px-2 rounded-md"
                name={field}
                value={p}
                onClick={(e) => handleClick(e)}
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {value && onDelete && (
        <button
          className="disabled:opacity-0"
          title={value ? "borrar filtro" : ""}
          value={field}
          onClick={onDelete}
          disabled={!value}
        >
          <FontAwesomeIcon icon={faTimesCircle} className="text-error pl-2" />
        </button>
      )}
    </div>
  );
}

export default function OrdersFilters({
  filteredList,
  filters,
  setFilteredList,
  setFilters,
}) {
  const { workOrderList } = useSelector((state) => state.workOrder);
  const { userData } = useSelector((state) => state.people);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const yyyyMm = `${currentYear}-${currentMonth < 9 ? "0" : ""}${
    currentMonth + 1
  }`;
  const [timelapse, setTimelapse] = useState(timelapses[0].label);
  const [displayFilters, setDisplayFilters] = useState(false);

  const initialFilters = userData.plant ? { plant: userData.plant } : {};
  const dates = datesByYear(currentYear);

  function clickYear(e) {
    e.preventDefault();
    const { value } = e.target;
    const dates = datesByYear(value);
    applyFilters({ ...filters, ...dates });
  }

  function cleanFilters(e) {
    e.preventDefault();
    applyFilters(initialFilters);
  }

  function handleSelect(e) {
    const { value, name } = e.target;
    const newFilters = { ...filters };
    if (!value) {
      delete newFilters[name];
    } else {
      newFilters[name] = value;
    }
    applyFilters(newFilters);
  }

  const checkFilters = (order, filters) => {
    let check = true;
    Object.keys(filters).forEach((key) => {
      if (key === "dateMin") {
        if (new Date(order.date) < new Date(filters[key])) {
          check = false;
        }
      } else if (key === "dateMax") {
        if (new Date(order.date) > new Date(filters[key])) {
          check = false;
        }
      } else if (key === "device") {
        if (
          !order.devCode.toLowerCase().includes(filters[key]?.toLowerCase()) &&
          !order.devName.toLowerCase().includes(filters[key]?.toLowerCase())
        ) {
          check = false;
        }
      } else if (key === "following") {
        if (order.devFollowing !== (filters[key] === "si")) {
          check = false;
        }
      } else if (key === "class" && filters[key] === "no-reclamo") {
        if (order[key].toLowerCase() === "reclamo") {
          check = false;
        }
      } else if (["solicitor", "code"].includes(key)) {
        if (
          !order[key] ||
          !`${order[key]}`.toLowerCase().includes(filters[key].toLowerCase())
        ) {
          check = false;
        }
      } else {
        if (filters[key] && order[key] !== filters[key]) {
          check = false;
        }
      }
    });
    return check;
  };
  const applyFilters = useCallback(
    (filters) => {
      const newList = workOrderList.filter((order) =>
        checkFilters(order, filters)
      );
      setFilteredList(newList);
      setFilters(filters);
    },
    [workOrderList, setFilteredList, setFilters]
  );

  function removeKey(e) {
    e.preventDefault();
    const { value } = e.currentTarget;
    const newFilters = { ...filters };
    delete newFilters[value];
    if (!newFilters.plant) delete newFilters.area;
    if (!newFilters.area) delete newFilters.line;
    applyFilters(newFilters);
  }

  useEffect(() => {
    workOrderList && applyFilters(filters);
  }, [workOrderList, applyFilters, filters]);

  const timelapseIndex = timelapses.findIndex((t) => t.label === timelapse);
  const { dateMin, dateMax } = filters;

  return (
    <div>
      <div className="flex w-full gap-2 items-center mb-2 -mt-2">
        <div className="flex w-full items-center bg-base-content/10 rounded-lg justify-between pl-2">
          <div className="font-bold">Filtros</div>
          <div className="flex flex-grow px-2 sm:px-4 h-full items-center flex-wrap gap-1 py-1">
            {Object.keys(filters)[0] ? (
              Object.keys(filters).map((value, index) => (
                <div key={index} className="badge text-xs">
                  <b>{headersRef[value]}:</b> {filters[value]}
                </div>
              ))
            ) : (
              <div className="italic text-sm opacity-50">
                No hay filtros seleccionados
              </div>
            )}
          </div>
          <button
            className={`btn btn-primary ml-auto ${
              Object.keys(filters)[0] ? "" : "opacity-0"
            }`}
            disabled={!Object.keys(filters)[0]}
            onClick={cleanFilters}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>

        <button
          onClick={() => setDisplayFilters(!displayFilters)}
          className="btn btn-circle btn-outline bg-transparent hover:bg-base-content/10 hover:text-base-content border-2 btn-sm border-base-content"
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`transition-transform duration-300 ${
              displayFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {true && (
        <div
          className={`flex w-full flex-col sm:flex-row gap-2 overflow-hidden transition-[height] duration-300 ${
            displayFilters ? "h-[9rem] min-h-fit" : "h-0"
          }`}
        >
          <div className="flex flex-col gap-1 flex-grow w-full sm:w-1/2 justify-between">
            <div className="flex gap-4">
              <input
                name="code"
                className="custom-input-text min-w-0 w-28 focus:bg-base-content/10"
                placeholder="Nro OT"
                onChange={handleSelect}
              />
              <input
                name="device"
                className="custom-input-text min-w-0 flex-grow focus:bg-base-content/10"
                placeholder="Nombre o Código de Equipo"
                onChange={handleSelect}
              />
            </div>
            <div className="flex gap-x-4 gap-y-1 flex-wrap">
              {[
                { label: "Planta", field: "plant" },
                { label: "Área", field: "area" },
                { label: "Línea", field: "line" },
              ].map(({ label, field }) => (
                <DropdowOptions
                  key={field}
                  className={field === "area" ? "dropdown-end" : undefined}
                  label={label}
                  value={filters[field]}
                  list={filteredList}
                  field={field}
                  onClick={handleSelect}
                  onDelete={removeKey}
                />
              ))}
            </div>
            <div className="flex gap-x-4 gap-y-1 flex-wrap">
              {[
                { label: "Supervisor", field: "supervisor" },
                { label: "Solicitante", field: "solicitor" },
              ].map(({ label, field }) => (
                <DropdowOptions
                  className={field === "solicitor" ? "dropdown-end" : undefined}
                  key={field}
                  label={label}
                  value={filters[field]}
                  list={filteredList}
                  field={field}
                  onClick={handleSelect}
                  onDelete={removeKey}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-grow max-w-full">
            {[
              {
                label: "Estado",
                options: ["Abierta", "Cerrada"],
                name: "status",
                replacements: { Abierta: "Pendiente" },
              },
              {
                label: "Clase",
                options: ["Reclamo", "no-reclamo"],
                name: "class",
                replacements: { "no-reclamo": "No Reclamo" },
              },
              {
                label: "Siguiendo",
                options: ["si", "no"],
                name: "following",
                replacements: { si: "Si", no: "No" },
              },
            ].map(({ label, options, name, replacements }) => (
              <GroupedOptions
                key={name}
                label={label}
                options={options}
                name={name}
                filters={filters}
                onClick={handleSelect}
                onDelete={removeKey}
                replacements={replacements}
              />
            ))}
            <div className="flex items-center gap-1 flex-grow">
              <div className="w-[5.5rem] sm:w-24 flex">
                <DropdowOptions
                  label={timelapse}
                  value={timelapse}
                  list={timelapses}
                  field={"label"}
                  onClick={(e) => {
                    e.preventDefault();
                    setTimelapse(
                      timelapses.find((t) => t.label === e.currentTarget.value)
                        .label
                    );
                  }}
                  onDelete={null}
                  top
                />
              </div>
              {timelapseIndex === 0 ? (
                <button
                  className={`btn btn-sm px-1 btn-primary flex-grow ${
                    dateMin === datesByYear(yyyyMm).dateMin &&
                    dateMax === datesByYear(yyyyMm).dateMax
                      ? "border-none"
                      : "btn-outline opacity-75"
                  }`}
                  onClick={clickYear}
                  value={yyyyMm}
                >
                  {yyyyMm}
                </button>
              ) : timelapseIndex === 1 ? (
                <div className="flex flex-grow gap-1">
                  {[0, 1, 2].map((d) => (
                    <button
                      key={d}
                      className={`btn btn-sm px-1 btn-primary flex-grow ${
                        dateMin === datesByYear(currentYear - d).dateMin &&
                        dateMax === datesByYear(currentYear - d).dateMax
                          ? "border-none"
                          : "btn-outline opacity-75"
                      }`}
                      onClick={clickYear}
                      value={currentYear - d}
                    >
                      {currentYear - d}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {["dateMin", "dateMax"].map((item) => (
                    <input
                      name={item}
                      value={filters[item] || dates[item]}
                      className="input input-bordered input-sm w-20 text-xs sm:text-sm flex-grow focus-visible:outline-none border-primary min-w-0 text-primary focus:bg-base-content/10 px-1"
                      type="date"
                      onChange={handleSelect}
                    />
                  ))}
                </>
              )}
              <button
                className="disabled:opacity-0 ml-1"
                title={
                  filters.dateMin || filters.dateMax ? "borrar filtro" : ""
                }
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.dateMin;
                  delete newFilters.dateMax;
                  setFilters(newFilters);
                  applyFilters(newFilters);
                }}
                disabled={!(filters.dateMin || filters.dateMax)}
              >
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="text-error pl-2"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
