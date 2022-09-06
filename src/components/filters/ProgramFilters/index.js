import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { planActions } from "../../../actions/StoreActions";
import DateFilter from "../DateFilter";
import LocationFilter from "../LocationFilter";
import ProgressFilter from "../ProgressFilter";
import "./index.css";

export default function ProgramFilters(props) {
  const { plantList } = useSelector((state) => state.plants);
  const { programList } = useSelector((state) => state.plan);
  const { select, responsibles, supervisors } = props;
  const [filters, setFilters] = useState({
    date: { year: new Date().getFullYear() },
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // ensure all data for dropdown menues
  useEffect(() => {
    const { year } = filters.date;
    if (programList[0]) setLoading(false);
    if (loading) return;
    const plant = filters.plant || (plantList[0] && plantList[0].name);
    if (plant) {
      if (!programList[0]) {
        dispatch(planActions.getStrategies({ year, plant }));
        setLoading(true);
      }
    }
  }, [dispatch, programList, plantList, filters, loading]);

  function setFilter(e) {
    const { name, value } = e.target;
    const program = filters.program || {};
    if (!value) {
      delete program[name];
    } else {
      program[name] = value;
    }
    let newFilter = { ...filters, program };
    setFilters(newFilter);
    select && select(newFilter);
  }
  function updateFilters(newFilter) {
    setFilters(newFilter);
    select && select(newFilter);
  }

  return (
    <div className="container">
      <div className="row">
        <DateFilter select={(nf) => updateFilters({ ...filters, date: nf })} />
        <LocationFilter
          select={(nf) => updateFilters({ ...filters, location: nf })}
        />
      </div>
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="input-group">
            <span className="input-group-text py-0 px-1 fw-bold">PROGRAMA</span>
            <select
              name="program"
              className="form-control p-0 pe-3 w-auto"
              value={filters.program ? filters.program.program : ""}
              onInput={setFilter}
            >
              <option value="">PROGRAMA</option>
              {programList.map((p, i) => (
                <option key={i} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              name="responsible"
              className="form-control p-0 pe-3 w-auto"
              value={filters.program ? filters.program.responsible : ""}
              onChange={setFilter}
            >
              <option value="">Responsable</option>
              {responsibles.map((r, i) => (
                <option key={i} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <select
              name="supervisor"
              className="form-control p-0 pe-3 w-auto"
              value={filters.program ? filters.program.supervisor : ""}
              onChange={setFilter}
            >
              <option value="">Supervisor</option>
              {supervisors.map((s, i) => (
                <option key={i} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="input-group py-auto">
            <ProgressFilter
              select={(nf) => updateFilters({ ...filters, progress: nf })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
