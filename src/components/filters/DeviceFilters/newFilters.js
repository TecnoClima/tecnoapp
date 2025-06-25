import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions } from "../../../actions/StoreActions";
import { appConfig } from "../../../config";
import ErrorMessage from "../../forms/ErrorMessage";
const { headersRef } = appConfig;
// const unassigned = "SIN PROGRAMA ASIGNADO";

export function FilterSelect({
  id,
  value,
  options,
  disabled,
  onSelect,
  noLabel,
  placeholder,
}) {
  return (
    <div className="join text-sm bg-base-content/10 w-full border border-base-content/20">
      {!noLabel && (
        <label
          htmlFor={id}
          className="label w-20 flex-none join-item input-sm px-2 min-w-fit"
        >
          {headersRef[id] || id}
        </label>
      )}
      <select
        onChange={onSelect && onSelect}
        className="select join-item select-sm w-20 flex-grow px-1"
        value={value || ""}
        name={id}
        id={id}
        disabled={disabled}
      >
        <option value="">{placeholder || "Sin Seleccionar"}</option>
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

export function FilterInput({
  id,
  value,
  onChange,
  name,
  disabled,
  noLabel,
  placeholder,
}) {
  return (
    <div className="join w-full">
      {!noLabel && (
        <label
          htmlFor={id}
          className="label input-xs md:input-sm bg-base-content/10 w-28 join-item border border-base-content/20 min-w-fit"
        >
          {headersRef[id] || id}
        </label>
      )}
      <input
        onChange={onChange && onChange}
        className="input input-xs md:input-sm input-bordered join-item flex-grow"
        value={value ?? ""}
        placeholder={placeholder}
        type="text"
        name={id}
        id={id}
        disabled={disabled}
      />
    </div>
  );
}

function FilterRangedInput({
  id,
  name,
  min,
  max,
  handleSetFilter,
  errors,
  unit,
  unitArray,
  errorMessage,
}) {
  return (
    <div className="relative">
      <div className="join items-center w-full">
        <label
          htmlFor={id}
          className="label input-xs md:input-sm bg-base-content/10 w-28 join-item border border-base-content/20 min-w-fit"
        >
          {headersRef[id] || id}
        </label>
        <input
          id={`${id}Min`}
          type="number"
          min="0"
          placeholder="Min"
          value={min || ""}
          onChange={handleSetFilter}
          name={`${id}Min`}
          className="input input-xs md:input-sm input-bordered join-item w-12 flex-grow"
        />
        <input
          id={`${id}Max`}
          type="number"
          min="0"
          placeholder="Max"
          value={max || ""}
          onChange={handleSetFilter}
          name={`${id}Max`}
          className="input input-xs md:input-sm input-bordered join-item w-12 flex-grow"
        />
        {unitArray?.length > 1 ? (
          unitArray.map((u) => (
            <button
              key={u}
              value={u}
              name={`${id}Unit`}
              onClick={unitArray.length > 0 ? handleSetFilter : undefined}
              className={`btn btn-sm btn-primary join-item" ${
                unit === u ? "" : "btn-outline"
              }`}
            >
              {u}
            </button>
          ))
        ) : unitArray?.[0] ? (
          <label className="label input-xs md:input-sm bg-base-content/10 join-item min-w-fit">
            {unitArray[0]}
          </label>
        ) : (
          <></>
        )}
      </div>
      {errors[id] && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  );
}

export default function DeviceFilters({
  onSubmit,
  filters,
  setFilters,
  initialFilter,
  hidePlant,
  plant,
}) {
  const { deviceOptions } = useSelector((state) => state.devices);
  const { userData } = useSelector((state) => state.people);
  const [errors, setErrors] = useState({});
  const closeSidebar = useRef(null);
  const dispatch = useDispatch();

  // get the filters
  useEffect(() => {
    if (JSON.stringify(deviceOptions) === "{}" || !deviceOptions)
      dispatch(deviceActions.allOptions());
  }, [dispatch, deviceOptions]);

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
    setFilters(plant ? { ...newRequestFilters, plant } : newRequestFilters);
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

  return (
    <>
      <div className="drawer z-10 w-fit">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer"
            className="btn btn-sm btn-primary drawer-button"
          >
            <i className="fas fa-filter me-2"></i>
            Filtros
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
            ref={closeSidebar}
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-80 gap-1 px-1">
            {/* Sidebar content here */}
            <div className="flex w-full justify-between items-start">
              <div className="page-title">Filtros de equipo</div>

              <button
                type="button"
                className="btn-close text-reset"
                aria-label="Close"
                onClick={() => closeSidebar?.current?.click()}
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 mx-1" />
              </button>
            </div>
            {userData.access === "Admin" && !hidePlant && (
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
            <FilterInput
              id={"device"}
              value={filters.device}
              onChange={handleSetRequestFilters}
            />
            <FilterSelect
              id="type"
              value={filters.type}
              options={deviceOptions?.type}
              onSelect={handleSetRequestFilters}
            />
            <FilterRangedInput
              id="power"
              min={filters.powerMin}
              max={filters.powerMax}
              handleSetFilter={handleSetRequestFilters}
              errors={errors}
              unit={filters.powerUnit}
              unitArray={["frig", "TR"]}
              errorMessage="Las potencias deben ser mínimo cero y Max debe ser mayor o igual que
          Min"
            />
            {["refrigerant", "category", "environment", "service"].map((k) => (
              <FilterSelect
                id={k}
                key={k}
                value={filters[k] || ""}
                options={deviceOptions?.[k]}
                onSelect={handleSetRequestFilters}
              />
            ))}
            <FilterRangedInput
              id="age"
              min={filters.ageMin}
              max={filters.ageMax}
              handleSetFilter={handleSetRequestFilters}
              errors={errors}
              unit={"años"}
              unitArray={["años"]}
              errorMessage="Las antigüedades deben ser mínimo cero y Max debe ser mayor o
                igual que Min"
            />
            <FilterSelect
              id="status"
              value={filters.status}
              options={deviceOptions?.status}
              onSelect={handleSetRequestFilters}
            />
            <FilterRangedInput
              id="reclaims"
              min={filters.recMin}
              max={filters.recMax}
              handleSetFilter={handleSetRequestFilters}
              errors={errors}
              errorMessage="Los reclamos deben ser mínimo cero y Max debe ser mayor o igual
                que Min"
            />
            <div className="flex w-full flex-col flex-grow gap-1">
              <button
                className="btn btn-sm btn-error w-fit ml-auto mt-4"
                onClick={handleReset}
                disabled={JSON.stringify(filters) === "{}"}
              >
                Limpiar Filtros
                <i className="fa fa-backspace"></i>
              </button>
              <button
                className="btn btn-success mt-auto"
                onClick={handleSubmit}
                disabled={JSON.stringify(errors) !== "{}"}
              >
                <i className="fa fa-search"></i>
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
