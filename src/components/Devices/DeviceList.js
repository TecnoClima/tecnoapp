import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions } from "../../actions/StoreActions";
import { useNavigate } from "react-router-dom";
import DeviceFilters from "../filters/DeviceFilters/newFilters";
import Paginate from "../Paginate";
import { ErrorModal } from "../warnings";
import FrequencyToMany from "./FrequencyToMany";
import NewPaginate from "../newPaginate";
import Pagination from "../Paginate/Pagination";

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

  // useEffect(() => console.log("devicePage", devicePage), [devicePage]);
  // useEffect(() => console.log({ initialFilter }), [initialFilter]);
  useEffect(() => {
    if (!initialFilter || initialized) return;
    // esta línea hace que primero envíe el {}
    !devicePage.devices?.[0] && dispatch(deviceActions.getPage(initialFilter));
    setInitialized(true);
  }, [dispatch, devicePage, initialFilter, initialized]);

  return (
    <div className="page-container">
      <div className="flex w-full justify-between">
        <div className="flex items-center w-fit">
          {filters && (
            <DeviceFilters
              onSubmit={handleSubmit}
              filters={filters}
              setFilters={setFilters}
              initialFilter={initialFilter}
            />
          )}
          <div className="px-2">
            <span className="font-bold">{devicePage.quantity}</span> Equipos
            Seleccionados
          </div>
        </div>
        <FrequencyToMany filters={filters} />
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
            <table className="table no-padding" style={{ fontSize: "80%" }}>
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
          </div>

          <div className="m-auto">
            {devicePage && (
              <Pagination
                length={devicePage.pages * devicePage.size}
                current={page.page || 1}
                select={(value) => handlePagination({ name: "page", value })}
                size={page.size || 10}
              />
            )}
            <Paginate
              pages={devicePage.pages || 1}
              length={page.size || 10}
              min="5"
              step="5"
              defaultValue={page.size}
              select={(value) => handlePagination({ name: "page", value })}
              size={(value) => handlePagination({ name: "size", value })}
            />
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
