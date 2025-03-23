import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deviceActions } from "../../../actions/StoreActions";
import CreateDevice from "./CreateDevice";
import "./index.css";
import DeviceReport from "./DeviceReport";

// servicePoints,active
export default function DeviceAdmin() {
  const { deviceFullList } = useSelector((state) => state.devices);
  const { userData } = useSelector((state) => state.people);
  const [filteredList, setFilteredList] = useState([]);
  const [locOptions, setLocOptions] = useState([]); // Location Options
  const [filters, setFilters] = useState({});
  const [create, setCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(undefined);
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
    e && e.preventDefault();
    edit && setEdit(undefined);
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
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-success w-auto "
                onClick={addNewForm}
              >
                <i className="fas fa-plus me-1" />
                Agregar Equipo
              </button>
              <DeviceReport filters={filters} />
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
                <th scope="col">Cant.Gas</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((device, index) => (
                <tr key={index}>
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
                  <td>{device.gasAmount ? `${device.gasAmount}g` : ""}</td>
                  <td>
                    <div className="d-flex">
                      <button
                        className="btn btn-info"
                        title="Modificar"
                        style={{ margin: "0 .2rem" }}
                        onClick={(e) => {
                          e.preventDefault();
                          setEdit(device);
                          setCreate(true);
                        }}
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
          {create && <CreateDevice edit={edit} close={addNewForm} />}
        </div>
      </div>
    </div>
  );
}
