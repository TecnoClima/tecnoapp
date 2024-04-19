import { useEffect, useState } from "react";
import { appConfig } from "../../../config";
import { useSelector } from "react-redux";
const { headersRef } = appConfig;
// const unassigned = "SIN PROGRAMA ASIGNADO";

function FilterSelect({ id, value, options, onSelect }) {
  return (
    <div className="form-group mb-2">
      <label htmlFor={id} className="fw-bold" style={{ fontSize: "14px" }}>
        {headersRef[id] || id}
      </label>
      <select
        onChange={onSelect && onSelect}
        className="form-control form-control-sm"
        value={value || ""}
        name={id}
        id={id}
      >
        <option value="">Sin Seleccionar</option>
        {options &&
          options.map((p, i) => (
            <option key={i} value={p._id || p}>
              {p.name || p}
            </option>
          ))}
      </select>
    </div>
  );
}

export default function DeviceFilters({
  onSubmit,
  filters,
  setFilters,
  initialFilter,
}) {
  const { deviceOptions } = useSelector((state) => state.devices);
  const { userData } = useSelector((state) => state.people);
  const [errors, setErrors] = useState({});

  function handleSetRequestFilters(e) {
    e.preventDefault();
    const { name, value } = e.currentTarget;
    const newRequestFilters = { ...filters };
    if (!value && value !== "0") {
      delete newRequestFilters[name];
    } else {
      newRequestFilters[name] = value;
      if (
        ["powerMin", "powerMax"].includes(name) &&
        !newRequestFilters.powerUnit
      )
        newRequestFilters.powerUnit = "frig";
    }
    if (!newRequestFilters.powerMin && !newRequestFilters.powerMax)
      delete newRequestFilters.powerUnit;
    setFilters(newRequestFilters);
  }

  useEffect(() => {
    const { powerMin, powerMax, ageMin, ageMax, recMin, recMax } = filters;
    const checks = {};
    function compareValues(a, b) {
      if (!a || !b) return false;
      const min = Number(a);
      const max = Number(b);
      return (min && min < 0) || (max && max < 0) || (min && max && min > max);
    }
    checks.power = compareValues(powerMin, powerMax);
    checks.age = compareValues(ageMin, ageMax);
    checks.reclaims = compareValues(recMin, recMax);
    Object.keys(checks).forEach((k) => !checks[k] && delete checks[k]);
    setErrors(checks);
  }, [filters]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit && onSubmit(filters);
  }

  function handleReset(e) {
    e.preventDefault();
    setFilters(initialFilter);
    onSubmit && onSubmit(initialFilter);
  }

  // useEffect(() => console.log("filters", filters), [filters]);
  // useEffect(() => console.log(errors), [errors]);

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
      >
        <i className="fas fa-filter me-2"></i>
        Filtros
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
        <div className="offcanvas-body pt-0">
          {userData.access === "Admin" && (
            <FilterSelect
              id="plant"
              value={filters.plant}
              options={deviceOptions?.plant}
              onSelect={handleSetRequestFilters}
            />
          )}
          <FilterSelect
            id="area"
            value={filters.area}
            options={deviceOptions?.area?.filter((a) =>
              filters?.plant ? a.plant === filters.plant : true
            )}
            onSelect={handleSetRequestFilters}
          />
          <FilterSelect
            id="line"
            value={filters.line}
            options={deviceOptions?.line?.filter((l) =>
              filters?.area
                ? l.area === filters.area
                : filters?.plant
                ? deviceOptions.area
                    .filter((a) => a.plant === filters.plant)
                    .map((a) => a._id)
                    .includes(l.area)
                : true
            )}
            onSelect={handleSetRequestFilters}
          />
          <div className="form-group mb-2">
            <label
              htmlFor="device"
              className="fw-bold"
              style={{ fontSize: "14px" }}
            >
              Equipo
            </label>
            <input
              type="text"
              onChange={handleSetRequestFilters}
              value={filters.device}
              className="form-control form-control-sm"
              name="device"
              id="device"
              placeholder="Parte del código o nombre"
            />
          </div>
          <FilterSelect
            id="type"
            value={filters.type}
            options={deviceOptions?.type}
            onSelect={handleSetRequestFilters}
          />
          <div className="form-group mb-2">
            <label
              htmlFor="device"
              className="fw-bold"
              style={{ fontSize: "14px" }}
            >
              Potencia
            </label>
            <div className="d-flex w-100">
              <div className="input-group flex-grow-1 input-group-sm">
                <span className="input-group-text px-1">Min</span>
                <input
                  type="number"
                  min="0"
                  value={filters.powerMin || ""}
                  onChange={handleSetRequestFilters}
                  name="powerMin"
                  className="form-control"
                />
              </div>
              <div className="input-group flex-grow-1 input-group-sm">
                <span className="input-group-text px-1">Max</span>
                <input
                  type="number"
                  min="0"
                  value={filters.powerMax || ""}
                  onChange={handleSetRequestFilters}
                  name="powerMax"
                  className="form-control"
                />
              </div>
              <div className="input-group w-auto flex-nowrap input-group">
                {["frig", "TR"].map((u) => (
                  <button
                    key={u}
                    value={u}
                    name="powerUnit"
                    onClick={handleSetRequestFilters}
                    className={`btn btn-sm ${
                      filters.powerUnit === u
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            {errors.power && (
              <div
                className="alert alert-danger py-0 px-1 fw-bold text-danger"
                style={{ fontSize: "12px" }}
              >
                Las potencias deben ser mínimo cero y Max debe ser mayor o igual
                que Min
              </div>
            )}
          </div>
          {["refrigerant", "category", "environment", "service"].map((k) => (
            <FilterSelect
              id={k}
              key={k}
              value={filters[k] || ""}
              options={deviceOptions?.[k]}
              onSelect={handleSetRequestFilters}
            />
          ))}
          <div className="form-group mb-2">
            <label
              htmlFor="device"
              className="fw-bold"
              style={{ fontSize: "14px" }}
            >
              Antigüedad (en años)
            </label>
            <div className="d-flex w-100">
              <div className="input-group flex-grow-1 input-group-sm">
                <span className="input-group-text px-1">Min</span>
                <input
                  type="number"
                  min="0"
                  value={filters.ageMin || ""}
                  onChange={handleSetRequestFilters}
                  name="ageMin"
                  className="form-control"
                />
              </div>
              <div className="input-group flex-grow-1 input-group-sm">
                <span className="input-group-text px-1">Max</span>
                <input
                  type="number"
                  min="0"
                  value={filters.ageMax || ""}
                  onChange={handleSetRequestFilters}
                  name="ageMax"
                  className="form-control"
                />
              </div>
            </div>
            {errors.age && (
              <div
                className="alert alert-danger py-0 px-1 fw-bold text-danger"
                style={{ fontSize: "12px" }}
              >
                Las antigüedades deben ser mínimo cero y Max debe ser mayor o
                igual que Min
              </div>
            )}
          </div>
          <FilterSelect
            id="status"
            value={filters.status}
            options={deviceOptions?.status}
            onSelect={handleSetRequestFilters}
          />

          <div className="form-group mb-2">
            <label
              htmlFor="device"
              className="fw-bold"
              style={{ fontSize: "14px" }}
            >
              Reclamos (cantidad)
            </label>
            <div className="d-flex w-100">
              <div className="input-group flex-grow-1 input-group-sm">
                <span className="input-group-text px-1">Min</span>
                <input
                  type="number"
                  min="0"
                  value={filters.recMin || ""}
                  onChange={handleSetRequestFilters}
                  name="recMin"
                  className="form-control"
                />
              </div>
              <div className="input-group flex-grow-1 input-group-sm">
                <span className="input-group-text px-1">Max</span>
                <input
                  type="number"
                  min="0"
                  onChange={handleSetRequestFilters}
                  value={filters.recMax || ""}
                  name="recMax"
                  className="form-control"
                />
              </div>
            </div>
            {errors.rec && (
              <div
                className="alert alert-danger py-0 px-1 fw-bold text-danger"
                style={{ fontSize: "12px" }}
              >
                Los reclamos deben ser mínimo cero y Max debe ser mayor o igual
                que Min
              </div>
            )}
          </div>
          <div className="row">
            <div className="col">
              <button
                className="btn btn-danger w-100"
                onClick={handleReset}
                disabled={JSON.stringify(filters) === "{}"}
              >
                Limpiar Filtros
              </button>
            </div>
            <div className="col">
              <button
                className="btn btn-info w-100"
                onClick={handleSubmit}
                disabled={JSON.stringify(errors) !== "{}"}
              >
                <i className="fa fa-search me-1"></i>
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
