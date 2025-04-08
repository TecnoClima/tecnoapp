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
import { ErrorModal, SuccessModal } from "../../components/warnings";
import { getHour, getShortDate } from "../../utils/utils";
import OrdersFilters from "./OrderFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faChevronRight,
  faPlus,
  faTable,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import TextInput from "../../components/forms/FormFields";
import Pagination from "../../components/Paginate/Pagination";
import ClassBadge from "../../components/Badges/ClassBadge";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  function handleSelectPage(e) {
    e.preventDefault();
    setCurrentPage(Number(e.target.value));
  }

  const dispatch = useDispatch();

  const [isAdmin] = useState(userData.access === "Admin");

  function handleWarning(e) {
    e.stopPropagation();
    e.preventDefault();
    setWarning(Number(e.currentTarget.id));
  }

  useEffect(() => dispatch(resetDetail()), [dispatch]);
  useEffect(() => {
    dispatch(workOrderActions.resetOrderResult());
  }, [dispatch]);

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
    return () => {
      dispatch(workOrderActions.resetReport());
    };
  }, [dispatch]);

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

  useEffect(() => {
    console.log(workOrderList);
  }, [workOrderList]);

  return (
    <>
      {warning && (
        <WarningErrors
          warnings={[
            `¿Desea eliminar la OT ${warning}, con todas las intervenciones asociadas y los consumos de gas?`,
          ]}
          proceed={() => dispatch(deleteOrder(warning))}
          close={() => setWarning(false)}
        />
      )}

      <ErrorModal
        message={orderResult.error}
        open={orderResult.error}
        close={() => dispatch(workOrderActions.resetOrderResult())}
      />

      <SuccessModal
        message={orderResult.success}
        open={orderResult.success}
        close={() => dispatch(workOrderActions.resetOrderResult())}
      />
      <div className="page-container">
        <div className="flex w-full justify-between items-center flex-wrap">
          <div className="page-title">Listado de Órdenes de trabajo</div>
          <div className="flex gap-2 flex-wrap mb-4">
            <Link
              to="/ots/new"
              onClick={() => dispatch(deviceActions.resetDevice())}
              className="btn btn-sm btn-success flex-grow"
            >
              <FontAwesomeIcon icon={faToolbox} />
              <span>Nueva Orden</span>
            </Link>
            <Link
              to="/ots/new"
              onClick={handleNewReclaim}
              className="btn btn-sm btn-warning flex-grow"
            >
              <FontAwesomeIcon icon={faBell} />
              Nuevo Reclamo
            </Link>
            {userData.access === "Admin" && (
              <button
                onClick={handleReport}
                className="btn btn-sm btn-info flex-grow"
              >
                <FontAwesomeIcon icon={faTable} />
                Generar Reporte
              </button>
            )}
          </div>
        </div>

        <OrdersFilters
          {...{ filters, setFilters, setFilteredList, filteredList }}
        />

        {workOrderList ? (
          <div className="mt-2">
            <div className="flex justify-center">
              <Pagination
                length={filteredList.length}
                current={currentPage}
                select={handleSelectPage}
                size={size}
              />
            </div>
            <div className="flex flex-col gap-2 py-4">
              <div className="hidden xl:flex w-full flex-grow flex-row p-1 font-bold text-sm">
                <div className="w-20 font-bold">Código</div>
                <div className="w-80 flex-grow ">Clase/equipo </div>
                <div className="w-60 flex-grow">Solicitante/Supervisor</div>
                <div className="w-60 flex-grow">Descripción</div>
                {isAdmin && <div className="w-11">Eliminar</div>}
              </div>
              {filteredList
                .slice((currentPage - 1) * size, currentPage * size)
                .map((order) => (
                  <div
                    key={order.code}
                    className="flex w-full items-center gap-2"
                  >
                    <Link
                      title="Detalle"
                      to={`/ots/detail/${order.code}`}
                      onClick={() => dispatch(planActions.selectTask({}))}
                      className="card rounded-lg sm:rounded-box bg-base-content/10 overflow-x-auto flex flex-wrap flex-grow text-sm flex-row border-2 border-transparent hover:border-base-content/20"
                    >
                      <div className="flex items-center bg-neutral/75 text-base-content w-full sm:w-20 sm:px-2 font-bold">
                        <p className="mx-auto">{order.code}</p>
                      </div>
                      <div className="pt-1 w-80 flex-grow ">
                        <ClassBadge cls={order.class} />
                        <div className="flex gap-3 py-1 px-2">
                          <p>
                            <b>{`[${order.devCode}]`}</b>{" "}
                            <span>{order.devName}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-xs px-2 bg-neutral/50 py-1">
                          <span>{order.plant} </span>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="h-3"
                          />
                          <b> {order.area}</b>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="h-3"
                          />
                          <b> {order.line}</b>
                        </div>
                      </div>
                      <div className="p-1 text-sm w-60 flex-grow">
                        <div className="text-xs bg-neutral/50 px-1 ">
                          Solicitó
                        </div>
                        <div className="px-1">
                          {`${new Date(order.date).toLocaleDateString()} - 
                      ${order.solicitor}`}
                        </div>
                        <div className="text-xs bg-neutral/50 px-1 ">
                          Supervisa:
                        </div>
                        <div className="px-1">{order.supervisor}</div>
                      </div>
                      <div className="p-1 text-sm w-60 flex-grow">
                        <div>{order.description}</div>
                      </div>
                    </Link>
                    {isAdmin && (
                      <button
                        className="relative btn btn-error btn-sm mb-auto -ml-12 sm:mb-0 sm:ml-0"
                        title="Eliminar"
                        id={order.code}
                        onClick={handleWarning}
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="waiting" />
        )}
      </div>
    </>
  );
}
