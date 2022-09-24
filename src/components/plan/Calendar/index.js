import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { planActions } from "../../../actions/StoreActions.js";
import {
  CalendarFilter,
  CalendarLocFilter,
  CalendarPeopleFilter,
} from "../../filters/CalendarFilter/index.js";
import NewPaginate from "../../newPaginate/index.js";
import CalendarPicker from "../../pickers/CalendarPicker/index.js";
import "./index.css";

export function ProgramFilter(props) {
  const [program, setProgram] = useState("");
  const { programList } = useSelector((state) => state.plan);
  const { selectedPlant } = useSelector((state) => state.plants);
  const [requested, setRequested] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (requested) return;
    if (!programList[0]) dispatch(planActions.getStrategies());
    setRequested(true);
  }, [requested, programList, dispatch]);

  function handleChange(e) {
    const { value } = e.target;
    props.select && props.select({ strategy: value });
    setProgram(value);
  }

  return (
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text" id="inputGroup-sizing-default">
          Programa
        </span>
      </div>
      <select
        name="supervisor"
        value={program}
        onChange={handleChange}
        className="form-control"
      >
        <option value="">Todos</option>
        {programList
          .filter((p) =>
            selectedPlant ? p.plant === selectedPlant.name : true
          )
          .map((p, i) => (
            <option key={i} value={p.name}>
              {p.name}
            </option>
          ))}
      </select>
    </div>
  );
}

export default function PlanCalendar(props) {
  const { calendar } = useSelector((state) => state.plan);
  const plant = useSelector((state) => state.plants.selectedPlant);
  const { lineList } = useSelector((state) => state.plants);
  const { year } = useSelector((state) => state.data);
  const [filtersOn, setFiltersOn] = useState(false);
  const [filters, setFilters] = useState({
    from: year + "-01-01",
    to: year + "-12-31",
    program: "",
    supervisor: "",
    worker: "",
    area: "",
    line: "",
    device: "",
  });
  // const [page, setPage]=useState({first: 0, size:15})
  const [paginate, setPaginate] = useState({ first: 0, last: 15 });
  const [filteredList, setFilteredList] = useState([]);
  const [dates, setDates] = useState([]);
  const [order, setOrder] = useState({ alpha: 1, date: 1 });
  const dispatch = useDispatch();
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  function select(json) {
    setFilters({ ...filters, ...json });
  }

  //trabajar directamente con la lista de equipos
  useEffect(
    () =>
      year &&
      plant &&
      dispatch(planActions.getDates({ year, plant: plant.name })),
    [year, plant, dispatch]
  );

  //getAllWeeks
  useEffect(() => {
    let newMonday = undefined;
    let number = 1;
    while (newMonday === undefined) {
      const date = new Date(`${year}/01/${number}`);
      if (date.getDay() === 1) newMonday = date;
      number++;
    }
    let mondays = [];
    while (newMonday.getFullYear() === year) {
      mondays.push(new Date(newMonday));
      newMonday.setDate(newMonday.getDate() + 7);
    }
    setDates(mondays);
  }, [year]);

  function sortByFirstDate(e) {
    e.preventDefault();
    const newList = [...filteredList];
    setFilteredList(
      newList.sort((a, b) =>
        new Date(a.dates[0] ? a.dates[0].date : `${year - 1}/12/05`) >
        new Date(b.dates[0] ? b.dates[0].date : `${year - 1}/12/05`)
          ? order.date
          : -order.date
      )
    );
    setOrder({ ...order, date: order.date * -1 });
  }
  function sortByDevice(e) {
    e.preventDefault();
    const newList = [...filteredList];
    setFilteredList(
      newList.sort((a, b) =>
        a.device.name > b.device.name ? order.alpha : -order.alpha
      )
    );
    setOrder({ ...order, alpha: order.alpha * -1 });
  }

  useEffect(() => {
    if (!calendar[0]) return;
    setFilteredList(
      calendar.filter((task) => {
        let check = true;
        const { from, to, area, line, device, supervisor, strategy, worker } =
          filters;
        const values = {
          supervisor,
          strategy,
        };
        if (task.dates && task.dates[0]) {
          check = false;
          for (let item of task.dates) {
            if (
              new Date(item.date) > new Date(from) &&
              new Date(item.date) < new Date(to)
            )
              check = true;
          }
        }
        if (line && task.device.line !== line) check = false;
        if (
          area &&
          !lineList
            .filter((l) => l.area === area)
            .map((l) => l._id)
            .includes(task.device.line)
        )
          check = false;
        if (worker && task.responsible.name !== worker) check = false;
        if (device)
          if (!task.device.name.toLowerCase().includes(device.toLowerCase()))
            check = false;
        for (let key of Object.keys(values))
          if (values[key] && values[key] !== task[key]) check = false;
        return check;
      })
    );
  }, [filters, calendar, lineList]);

  return (
    <>
      <div className="container-fluid bg-light pt-1 d-flex h-full flex-column">
        {plant.name && year ? (
          <div>
            <div className="row">
              <div className="col flex">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFiltersOn(!filtersOn);
                  }}
                  className="btn btn-info py-0"
                >
                  Filtros
                </button>
                {filtersOn && (
                  <div
                    className={filtersOn ? "row" : "hidden h-0"}
                    style={{ transition: "height .5s" }}
                  >
                    <div className="col-lg-3">
                      <CalendarFilter select={select} />
                    </div>
                    <div className="col-lg-auto flex-grow-1">
                      <ProgramFilter select={select} />
                      <CalendarPeopleFilter select={select} />
                    </div>
                    <div className="col-lg-auto m-0 flex-grow-1">
                      <CalendarLocFilter select={select} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <label className="longLabel">Debe seleccionar Planta y Año</label>
          </div>
        )}
        <div className="row" style={{ height: "70vh", overflowY: "auto" }}>
          <div className="col">
            <table className="table">
              <thead className="text-center p-0" style={{ fontSize: "75%" }}>
                <tr>
                  <th rowSpan="2" className="p-0">
                    <button
                      className="btn btn-outline-secondary m-1 py-0"
                      onClick={sortByDevice}
                      style={{ fontSize: "100%" }}
                    >
                      <b>Equipos </b>
                      <i className="fas fa-sort-alpha-down" />
                    </button>
                  </th>
                  <th rowSpan="2" className="p-0">
                    <button
                      className="btn btn-outline-secondary m-1 py-0 px-1"
                      onClick={sortByFirstDate}
                      style={{ fontSize: "100%" }}
                    >
                      <b>Inicio </b>
                      <i className="fas fa-sort-numeric-down" />
                    </button>
                  </th>
                  <th
                    colSpan="12"
                    className="fs-6 py-0"
                  >{`Calendario ${year}`}</th>
                </tr>
                <tr>
                  {months.map((month, index) => (
                    <th
                      className="p-0"
                      key={index}
                      id={index}
                      style={{ fontSize: "90%" }}
                    >
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredList
                  .slice(paginate.first, paginate.last)
                  .map((task, index) => (
                    <CalendarPicker
                      key={task.device.code + index}
                      plant={plant}
                      year={year}
                      titles={index === 0}
                      task={task}
                      yearDates={dates}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row flex-fill d-flex">
          <NewPaginate
            key={filteredList}
            length={filteredList.length}
            visible="6"
            size="15"
            select={(first, last, size) => setPaginate({ first, last, size })}
          />
        </div>
      </div>
    </>
  );
}
