import { datesByYear } from "../../utils/utils";
import { appConfig } from "../../config";
import { useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
const { headersRef } = appConfig;

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
      } else if (key === "class" && filters[key] === "no-reclamo") {
        if (filters[key].toLowerCase() === "reclamo") {
          check = false;
        }
      } else if (["solicitor", "code"].includes(key)) {
        if (
          !order[key] ||
          !order[key].toLowerCase().includes(filters[key].toLowerCase())
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

  // useEffect(() => console.log(filters), [filters]);
  useEffect(() => console.log(userData), [userData]);
  // useEffect(() => console.log(filteredList[0]), [filteredList]);

  return (
    <div>
      <div className="container px-0">
        <div className="row">
          <div className="col-12 col-md-6 col-xl-3">
            <div className="input-group input-group-md mb-2 mx-0">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  N° OT
                </span>
              </div>
              <input
                name="code"
                value={filters.code || ""}
                onChange={handleSelect}
                type="text"
                className="form-control"
                aria-label="Small"
                placeholder="Coincidencia parcial"
                aria-describedby="inputGroup-sizing-sm"
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <div className="input-group input-group-md mb-2 mx-0">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  Equipo
                </span>
              </div>
              <input
                name="device"
                value={filters.device || ""}
                onChange={handleSelect}
                type="text"
                className="form-control"
                aria-label="Small"
                placeholder="Coincidencia parcial de código o nombre"
                aria-describedby="inputGroup-sizing-sm"
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <div className="input-group input-group-md mb-2 mx-0 w-100">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  Estado
                </span>
              </div>
              {["Pendiente", "Cerrada"].map((status) => (
                <button
                  value={status}
                  key={status}
                  name="status"
                  onClick={handleSelect}
                  className={`btn btn-sm flex-grow-1  ${
                    filters.status === status ? "btn-info" : "btn-outline-info"
                  }`}
                >
                  {status}
                </button>
              ))}
              {filters.status && (
                <button
                  value="status"
                  onClick={removeKey}
                  className="btn btn-sm btn-outline-danger"
                >
                  <i className="fas fa-trash-alt" />
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <div className="input-group input-group-md mb-2 mx-0 w-100">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  Clase
                </span>
              </div>
              <button
                value="Reclamo"
                name="class"
                onClick={handleSelect}
                className={`btn btn-sm flex-grow-1 ${
                  filters.class === "Reclamo" ? "btn-info" : "btn-outline-info"
                }`}
              >
                Reclamo
              </button>
              <button
                value="no-reclamo"
                name="class"
                onClick={handleSelect}
                className={`btn btn-sm flex-grow-1 ${
                  filters.class === "no-reclamo"
                    ? "btn-info"
                    : "btn-outline-info"
                }`}
              >
                No Reclamo
              </button>
              {filters.class && (
                <button
                  value="class"
                  onClick={removeKey}
                  className="btn btn-sm btn-outline-danger"
                >
                  <i className="fas fa-trash-alt" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="accordion d-grid gap-2" id="accordionExample">
        <div className="d-grid gap-2">
          <button
            className="btn btn-secondary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            Más Filtros
          </button>
          <div
            id="collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-0"></div>
            <div className="container-fluid px-0">
              <div className="row">
                <div className="col-md-4">
                  <div className="d-flex flex-wrap w-100 mb-2 align-items-center justify-content-between">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={clickYear}
                      value={yyyyMm}
                    >
                      {yyyyMm}
                    </button>

                    <div className="d-flex gap-2">
                      {[0, 1, 2].map((d) => (
                        <button
                          key={d}
                          className="btn btn-sm btn-info my-1"
                          onClick={clickYear}
                          value={currentYear - d}
                        >
                          {currentYear - d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="input-group input-group-md mb-2 col-4">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        id="inputGroup-sizing-sm"
                      >
                        Fechas
                      </span>
                    </div>
                    <input
                      name="dateMin"
                      value={filters.dateMin || dates.dateMin}
                      onChange={handleSelect}
                      type="date"
                      className="form-control"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                    <input
                      name="dateMax"
                      value={filters.dateMax || dates.dateMax}
                      onChange={handleSelect}
                      type="date"
                      className="form-control"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  {["plant", "area", "line"]
                    .filter((key) => !userData[key])
                    .map((key) => (
                      <div
                        key={key}
                        className="input-group input-group-md mb-2"
                      >
                        <div className="input-group-prepend">
                          <label className="input-group-text ">
                            {headersRef[key]}
                          </label>
                        </div>
                        <select
                          onChange={handleSelect}
                          value={filters[key] || ""}
                          className="form-select"
                          disabled={userData[key]}
                          name={key}
                        >
                          <option value="">Todas</option>
                          {[...new Set(filteredList.map((order) => order[key]))]
                            .sort((a, b) => (a > b ? 1 : -1))
                            .map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                        </select>
                        {filters[key] && (
                          <button
                            onClick={removeKey}
                            value={key}
                            className="btn btn-sm btn-outline-danger d-flex align-items-center py-0"
                          >
                            <i className="fas fa-trash-alt" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
                <div className="col-md-4">
                  <div className="input-group input-group-md mb-2">
                    <div className="input-group-prepend">
                      <label className="input-group-text ">Supervisor</label>
                    </div>
                    <select
                      onChange={handleSelect}
                      value={filters.supervisor || ""}
                      className="form-select"
                      name="supervisor"
                    >
                      <option value="">Todas</option>
                      {[
                        ...new Set(
                          filteredList.map((order) => order.supervisor)
                        ),
                      ]
                        .sort((a, b) => (a > b ? 1 : -1))
                        .map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                    </select>
                    {filters.supervisor && (
                      <button
                        onClick={removeKey}
                        value="supervisor"
                        className="btn btn-sm btn-outline-danger d-flex align-items-center py-0"
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                    )}
                  </div>

                  <div className="input-group input-group-md mb-2">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        id="inputGroup-sizing-sm"
                      >
                        Solicitante
                      </span>
                    </div>
                    <input
                      name="solicitor"
                      value={filters.solicitor || ""}
                      onChange={handleSelect}
                      type="text"
                      className="form-control"
                      aria-label="Small"
                      placeholder="Coincidencia parcial"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  <div className="d-flex justify-content-end align-items-baseline">
                    <button
                      onClick={cleanFilters}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
