import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions } from "../../../actions/StoreActions";
import { useNavigate } from "react-router-dom";
import DeviceFilters from "../../filters/DeviceFilters/newFilters";
import Paginate from "../../Paginate";
import { ErrorModal } from "../../warnings";

export default function DeviceList({ close, select }) {
  const { deviceResult, devicePage } = useSelector((state) => state.devices);
  const { userData } = useSelector((state) => state.people);
  const [page, setPage] = useState({ first: 0, size: 20 });
  const [filters, setFilters] = useState({});

  const dispatch = useDispatch();
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

  useEffect(() => console.log("page", page), [page]);
  useEffect(
    () => !devicePage.devices?.[0] && dispatch(deviceActions.getPage({})),
    [dispatch, devicePage]
  );

  return (
    <div className="container-fluid h-100 d-flex flex-column">
      <div className="row">
        <div className="col d-flex">
          <b className="me-2">Filtros: </b>
          <DeviceFilters
            onSubmit={handleSubmit}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </div>
      <div className="row" style={{ height: "70vh", overflowY: "auto" }}>
        <div className="col">
          <table className="table table-hover" style={{ fontSize: "80%" }}>
            <thead>
              <tr>
                <th scope="col">Codigo Eq.</th>
                <th scope="col">Nombre</th>
                <th scope="col" className="text-center">
                  Tipo
                </th>
                <th scope="col" className="text-center">
                  Potencia [kCal]
                </th>
                <th scope="col" className="text-center">
                  Potencia [TR]
                </th>
                <th scope="col" className="text-center">
                  Refrigerante
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
      </div>
      <div className="row m-auto">
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
      {deviceResult.error && (
        <ErrorModal
          message={deviceResult.error}
          close={() => dispatch(deviceActions.resetResult())}
        ></ErrorModal>
      )}
    </div>
  );
}
