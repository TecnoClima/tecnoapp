import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deviceActions } from "../../../actions/StoreActions";
import { ErrorModal, SuccessModal } from "../../../components/warnings";
import WarningErrors from "../../../components/warnings/WarningErrors";
import { appConfig } from "../../../config";
import "./index.css";
const { headersRef } = appConfig;

export function FormInput({
  className,
  label,
  item,
  placeholder,
  select,
  textArea,
  type,
  min,
  max,
  defaultValue,
  result,
  error,
  onChange,
  value,
}) {
  return (
    <div className={textArea ? "col-md-12" : className || "col-md-3"}>
      <div
        className={`input-group mb-3 required  ${
          result && !result[item] && `border border-2 border-danger`
        }`}
      >
        <span className="input-group-text" id="inputGroup-sizing-default">
          {label}
        </span>
        {textArea ? (
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            name={item}
            defaultValue={defaultValue || (result && result[item])}
            onBlur={select}
            placeholder={placeholder}
            rows="3"
          />
        ) : (
          <input
            type={type || "text"}
            className="form-control"
            aria-label="Sizing example input"
            defaultValue={defaultValue || (result && result[item])}
            name={item}
            value={value}
            onChange={onChange}
            min={min || "0"}
            max={max || Infinity}
            onBlur={select}
            placeholder={placeholder}
            aria-describedby="inputGroup-sizing-default"
          />
        )}
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export const FormSelector = ({
  className,
  label,
  item,
  array,
  values,
  captions,
  select,
  defaultValue,
  value,
  error,
  result,
}) => {
  return (
    <div className={className || "col-md-3"}>
      <div
        className={`input-group mb-3 required  ${
          result && !result[item] && `border border-2 border-danger`
        }`}
      >
        <span className="input-group-text" id="inputGroup-sizing-default">
          {label}
        </span>
        {array && (
          <select
            className="form-select"
            aria-label="Default select example"
            defaultValue={defaultValue || (result && result[item])}
            value={value}
            name={item}
            onChange={select}
          >
            <option value="">Sin Seleccionar</option>
            {[
              ...new Set(
                array
                  .sort((a, b) =>
                    (captions ? a[captions] > b[captions] : a > b) ? 1 : -1
                  )
                  .map((e) =>
                    JSON.stringify(
                      values
                        ? { value: e[values], caption: e[captions] }
                        : e[item] || e
                    )
                  )
              ),
            ].map((element, index) => {
              const item = JSON.parse(element);
              return (
                <option key={index} value={values ? item.value : item}>
                  {values ? item.caption : headersRef[item] || item}
                </option>
              );
            })}
            {/* {values && [...new Set (array.map(e=>e[item] || e))].sort((a,b)=>a>b?1:-1).map((value,index)=>
                        <option key={index} value={value}>{value}</option>
                    )} */}
          </select>
        )}
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

function CreateDevice({ close }) {
  const { deviceOptions, deviceResult, deviceFullList } = useSelector(
    (state) => state.devices
  );
  const [locations, setLocations] = useState([]);
  const [locError, setLocError] = useState(false);
  const [errors, setErrors] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [device, setDevice] = useState({
    active: true,
    regDate: new Date().toISOString().split("T")[0],
  });
  const dispatch = useDispatch();

  //Setting Options
  useEffect(() => setLocations(deviceOptions.locations), [deviceOptions]);
  useEffect(() => {
    if (!locations || !locations[0]) dispatch(deviceActions.allOptions());
  }, [locations, dispatch]);

  useEffect(() => {
    if (!device.line) return;
    const location = locations.find((e) => e.lineId === device.line);
    setLocError(
      device.line &&
        ((device.area && device.area !== location.area) ||
          (device.plant && device.plant !== location.plant))
    );
  }, [locations, device]);

  function setValue(e) {
    e.preventDefault();
    const { name, value } = e.target;
    const newJson = { ...device };
    value ? (newJson[name] = value) : delete newJson[name];
    if (name === "plant") delete newJson.area;
    if (["plant", "area"].includes(name)) delete newJson.line;
    setDevice(newJson);
  }
  function pickItem(e) {
    e.preventDefault();
    const { name, value } = e.target;
    const newArray = device[name] ? [...device[name]] : [];
    setDevice({
      ...device,
      [name]: newArray.includes(value)
        ? newArray.filter((e) => e !== value)
        : [...newArray, value],
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const warnings = ["¿Confirma que desea guardar el equipo?"];
    const keys = [
      "line",
      "name",
      "regDate",
      "type",
      "power",
      "unit",
      "refrigerant",
      "service",
      "category",
      "environment",
      "status",
      "active",
    ];
    const errors = keys.filter((key) => !Object.keys(device).includes(key));
    if (!device.servicePoints)
      warnings.unshift(
        "¿Confirma que desea guardar sin asignar puntos de servicio?"
      );
    if (!device.extraDetails)
      warnings.unshift("¿Confirma que desea guardar sin describir detalles?");
    setErrors(errors);
    if (!errors[0]) setConfirm(warnings);
  }
  function save(e) {
    if (e) e.preventDefault();
    dispatch(
      deviceActions.createNew({
        ...device,
        power: device.unit === "Tn Ref." ? device.power * 3000 : device.power,
      })
    );
  }
  function handleCloseSuccess(e) {
    if (e) e.preventDefault();
    setDevice({});
    dispatch(deviceActions.resetResult());
  }

  return (
    <div className="modal">
      <div
        className="container bg-light col-10 p-3"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <div className="container">
          <div className="row flex-row-reverse">
            <button
              type="button"
              className="btn-close col-1"
              aria-label="Close"
              style={{ float: "right" }}
              onClick={close}
            />
          </div>
          <div className="row">
            <h3 className="col col-11">Agregar Nuevo Equipo</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="row">
              <FormSelector
                label="Planta"
                array={locations}
                item="plant"
                select={setValue}
                defaultValue={device.plant}
              />
              <FormSelector
                label="Area"
                item="area"
                array={
                  device.plant
                    ? locations.filter(
                        (location) => location.plant === device.plant
                      )
                    : locations
                }
                select={setValue}
                defaultValue={device.area}
              />
              <FormSelector
                label="Linea"
                item="line"
                result={device}
                array={
                  device.area
                    ? locations.filter(
                        (location) => location.area === device.area
                      )
                    : locations
                }
                select={setValue}
                values="lineId"
                captions="line"
                defaultValue={device.line}
              />
            </div>
            {locError && (
              <div className="alert alert-danger" role="alert">
                {"La línea debe pertenecer al área y el área a la planta"}
              </div>
            )}

            <div className="row">
              <FormInput
                label="Nombre"
                item="name"
                placeholder="Nombre o Denominación"
                result={device}
                select={setValue}
                defaultValue={device.name}
                error={
                  !device.code &&
                  device.name &&
                  deviceFullList.find(
                    (d) => d.name.toLowerCase() === device.name.toLowerCase()
                  ) &&
                  `Ya existe un equipo con ese nombre`
                }
              />
              <FormInput
                label="Fecha Alta"
                type="date"
                item="regDate"
                result={device}
                max={new Date().toISOString().split("T")[0]}
                defaultValue={new Date().toISOString().split("T")[0]}
                placeholder="Nombre o Denominación"
                select={setValue}
              />
              <div className="col">
                <div className="input-group mb-3">
                  <div
                    className={`input-group-text ${
                      device.active && `bg-success text-light`
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      defaultChecked={true}
                      onChange={(e) =>
                        setDevice({ ...device, active: e.target.checked })
                      }
                    />
                  </div>
                  <span
                    className={`input-group-text ${
                      device.active && `bg-success text-light`
                    }`}
                  >
                    Equipo en actividad
                  </span>
                </div>
              </div>
              <FormSelector
                label="Tipo"
                array={deviceOptions.type}
                item="type"
                result={device}
                select={setValue}
                defaultValue={device.type}
              />
              <FormInput
                label="Potencia"
                type="number"
                item="power"
                min={"0"}
                result={device}
                select={setValue}
                defaultValue={device.power}
              />
              <FormSelector
                label="Unidad"
                item="unit"
                array={["Frigorías", "Tn Ref."]}
                result={device}
                select={setValue}
                noInit={true}
              />
              <FormSelector
                label="Gas"
                item="refrigerant"
                array={deviceOptions.refrigerant}
                result={device}
                select={setValue}
              />
              <FormSelector
                label="Servicio"
                item="service"
                array={deviceOptions.service}
                result={device}
                select={setValue}
              />
              <FormSelector
                label="Categoría"
                item="category"
                array={deviceOptions.category}
                result={device}
                select={setValue}
              />
              <FormSelector
                label="Ambiente"
                item="environment"
                array={deviceOptions.environment}
                result={device}
                select={setValue}
              />
              <FormSelector
                label="Estado"
                item="status"
                array={deviceOptions.status}
                result={device}
                select={setValue}
              />
            </div>
            <div className="row">
              <FormInput
                label="Descripción"
                item="extraDetails"
                placeholder="Descripción o detalle a tener en cuenta"
                select={setValue}
                textArea={true}
                defaultValue={device.extraDetails}
              />
            </div>
            <div className="row">
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Seleccionar Lugares de Servicio
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {device.line ? (
                        <div
                          className="container"
                          style={{ maxHeight: "50vh", overflowY: "auto" }}
                        >
                          <div className="row">
                            {locations
                              .filter((e) => e.line === device.line)
                              .sort((a, b) => (a.name > b.name ? 1 : -1))
                              .map((location, index) => (
                                <div className="col col-3" key={index}>
                                  <button
                                    id={location.code}
                                    name="servicePoints"
                                    value={location.code}
                                    className={`btn ${
                                      device.servicePoints &&
                                      device.servicePoints.includes(
                                        location.code
                                      )
                                        ? "btn-primary"
                                        : "btn-secondary"
                                    } m-1 col-12`}
                                    onClick={pickItem}
                                    style={{ height: "90%" }}
                                  >
                                    {location.name}
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <h6>Debe seleccionar línea primero</h6>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {errors[0] && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >{`Debe completar ${errors
                  .map((e) => headersRef[e])
                  .join(", ")}`}</div>
              )}
            </div>
            <div className="row">
              <button className="btn btn-primary" type="submit">
                GUARDAR
              </button>
            </div>
            {confirm && (
              <WarningErrors
                warnings={confirm}
                proceed={save}
                close={() => setConfirm(false)}
              />
            )}
            {deviceResult.error && (
              <ErrorModal
                message={`No se pudo crear el equipo. Error: ${deviceResult.error}`}
                close={() => dispatch(deviceActions.resetResult())}
              />
            )}
            {deviceResult.success && (
              <SuccessModal
                message={`Equipo creado correctamente. El código es ${deviceResult.success}.`}
                link={`/equipos/${deviceResult.success}`}
                close={handleCloseSuccess}
              />
            )}
          </div>
        </form>
        <br />
      </div>
    </div>
  );
}

// servicePoints,active
export default function DeviceAdmin() {
  const { deviceFullList } = useSelector((state) => state.devices);
  const { userData } = useSelector((state) => state.people);
  const [filteredList, setFilteredList] = useState([]);
  const [locOptions, setLocOptions] = useState([]); // Location Options
  const [filters, setFilters] = useState({});
  const [create, setCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) return;
    if (filteredList[0]) setLoading(false);
    if (!filteredList[0]) {
      dispatch(
        deviceActions.getFullList(
          userData.access === "Admin" ? undefined : userData.plant
        )
      );
      setLoading(true);
    }
  }, [loading, userData, filteredList, dispatch]);

  useEffect(() => {
    if (deviceFullList && deviceFullList[0]) setFilteredList(deviceFullList);
  }, [deviceFullList]);

  useEffect(() => {
    if (filteredList[0])
      setLocOptions([
        {
          caption: "Planta",
          name: "plant",
          values: [...new Set(filteredList.map((device) => device.plant))].sort(
            (a, b) => (a > b ? 1 : -1)
          ),
        },
        {
          caption: "Area",
          name: "area",
          values: [...new Set(filteredList.map((device) => device.area))].sort(
            (a, b) => (a > b ? 1 : -1)
          ),
        },
        {
          caption: "Linea",
          name: "line",
          values: [...new Set(filteredList.map((device) => device.line))].sort(
            (a, b) => (a > b ? 1 : -1)
          ),
        },
      ]);
  }, [filteredList]);

  useEffect(
    () =>
      setFilteredList(
        deviceFullList.filter((device) => {
          let check = true;
          for (let key of Object.keys(filters))
            if (device[key] !== filters[key]) check = false;
          return check;
        })
      ),
    [deviceFullList, filters]
  );

  function setfilter(e) {
    e.preventDefault();
    const { id, value } = e.target;
    const newFilters = { ...filters };
    value ? (newFilters[id] = value) : delete newFilters[id];
    setFilters(newFilters);
  }
  function deleteFilter(e) {
    e.preventDefault();
    const { id } = e.target;
    const newFilters = { ...filters };
    delete newFilters[id];
    setFilters(newFilters);
  }
  function addNewForm(e) {
    e.preventDefault();
    setCreate(!create);
  }

  return (
    <div className="adminOptionSelected">
      <div className="container">
        <div className="row py-2">
          <div className="col col-8">
            <h3>Administración de Equipos</h3>
          </div>
          <div className="col col-4">
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-success"
                onClick={addNewForm}
              >
                Agregar Equipo
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <b>Filtros</b>
          {locOptions.map((field) => (
            <div className="col-sm-4" key={field.name}>
              <div className="input-group mb-1">
                <span
                  className="input-group-text col-3"
                  id="inputGroup-sizing-default"
                >
                  {field.caption}
                </span>
                <select
                  key={filters[field.name]}
                  className="form-select"
                  id={field.name}
                  value={filters[field.name]}
                  onChange={setfilter}
                  aria-label="Default select example"
                >
                  <option value="">{`Sin especificar`}</option>
                  {field.values.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {filters[field.name] && (
                  <button
                    className="btn"
                    style={{ color: "red" }}
                    id={field.name}
                    onClick={deleteFilter}
                  >
                    <i id={field.name} className="fas fa-minus-circle" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <table
            className="table table-striped"
            style={{
              fontSize: "85%",
              maxHeight: "inherit",
              overflowY: "auto",
            }}
          >
            <thead className="fixed-header">
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Planta</th>
                <th scope="col">Area</th>
                <th scope="col">Linea</th>
                <th scope="col">Nombre</th>
                <th scope="col">Tipo</th>
                <th scope="col">Potencia</th>
                <th scope="col">Refrigerante</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((device) => (
                <tr key={device.code}>
                  <th scope="row">
                    <Link to={`/equipos/${device.code}`}>
                      <p style={{ minWidth: "4rem" }}>{device.code}</p>
                    </Link>
                  </th>
                  <td className="col-1">{device.plant}</td>
                  <td>{device.area}</td>
                  <td>{device.line}</td>
                  <td>{device.name}</td>
                  <td>{device.type}</td>
                  <td>
                    {!isNaN(device.power) && device.power >= 9000
                      ? `${Math.floor(device.power / 3000)} tnRef`
                      : `${device.power} frig`}
                  </td>
                  <td>{device.refrigerant}</td>
                  <td>
                    <div className="d-flex">
                      <button
                        className="btn btn-info"
                        title="Modificar"
                        style={{ margin: "0 .2rem" }}
                        disabled
                      >
                        <i className="fas fa-pencil-alt" />
                      </button>
                      <button
                        className="btn btn-danger"
                        title="Desactivar"
                        style={{ margin: "0" }}
                        disabled
                      >
                        <i className="fa fa-minus" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {create && <CreateDevice close={addNewForm} />}
        </div>
      </div>
    </div>
  );
}
