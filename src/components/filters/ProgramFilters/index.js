import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { planActions } from "../../../actions/StoreActions";
import DateFilter from "../DateFilter";
import LocationFilter from "../LocationFilter";
import ProgressFilter from "../ProgressFilter";
import { FilterSelect } from "../DeviceFilters/newFilters";

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
    <div className="">
      <div className="flex flex-col gap-2">
        <DateFilter select={(nf) => updateFilters({ ...filters, date: nf })} />
        <LocationFilter
          select={(nf) => updateFilters({ ...filters, location: nf })}
        />
      </div>
      <div className="flex flex-col items-center gap-2 mt-2">
        <div className="sm:join text-sm bg-base-content/10 w-full">
          <label htmlFor="location" className="plan-filter-label">
            Programa
          </label>
          <FilterSelect
            id="program"
            value={filters.program?.program || ""}
            options={programList.map((p) => p.name)}
            onSelect={setFilter}
            noLabel
            placeholder="Programa"
          />
          <FilterSelect
            id="responsible"
            value={filters.program?.responsible || ""}
            options={responsibles.map((p) => p.name)}
            onSelect={setFilter}
            noLabel
            placeholder="Responsable"
          />
          <FilterSelect
            id="supervisor"
            value={filters.program?.supervisor || ""}
            options={supervisors.map((p) => p.name)}
            onSelect={setFilter}
            noLabel
            placeholder="Supervisor"
          />
        </div>
      </div>
      <ProgressFilter
        select={(nf) => updateFilters({ ...filters, progress: nf })}
      />
    </div>
  );
}
