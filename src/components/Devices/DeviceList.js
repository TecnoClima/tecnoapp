import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions } from "../../actions/StoreActions";
import { Link, useNavigate } from "react-router-dom";
import DeviceFilters from "../filters/DeviceFilters/newFilters";
// import Paginate from "../Paginate";
import { ErrorModal } from "../warnings";
import FrequencyToMany from "./FrequencyToMany";
// import NewPaginate from "../newPaginate";
import Pagination from "../Paginate/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faSnowflake,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBolt,
  faFan,
  faGlobe,
  faStar,
  faTable,
  faTools,
} from "@fortawesome/free-solid-svg-icons";

export default function DeviceList({ close, select }) {
  const { deviceResult, devicePage, deviceOptions } = useSelector(
    (state) => state.devices
  );
  const { userData } = useSelector((state) => state.people);
  const [page, setPage] = useState({ first: 0, size: 30 });
  const [initialFilter, setInitialFilter] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [filters, setFilters] = useState(null);
  const dispatch = useDispatch();

  // get the filters
  useEffect(() => {
    if (JSON.stringify(deviceOptions) === "{}" || !deviceOptions)
      dispatch(deviceActions.allOptions());
  }, [dispatch, deviceOptions]);

  useEffect(() => {
    if (
      !(userData?.plant || userData.access === "Admin") ||
      !deviceOptions?.plant
    )
      return;
    const init = {};
    if (userData?.plant && deviceOptions?.plant) {
      init.plant = deviceOptions?.plant?.find(
        (p) => p.name === userData.plant
      )?._id;
    }
    setInitialFilter(init);
  }, [userData, deviceOptions]);
  useEffect(() => setFilters(initialFilter), [initialFilter]);

  const navigate = useNavigate();

  function handleSelect(e, code) {
    e.preventDefault();
    dispatch(deviceActions.getDetail(code));
    close ? close() : navigate(`./${code}`, { replace: true });
  }

  function handlePagination({ name, value }) {
    const newPage = { ...page, [name]: Number(value) };
    setPage(newPage);
    handleRequest({ ...filters, page: newPage });
  }
  function handleSubmit(filters) {
    handleRequest({ ...filters, page });
  }
  function handleRequest(body) {
    dispatch(deviceActions.getPage(body));
  }
  useEffect(() => {
    if (!initialFilter || initialized) return;
    // esta línea hace que primero envíe el {}
    !devicePage.devices?.[0] && dispatch(deviceActions.getPage(initialFilter));
    setInitialized(true);
  }, [dispatch, devicePage, initialFilter, initialized]);

  function handleClickPage(value) {
    handlePagination({ name: "page", value });
  }

  return (
    <div className="page-container">
      <div className="flex w-full justify-between flex-wrap-reverse">
        <div className="flex items-center w-fit">
          <div className="flex items-center gap-2">
            {filters && (
              <DeviceFilters
                onSubmit={handleSubmit}
                filters={filters}
                setFilters={setFilters}
                initialFilter={initialFilter}
              />
            )}
            <div>
              <span className="font-bold">{devicePage.quantity}</span> Equipos
              Seleccionados
            </div>
          </div>
        </div>

        <div className="ml-auto">
          <FrequencyToMany filters={filters} />
        </div>
      </div>
      {initialized && devicePage.devices?.length === 0 && (
        <div className="flex flex-grow items-center justify-center">
          <div className="alert alert-error font-bold w-fit">
            <i className="fas fa-ban me-2"></i>
            No hubo resultados para tu búsqueda
          </div>
        </div>
      )}
      {devicePage.devices?.length > 0 && (
        <>
          <div className="flex-grow overflow-auto">
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
                </tr>
              </thead>
              <tbody>
                {devicePage?.devices?.map((device, index) => {
                  const age =
                    new Date().getFullYear() -
                    new Date(device.regDate).getFullYear();
                  return (
                    <tr
                      key={index}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => handleSelect(e, device.code)}
                    >
                      <th style={{ minWidth: "5rem" }}>{device.code}</th>
                      <td>{device.name}</td>
                      <td className="text-center">{device.type}</td>
                      <td className="text-center">{device.powerKcal}</td>
                      <td className="text-center">
                        {Math.floor(device.powerKcal / 3000)}
                      </td>
                      <td className="text-center">
                        {device.refrigerant?.refrigerante || ""}
                      </td>
                      <td className="text-center">{device.gasAmount || ""}</td>
                      <td className="text-center">{device.category}</td>
                      <td className="text-center">{device.environment}</td>
                      <td className="text-center">{device.service}</td>
                      <td className="text-center">{age} años</td>
                      <td className="text-center">{device.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="xl:hidden">
              {devicePage?.devices?.map((device, index) => {
                const age =
                  new Date().getFullYear() -
                  new Date(device.regDate).getFullYear();
                return (
                  <Link
                    to={`/equipos/${device.code}`}
                    key={device.code}
                    className="flex flex-col w-full bg-base-content/10 p-2 rounded-md m-1 hover:bg-base-content/15 border-2 border-transparent hover:border-primary"
                    // onClick={(e) => handleSelect(e, device.code)}
                  >
                    <div className="card-title">
                      {device.code} - {device.name}
                    </div>
                    <div className="text-sm flex justify-between max-w-xl">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faFan} />
                        <div>{device.type}</div>
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faBolt} /> {device.powerKcal}{" "}
                        kCal / ({Math.floor(device.powerKcal / 3000)} TR)
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faSnowflake} />
                        <div>{device.refrigerant?.refrigerante || ""}</div>
                        <div>{device.gasAmount || ""}</div>
                      </div>
                    </div>
                    <div className="flex justify-between flex-wrap text-sm">
                      <div className="flex items-center gap-2 w-32 flex-grow">
                        <FontAwesomeIcon icon={faTable} />

                        <div>{device.category}</div>
                      </div>

                      <div className="flex items-center gap-2 w-32 flex-grow">
                        <FontAwesomeIcon icon={faGlobe} />
                        <div>{device.environment}</div>
                      </div>
                      <div className="flex items-center gap-2 w-32 flex-grow">
                        <FontAwesomeIcon icon={faTools} />
                        <div>{device.service}</div>
                      </div>
                      <div className="flex items-center gap-2 w-32 flex-grow">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <div>{age} años</div>
                      </div>
                      <div className="flex items-center gap-2 w-32 flex-grow">
                        <FontAwesomeIcon icon={faStar} />
                        <div>{device.status}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="m-auto">
            {devicePage && (
              <Pagination
                length={devicePage.quantity}
                current={page.page || 1}
                setPage={handleClickPage}
                size={page.size || 10}
                setSize={(value) => handlePagination({ name: "size", value })}
              />
            )}
          </div>
        </>
      )}
      {deviceResult.error && (
        <ErrorModal
          message={deviceResult.error}
          close={() => dispatch(deviceActions.resetResult())}
        ></ErrorModal>
      )}
    </div>
  );
}
