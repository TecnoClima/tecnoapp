import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions, plantActions } from "../../../actions/StoreActions";

export function CalendarFilter(props) {
  const { year } = useSelector((state) => state.data);
  const [dates, setDates] = useState({
    from: year + "-01-01",
    to: year + "-12-31",
  });

  function pickDate(e) {
    const { name, value } = e.target;
    const newDates = { ...dates, [name]: value };
    props.select && props.select(newDates);
    setDates(newDates);
  }
  return (
    <div className="container p-0 w-auto">
      <div className="row m-0">
        <div className="col-md-auto flex flex-wrap p-0">
          <div className="input-group w-auto flex-grow-1">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Desde
              </span>
            </div>
            <input
              type="date"
              min={year ? `${year}-01-01` : undefined}
              max={year ? `${year}-12-31` : undefined}
              value={dates.from || ""}
              name="from"
              className="form-control"
              onChange={pickDate}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>

          <div className="input-group w-auto flex-grow-1">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Hasta
              </span>
            </div>
            <input
              type="date"
              name="to"
              min={year ? `${year}-01-01` : undefined}
              max={year ? `${year}-12-31` : undefined}
              value={dates.to || ""}
              onChange={pickDate}
              className="form-control"
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalendarLocFilter(props) {
  const [filters, setFilters] = useState({
    area: "",
    line: "",
    device: "",
  });
  const { selectedPlant, areaList, lineList } = useSelector(
    (state) => state.plants
  );
  const [areas, setAreas] = useState([]);
  const [lines, setLines] = useState([]);
  const [requested, setRequested] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPlant) {
      let newAreas = areaList.filter((a) => a.plant === selectedPlant._id);
      let newLines = lineList.filter((l) =>
        newAreas.map((a) => a._id).includes(l.area._id)
      );
      setAreas(newAreas);
      setLines(newLines);
    }
  }, [selectedPlant, areaList, lineList]);

  useEffect(() => {
    if (requested) return;
    if (!areaList[0]) {
      dispatch(plantActions.getAreas());
      setRequested(true);
    }
    if (!lineList[0]) {
      dispatch(plantActions.getLines());
      setRequested(true);
    }
  }, [areaList, lineList, requested, dispatch]);

  function handleChange(e) {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    props.select && props.select(newFilters);
    setFilters(newFilters);
  }

  return (
    <div className="container p-0">
      <div className="row m-0">
        <div className="col-6 p-0">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Area
              </span>
            </div>
            <select
              name="area"
              value={filters.area}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Todas</option>
              {areas.map((a, i) => (
                <option key={i} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-6 p-0">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Línea
              </span>
            </div>
            <select
              name="line"
              value={filters.line}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Todas</option>
              {lines
                .filter((l) =>
                  filters.area ? l.area?._id === filters.area : true
                )
                .map((l, i) => (
                  <option key={i} value={l._id}>
                    {l.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="col-12 p-0">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Equipo
              </span>
            </div>
            <input
              name="device"
              onChange={handleChange}
              value={filters.device}
              placeholder="nombre o código de equipo"
              className="form-control"
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalendarPeopleFilter(props) {
  const [filters, setFilters] = useState({
    supervisor: "",
    worker: "",
  });
  const { workersList, supervisors } = useSelector((state) => state.people);
  const { selectedPlant } = useSelector((state) => state.plants);

  const [requested, setRequested] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (requested) return;
    if (!supervisors[0]) {
      dispatch(peopleActions.getSupervisors());
      setRequested(true);
    }
    if (!workersList[0]) {
      dispatch(peopleActions.getWorkers());
      setRequested(true);
    }
  }, [workersList, supervisors, requested, dispatch]);

  function handleChange(e) {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    props.select && props.select(newFilters);
    setFilters(newFilters);
  }

  return (
    <div className="container p-0 w-auto">
      <div className="row m-0">
        <div className="col-md-auto p-0 flex-grow-1">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Supervisor
              </span>
            </div>
            <select
              name="supervisor"
              value={filters.supervisor}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Todos</option>
              {supervisors
                .filter((w) =>
                  selectedPlant ? w.plant === selectedPlant.name : true
                )
                .map((s, i) => (
                  <option key={i} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="col-md-auto p-0 flex-grow-1">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-default">
                Técnico
              </span>
            </div>
            <select
              name="worker"
              value={filters.worker}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Todos</option>
              {workersList
                .filter((w) =>
                  selectedPlant ? w.plant === selectedPlant.name : true
                )
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((s, i) => (
                  <option key={i} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
