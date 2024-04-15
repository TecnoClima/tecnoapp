import * as xlsx from "xlsx/xlsx.mjs";
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
import { ErrorModal } from "../../components/warnings";
import { getHour, getShortDate } from "../../utils/utils";
import OrdersFilters from "./OrderFilters";

//Método para editar intervención
//Asignar garrafas a personal

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
  const { workOrderList, orderResult, reportData } = useSelector(
    (state) => state.workOrder
  );
  const { userData } = useSelector((state) => state.people);

  const [filteredList, setFilteredList] = useState([]);
  const [filters, setFilters] = useState({});
  const [warning, setWarning] = useState(false);
  const [yearList, setYearList] = useState(year);

  const [page, setPage] = useState({ first: 0, size: 10 });

  const dispatch = useDispatch();

  const [isAdmin] = useState(userData.access === "Admin");

  function handleWarning(e) {
    e.preventDefault();
    setWarning(Number(e.target.id));
  }

  useEffect(() => dispatch(resetDetail()), [dispatch]);

  function handleNewReclaim() {
    dispatch(deviceActions.resetDevice());
    dispatch(setDetail({ class: "Reclamo" }));
  }

  useEffect(() => {
    if (workOrderList.length > 0) return;
    setFilteredList(workOrderList.sort((a, b) => (a.code < b.code ? 1 : -1)));
  }, [workOrderList]);

  function handleReport(e) {
    e.preventDefault();
    const orderIds = filteredList.map((ot) => ot.code);
    dispatch(workOrderActions.getReport(orderIds));
  }

  useEffect(() => {
    if (!reportData) return;
    const { data } = reportData;
    const dateMin = filters.dateMin ? new Date(filters.dateMin) : null;
    const dateMax = filters.dateMax ? new Date(filters.dateMax) : null;
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    data.forEach((row) => {
      let date = row["Fecha Emisión"];
      let jsDate = new Date(date);
      row["Fecha Emisión"] = date
        ? getShortDate(date) + " " + getHour(jsDate)
        : "";
      row["MMM'YY"] = jsDate
        ? `${months[jsDate.getMonth()].toUpperCase()}'${
            jsDate.getFullYear() - 2000
          }`
        : "";
      const interventions = JSON.parse(row?.Interviniente || "false");
      if (!interventions) return row.Interviniente;
      const selectedInterventions = interventions.filter((int) => {
        const date = new Date(int.fecha);
        if (dateMin && dateMax) return date >= dateMin && date <= dateMax;
        if (dateMin) return date >= dateMin;
        if (dateMax) return date <= dateMax;
        return true;
      });
      row.Interviniente = selectedInterventions
        .map(
          (i) =>
            `${new Date(i.fecha).toLocaleDateString()} - (${i.personal}) - ${
              i.tarea
            }`
        )
        .join("\n");
    });
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "CONS_COMPLETA");
    xlsx.writeFile(workbook, "Reporte.xlsx");
  }, [reportData, filters]);

  useEffect(() => {
    if (!yearList || !userData) return;
    const orderOfTheYear = workOrderList.find(
      (ot) => new Date(ot.date).getFullYear() === yearList
    );
    if (!orderOfTheYear) dispatch(workOrderActions.getList(yearList));
  }, [userData, yearList, workOrderList, dispatch]);

  useEffect(() => {
    const date = filters.dateMin || filters.dateMax || null;
    if (!date) return;
    const year = Number(date.split("-")[0]);
    setYearList(year);
  }, [filters]);

  return (
    <div className="container d-flex flex-column px-0">
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
        {userData.access === "Admin" && (
          <div className="col-md-3 d-grid gap-2">
            <button onClick={handleReport} className="btn btn-info ps-0 pe-0">
              <i className="fas fa-table" /> Generar Reporte
            </button>
          </div>
        )}
      </div>

      <OrdersFilters
        {...{ filters, setFilters, setFilteredList, filteredList }}
      />

      {workOrderList ? (
        <div className="wOList">
          <div className="title">Listado de OT</div>
          <Paginate
            length={Math.min(7, filteredList.length)}
            pages={filteredList.length / page.size}
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
      {orderResult.error && (
        <ErrorModal
          message={orderResult.error}
          close={() => dispatch(workOrderActions.resetOrderResult())}
        ></ErrorModal>
      )}
    </div>
  );
}
