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
    <div className="join">
      <label className="label input-xs md:input-sm bg-base-content/10 join-item border border-base-content/20 min-w-fit">
        Desde
      </label>
      <input
        type="date"
        min={year ? `${year}-01-01` : undefined}
        max={year ? `${year}-12-31` : undefined}
        value={dates.from || ""}
        name="from"
        className="input input-xs md:input-sm input-bordered join-item"
        onChange={pickDate}
      />
      <label className="label input-xs md:input-sm bg-base-content/10 join-item border border-base-content/20 min-w-fit">
        Hasta
      </label>
      <input
        type="date"
        name="to"
        min={year ? `${year}-01-01` : undefined}
        max={year ? `${year}-12-31` : undefined}
        value={dates.to || ""}
        onChange={pickDate}
        className="input input-xs md:input-sm input-bordered join-item"
      />
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
    <div className="flex flex-wrap gap-x-2 w-full">
      <div className="join flex-grow">
        <label className="label input-xs md:input-sm bg-base-content/10 join-item border border-base-content/20 min-w-fit">
          Area
        </label>
        <select
          name="area"
          value={filters.area}
          onChange={handleChange}
          className="select select-bordered select-xs md:select-sm join-item flex-grow"
        >
          <option value="">Todas</option>
          {areas.map((a, i) => (
            <option key={i} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      <div className="join flex-grow">
        <label className="label input-xs md:input-sm bg-base-content/10 join-item border border-base-content/20 min-w-fit">
          Línea
        </label>
        <select
          name="line"
          value={filters.line}
          onChange={handleChange}
          className="select select-bordered select-xs md:select-sm join-item flex-grow"
        >
          <option value="">Todas</option>
          {lines
            .filter((l) => (filters.area ? l.area?._id === filters.area : true))
            .map((l, i) => (
              <option key={i} value={l._id}>
                {l.name}
              </option>
            ))}
        </select>
      </div>
      <div className="join flex-grow">
        <label className="label input-xs md:input-sm bg-base-content/10 join-item border border-base-content/20 min-w-fit">
          Equipo
        </label>
        <input
          name="device"
          onChange={handleChange}
          value={filters.device}
          placeholder="nombre o código de equipo"
          className="input input-xs md:input-sm input-bordered join-item flex-grow"
        />
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
    <div className="flex gap-x-2 flex-grow flex-wrap">
      <div className="join w-60 flex-grow">
        <label className="label input-xs md:input-sm bg-base-content/10 join-item border border-base-content/20 min-w-fit">
          Supervisor
        </label>
        <select
          name="supervisor"
          value={filters.supervisor}
          onChange={handleChange}
          className="select select-bordered select-xs md:select-sm join-item flex-grow"
        >
          <option value="">Todos</option>
          {supervisors
            .filter((s) =>
              selectedPlant ? s.plant === selectedPlant.name : true
            )
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((s, i) => (
              <option key={i} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
      </div>
      <div className="join w-60 flex-grow">
        <label className="label input-xs md:input-sm bg-base-content/10 join-item border border-base-content/20 min-w-fit">
          Técnico
        </label>
        <select
          name="worker"
          value={filters.worker}
          onChange={handleChange}
          className="select select-bordered select-xs md:select-sm join-item flex-grow"
        >
          <option value="">Todos</option>
          {workersList
            .filter((w) =>
              selectedPlant ? w.plant === selectedPlant.name : true
            )
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((w, i) => (
              <option key={i} value={w.id}>
                {w.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
