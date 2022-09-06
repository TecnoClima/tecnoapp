import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteOrder,
  resetDetail,
  setDetail,
} from "../../actions/workOrderActions";
import Paginate from "../../components/Paginate";
import WarningErrors from "../../components/warnings/WarningErrors";
import {
  deviceActions,
  planActions,
  workOrderActions,
} from "../../actions/StoreActions";
import "./index.css";

//Método para editar intervención
//Asignar garrafas a personal

function FormInput({
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
}) {
  return (
    <div
      className={`input-group required mb-1 ${
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
          onChange={select}
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
          min={min || "0"}
          max={max || Infinity}
          onChange={select}
          placeholder={placeholder}
          aria-describedby="inputGroup-sizing-default"
        />
      )}
    </div>
  );
}

function applyFilters(element, filters) {
  let check = true;
  for (let key of Object.keys(filters)) {
    if (key === "dateMin") {
      if (new Date(element.date) < new Date(filters[key])) check = false;
    } else if (key === "dateMax") {
      if (new Date(element.date) > new Date(filters[key])) check = false;
    } else if (key === "class" && filters.key === "No-Reclamo") {
      if (element.key === "Reclamo") check = false;
    } else if (["servicePoint", "supervisor", "solicitor"].includes(key)) {
      if (
        !element[key] ||
        !element[key].toLowerCase().includes(filters[key].toLowerCase())
      )
        check = false;
    } else {
      if (!element[key] || element[key] !== filters[key]) check = false;
    }
  }
  return check;
}

export const FormSelector = ({
  label,
  item,
  array,
  values,
  captions,
  select,
  defaultValue,
  value,
  result,
}) => {
  return (
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
                {values ? item.caption : item}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};

export default function WorkOrders() {
  const { year } = useSelector((state) => state.data);
  const { workOrderList } = useSelector((state) => state.workOrder);
  const { userData } = useSelector((state) => state.people);
  const today = new Date();

  const [filteredList, setFilteredList] = useState([]);
  const [code, setCode] = useState("");
  const [filters, setFilters] = useState({});
  const [warning, setWarning] = useState(false);
  const [device, setDevice] = useState({});

  const [page, setPage] = useState({ first: 0, size: 10 });

  const dispatch = useDispatch();

  const [isAdmin] = useState(userData.access === "Admin");

  function handleWarning(e) {
    e.preventDefault();
    setWarning(Number(e.target.id));
  }

  useEffect(() => dispatch(resetDetail()), [dispatch]);

  function selectFilter(e) {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  }
  function clickStatus(e) {
    e.preventDefault();
    const newFilters = { ...filters };
    const { id } = e.target;
    id === "all" ? delete newFilters.status : (newFilters.status = id);
    // setFilteredList(newFilters.status ?
    //   workOrderList.filter(order=>order.status === newFilters.status)
    //   :workOrderList)
    setFilteredList(
      workOrderList
        .filter((order) => applyFilters(order, newFilters))
        .sort((a, b) => (a.code < b.code ? 1 : -1))
    );
    setFilters(newFilters);
  }

  function clickClass(e) {
    e.preventDefault();
    const newFilters = { ...filters };
    const { id } = e.target;
    id === "all" ? delete newFilters.class : (newFilters.class = id);
    setFilteredList(
      workOrderList
        .filter((order) => applyFilters(order, newFilters))
        .sort((a, b) => (a.code < b.code ? 1 : -1))
    );
    setFilters(newFilters);
  }

  function searchByCode(e) {
    e.preventDefault();
    setFilteredList(workOrderList.filter((order) => order.code === code));
  }
  function searchByDevice(e) {
    e.preventDefault();
    setFilteredList(
      workOrderList.filter(
        (order) =>
          order.devCode === device ||
          order.devName.toLowerCase().includes(device.toLowerCase())
      )
    );
  }

  function clickDate(e) {
    e.preventDefault();
    const { value } = e.target;
    const today = new Date();
    let dateMin = `${today.getFullYear() - (value === "lastYear" ? 1 : 0)}-${
      value === "month"
        ? (today.getMonth() < 9 ? "0" : "") + (today.getMonth() + 1)
        : "01"
    }-01`;
    let lastDate = new Date(
      today.getFullYear() - (value === "lastYear" ? 1 : 0),
      value === "month" ? today.getMonth() + 1 : 12,
      0
    );
    let dateMax = `${lastDate.getFullYear()}-${
      (lastDate.getMonth() < 9 ? "0" : "") + (lastDate.getMonth() + 1)
    }-${lastDate.getDate()}`;
    if (
      !workOrderList.filter(
        (order) => new Date(order.date).getFullYear === lastDate.getFullYear()
      )[0]
    )
      dispatch(
        workOrderActions.getList(userData.plant, lastDate.getFullYear())
      );
    setFilters({ ...filters, dateMin, dateMax });
  }
  function filterList(e) {
    e.preventDefault();
    setFilteredList(
      workOrderList
        .filter((order) => applyFilters(order, filters))
        .sort((a, b) => (a.code < b.code ? 1 : -1))
    );
  }

  function resetFilters(e) {
    e.preventDefault();
    setFilters({});
    setFilteredList(workOrderList);
  }
  function handleNewReclaim() {
    dispatch(deviceActions.resetDevice());
    dispatch(setDetail({ class: "Reclamo" }));
  }

  useEffect(
    () =>
      userData &&
      dispatch &&
      year &&
      dispatch(workOrderActions.getList(userData.plant, year)),
    [dispatch, userData, year]
  );

  useEffect(
    () =>
      setFilteredList(workOrderList.sort((a, b) => (a.code < b.code ? 1 : -1))),
    [workOrderList]
  );

  return (
    <div className="container">
      <div className="row d-flex justify-content-end mt-2 mb-2">
        <div className="col-md-3 d-grid gap-2">
          <Link
            to="/ots/new"
            onClick={() => dispatch(deviceActions.resetDevice())}
            className="btn btn-success ps-0 pe-0"
          >
            <i className="fas fa-toolbox" /> Nueva Orden
          </Link>
        </div>
        <div className="col-md-3 d-grid gap-2">
          <Link
            to="/ots/new"
            onClick={handleNewReclaim}
            className="btn btn-warning ps-0 pe-0"
          >
            <i className="fas fa-bell" /> Nuevo Reclamo
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3">
          <form className="d-flex" onSubmit={searchByCode}>
            <FormInput
              label="N° OT"
              type="number"
              item="code"
              select={(e) => setCode(Number(e.target.value))}
            />
            <div className="col">
              <button className="btn btn-info" type="submit">
                <i className="fas fa-search" />
              </button>
            </div>
          </form>
        </div>
        <div className="col-lg-3">
          <form className="d-flex" onSubmit={searchByDevice}>
            <FormInput
              label="Equipo"
              item="device"
              placeholder="código o parte del nombre"
              select={(e) => setDevice(e.target.value)}
            />
            <div className="col">
              <button className="btn btn-info" type="submit">
                <i className="fas fa-search" />
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-auto">
          <div className="input-group w-100" style={{ zIndex: "none" }}>
            <span
              className="input-group-text p-1 mr-1 my-1"
              style={{ minWidth: "4rem" }}
              id="inputGroup-sizing-default"
            >
              Estado
            </span>
            <button
              className={`btn p-1 my-1 ${
                filters.status === "Abierta" ? "btn-primary" : "btn-info"
              }`}
              id={"Abierta"}
              style={{ zIndex: "inherit" }}
              onClick={clickStatus}
            >
              Pendientes
            </button>
            <button
              className={`btn p-1 my-1 ${
                filters.status === "Cerrada" ? "btn-primary" : "btn-info"
              }`}
              id={"Cerrada"}
              style={{ zIndex: "inherit" }}
              onClick={clickStatus}
            >
              Cerradas
            </button>
            <button
              className={`btn p-1 my-1 ${
                !filters.status ? "btn-primary" : "btn-info"
              }`}
              id={"all"}
              style={{ zIndex: "inherit" }}
              onClick={clickStatus}
            >
              Todas
            </button>
          </div>
        </div>
        <div className="col-md-auto mb-1">
          <div className="input-group" style={{ zIndex: "none" }}>
            <span
              className="input-group-text p-1 mr-1 my-1"
              style={{ minWidth: "4rem" }}
              id="inputGroup-sizing-default"
            >
              Clase
            </span>
            <button
              className={`btn p-1 my-1 ${
                filters.class === "Reclamo" ? "btn-primary" : "btn-info"
              }`}
              id={"Reclamo"}
              style={{ zIndex: "inherit" }}
              onClick={clickClass}
            >
              Reclamos
            </button>
            <button
              className={`btn p-1 my-1 ${
                filters.class === "No-Reclamo" ? "btn-primary" : "btn-info"
              }`}
              id={"No-reclamo"}
              style={{ zIndex: "inherit" }}
              onClick={clickClass}
            >
              No-Reclamos
            </button>
            <button
              className={`btn p-1 my-1 ${
                !filters.class ? "btn-primary" : "btn-info"
              }`}
              id={"all"}
              style={{ zIndex: "inherit" }}
              onClick={clickClass}
            >
              Todas
            </button>
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
            Filtros
          </button>
          <div
            id="collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-0">
              <form
                className="container-fluid bg-light m-0"
                onSubmit={filterList}
              >
                <div className="row">
                  <div className="col-md-4">
                    <b>Por fechas</b>
                    <FormInput
                      label="Desde"
                      item="dateMin"
                      type="date"
                      select={selectFilter}
                      defaultValue={filters.dateMin}
                    />
                    <FormInput
                      label="Hasta"
                      item="dateMax"
                      type="date"
                      select={selectFilter}
                      defaultValue={filters.dateMax}
                    />
                    {filters.dateMax < filters.dateMin && (
                      <div className="alert alert-danger" role="alert">
                        {"La fecha Hasta debe ser mayor que la fecha Desde"}
                      </div>
                    )}
                    <button
                      className="btn btn-sm btn-info m-1 mt-0"
                      value="month"
                      onClick={clickDate}
                    >
                      {(today.getMonth() < 9 ? "0" : "") +
                        (today.getMonth() + 1)}
                      /{today.getFullYear()}
                    </button>
                    <button
                      className="btn btn-sm btn-info m-1 mt-0"
                      value="year"
                      onClick={clickDate}
                    >
                      {today.getFullYear()}
                    </button>
                    <button
                      className="btn btn-sm btn-info m-1 mt-0"
                      value="lastYear"
                      onClick={clickDate}
                    >
                      {today.getFullYear() - 1}
                    </button>
                  </div>
                  <div className="col-sm-4">
                    <b>Ubicación</b>
                    <FormSelector
                      label="Planta"
                      item="plant"
                      array={[
                        ...new Set(filteredList.map((order) => order.plant)),
                      ].sort((a, b) => (a > b ? 1 : -1))}
                      type="date"
                      select={selectFilter}
                    />
                    <FormSelector
                      label="Area"
                      item="area"
                      array={[
                        ...new Set(filteredList.map((order) => order.area)),
                      ].sort((a, b) => (a > b ? 1 : -1))}
                      type="date"
                      select={selectFilter}
                    />
                    <FormSelector
                      label="Linea"
                      item="line"
                      array={[
                        ...new Set(filteredList.map((order) => order.line)),
                      ].sort((a, b) => (a > b ? 1 : -1))}
                      type="date"
                      select={selectFilter}
                    />
                    <FormInput
                      label="L.Servicio"
                      item="servicePoint"
                      select={selectFilter}
                    />
                  </div>
                  <div className="col-sm-4">
                    <b>Por personas</b>
                    <FormInput
                      label="Supervisor"
                      item="supervisor"
                      placeholder="nombre exacto o parte"
                      select={selectFilter}
                    />
                    <FormInput
                      label="Solicitante"
                      item="solicitor"
                      placeholder="nombre exacto o parte"
                      select={selectFilter}
                    />
                  </div>
                </div>
                <div className="row is-flex justify-content-lg-center">
                  <div className="col-md-2 d-grid gap-2">
                    <button className="btn btn-success" type="submit">
                      Aplicar Filtros
                    </button>
                  </div>
                  <div className="col-md-2 d-grid gap-2">
                    <button className="btn btn-danger" onClick={resetFilters}>
                      Quitar Filtros
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {workOrderList ? (
        <div className="wOList">
          <div className="title">Listado de OT</div>
          <Paginate
            length={Math.min(7, workOrderList.length)}
            pages={workOrderList.length / page.size}
            select={(pg) => {
              setPage({ ...page, first: page.size * pg });
            }}
            size={(value) => setPage({ ...page, size: value })}
          />
          <table className="table table-striped miniTable">
            <thead>
              <tr>
                <th scope="col">OT N°</th>
                <th scope="col">Clase</th>
                <th scope="col">Equipo</th>
                <th scope="col">Linea</th>
                <th scope="col">Solicitada</th>
                <th scope="col">Supervisor</th>
                <th scope="col">Descripción</th>
                <th scope="col">Cierre</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredList
                .slice(page.first, page.first + page.size)
                .map((order) => (
                  <tr key={order.code}>
                    <th scope="row">{order.code}</th>
                    <td>{order.class}</td>
                    <td>
                      <b>{`[${order.devCode}]`}</b> <div>{order.devName}</div>
                    </td>
                    <td>{order.line}</td>
                    <td>
                      <div>{new Date(order.date).toLocaleDateString()}</div>
                      <div>{order.solicitor}</div>
                    </td>
                    <td>{order.supervisor}</td>
                    <td>{order.description}</td>
                    <td>
                      {order.close
                        ? new Date(order.close).toLocaleDateString()
                        : "Pendiente"}
                    </td>
                    <td>
                      <div className="d-flex">
                        <Link
                          className="btn btn-info"
                          title="Detalle"
                          to={`/ots/detail/${order.code}`}
                          onClick={() => dispatch(planActions.selectTask({}))}
                        >
                          <i className="fas fa-search-plus" />
                        </Link>
                        {isAdmin && (
                          <button
                            className="btn btn-danger"
                            title="Eliminar"
                            id={order.code}
                            onClick={handleWarning}
                          >
                            <i className="fas fa-trash-alt" id={order.code} />
                          </button>
                        )}
                      </div>
                      {warning && (
                        <WarningErrors
                          warnings={[
                            `¿Desea eliminar la OT ${order.code}, con todas las intervenciones asociadas y los consumos de gas?`,
                          ]}
                          proceed={() => dispatch(deleteOrder(warning))}
                          close={() => setWarning(false)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="waiting" />
      )}
    </div>
  );
}
