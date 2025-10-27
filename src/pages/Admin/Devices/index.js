import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deviceActions } from "../../../actions/StoreActions";
import CreateDevice from "./CreateDevice";
import DeviceReport from "./DeviceReport";
import { FormSelector } from "../../../components/forms/FormInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faEye,
  faSnowflake,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBolt,
  faFan,
  faGlobe,
  faStar,
  faTable,
  faTools,
  faEdit,
  faTrashAlt,
  faBackspace,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../../components/Paginate/Pagination";

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
  const [nameFilter, setNameFilter] = useState("");
  const dispatch = useDispatch();
  const [page, setPage] = useState({ first: 0, size: 30 });

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
          // Filtro por nombre
          if (
            nameFilter &&
            !device.name.toLowerCase().includes(nameFilter.toLowerCase())
          )
            check = false;
          return check;
        })
      ),
    [deviceFullList, filters, nameFilter]
  );

  function setfilter(e) {
    e.preventDefault();
    const { name, value } = e.target;
    const newFilters = { ...filters };
    value && value !== "Seleccione"
      ? (newFilters[name] = value)
      : delete newFilters[name];
    setFilters(newFilters);
  }
  function deleteFilter(e) {
    e.preventDefault();
    const { value } = e.currentTarget;
    const newFilters = { ...filters };
    delete newFilters[value];
    setFilters(newFilters);
  }
  function addNewForm(e) {
    e && e.preventDefault();
    edit && setEdit(undefined);
    setCreate(!create);
  }

  // Calcular la lista paginada
  const paginatedList = filteredList.slice(page.first, page.first + page.size);

  return (
    <div className="page-container">
      <div className="flex justify-between items-center flex-wrap">
        <div className="page-title">Administración de Equipos</div>
        <div className=" flex gap-2 mb-2">
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={addNewForm}
          >
            <FontAwesomeIcon icon={faPlus} />
            Agregar Equipo
          </button>
          <DeviceReport filters={filters} />
        </div>
      </div>
      {/* Filtros modernos */}
      <div className="flex gap-x-4 md:gap-y-2 items-center flex-wrap mb-3">
        {locOptions.map((field) => (
          <div
            key={field.name}
            className="flex w-60 gap-1 flex-grow items-center"
          >
            <FormSelector
              className="join-item"
              label={field.caption}
              name={field.name}
              options={field.values}
              value={filters[field.name] || ""}
              onSelect={setfilter}
            />
            <button
              value={field.name}
              title="Eliminar Filtro"
              className={`btn btn-outline btn-error btn-xs border ${
                filters[field.name] ? "opacity-100" : "opacity-0"
              }`}
              onClick={deleteFilter}
              disabled={!filters[field.name]}
            >
              <FontAwesomeIcon icon={faBackspace} />
            </button>
          </div>
        ))}
        <input
          type="text"
          className="input input-bordered w-60 input-sm flex-grow"
          placeholder="Buscar por nombre..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>
      <div className="flex-grow overflow-auto w-full">
        {/* Tabla desktop */}
        <table
          className="hidden xl:table no-padding"
          style={{ fontSize: "80%" }}
        >
          <thead>
            <tr>
              <th scope="col">Codigo Eq.</th>
              <th scope="col">Nombre</th>
              <th scope="col" className="text-center">
                Tipo
              </th>
              <th scope="col" className="text-center">
                Potencia
                <br />
                [kCal]
              </th>
              <th scope="col" className="text-center">
                Potencia
                <br />
                [TR]
              </th>
              <th scope="col" className="text-center">
                Gas
              </th>
              <th scope="col" className="text-center">
                Cant.gas
                <br />
                (g)
              </th>
              <th scope="col" className="text-center">
                Categoría
              </th>
              <th scope="col" className="text-center">
                Ambiente
              </th>
              <th scope="col" className="text-center">
                Servicio
              </th>
              <th scope="col" className="text-center">
                Antigüedad
              </th>
              <th scope="col" className="text-center">
                Estado
              </th>
              <th scope="col" className="text-center">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.map((device, index) => {
              const age = device.regDate
                ? new Date().getFullYear() -
                  new Date(device.regDate).getFullYear()
                : "-";
              return (
                <tr key={index}>
                  <th style={{ minWidth: "5rem" }}>{device.code}</th>
                  <td>{device.name}</td>
                  <td className="text-center">{device.type}</td>
                  <td className="text-center">
                    {device.powerKcal || device.power}
                  </td>
                  <td className="text-center">
                    {device.powerKcal
                      ? Math.floor(device.powerKcal / 3000)
                      : device.power
                      ? Math.floor(device.power / 3000)
                      : "-"}
                  </td>
                  <td className="text-center">
                    {device.refrigerant?.refrigerante ||
                      device.refrigerant ||
                      ""}
                  </td>
                  <td className="text-center">{device.gasAmount || ""}</td>
                  <td className="text-center">{device.category}</td>
                  <td className="text-center">{device.environment}</td>
                  <td className="text-center">{device.service}</td>
                  <td className="text-center">{age} años</td>
                  <td className="text-center">{device.status}</td>
                  <td className="text-center flex gap-2 justify-center">
                    <button
                      className="btn btn-xs btn-info"
                      onClick={() => setEdit(device)}
                      title="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="hidden btn btn-xs btn-error"
                      onClick={() => {
                        /* lógica eliminar */
                      }}
                      title="Eliminar"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Mobile cards */}
        <div className="xl:hidden flex flex-col gap-1">
          {paginatedList.map((device, index) => {
            const age = device.regDate
              ? new Date().getFullYear() -
                new Date(device.regDate).getFullYear()
              : "-";
            return (
              <div
                key={device.code}
                className="flex flex-col w-full bg-base-content/10 p-2 rounded-md hover:bg-base-content/15"
              >
                <div className="flex justify-between">
                  <div className="card-title">
                    {device.code} - {device.name}
                  </div>
                  <div className="flex gap-1">
                    <Link
                      title="Ver Equipo"
                      className="btn btn-xs btn-info"
                      to={`/equipos/${device.code}`}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <button
                      className="btn btn-xs btn-ghost"
                      onClick={() => setEdit(device)}
                      title="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="hidden btn btn-xs btn-error"
                      onClick={() => {
                        /* lógica eliminar */
                      }}
                      title="Eliminar"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </div>
                <div className="flex text-sm flex-wrap text-base-content/75">
                  <div className="device-info-item">
                    <FontAwesomeIcon icon={faFan} />
                    <div>{device.type}</div>
                  </div>
                  <div className="device-info-item">
                    <FontAwesomeIcon icon={faBolt} />{" "}
                    {device.powerKcal || device.power} kCal / (
                    {device.powerKcal
                      ? Math.floor(device.powerKcal / 3000)
                      : device.power
                      ? Math.floor(device.power / 3000)
                      : "-"}{" "}
                    TR)
                  </div>
                  <div className="device-info-item">
                    <FontAwesomeIcon icon={faSnowflake} />
                    <div>
                      {device.refrigerant?.refrigerante ||
                        device.refrigerant ||
                        ""}
                    </div>
                    <div>{device.gasAmount || ""}</div>
                  </div>
                  <div className="device-info-item">
                    <FontAwesomeIcon icon={faTable} />
                    <div>{device.category}</div>
                  </div>
                  <div className="device-info-item">
                    <FontAwesomeIcon icon={faGlobe} />
                    <div>{device.environment}</div>
                  </div>
                  <div className="device-info-item">
                    <FontAwesomeIcon icon={faTools} />
                    <div>{device.service}</div>
                  </div>
                  <div className="device-info-item">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <div>{`${age} año${age > 1 ? "s" : ""}`}</div>
                  </div>
                  <div className="device-info-item">
                    <FontAwesomeIcon icon={faStar} />
                    <div>{device.status}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {create && <CreateDevice close={addNewForm} />}
      {edit && <CreateDevice edit={edit} close={() => setEdit(null)} />}

      {/* Paginación */}
      <div className="flex justify-center pt-2">
        <Pagination
          length={filteredList.length}
          current={Math.floor(page.first / page.size) + 1}
          size={page.size}
          setPage={(value) =>
            setPage({ ...page, first: (Number(value) - 1) * page.size })
          }
          setSize={(value) =>
            setPage({ ...page, size: Number(value), first: 0 })
          }
        />
      </div>
    </div>
  );
}
