import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Paginate from "../../components/Paginate";
import "./index.css";
import { planActions } from "../../actions/StoreActions";
import ProgramFilters from "../../components/filters/ProgramFilters";
import { ErrorModal } from "../../components/warnings";

export default function Plan() {
  const { plan, planResult } = useSelector((state) => state.plan);
  const { userData } = useSelector((state) => state.people);
  const [loading, setLoading] = useState(false);
  const [year] = useState(new Date().getFullYear());
  const [plant] = useState(userData.plant || undefined);
  const [filteredList, setFilteredList] = useState(plan);
  const [supervisors, setSupervisors] = useState([]);
  const [responsibles, setResponsibles] = useState([]);
  const [page, setPage] = useState({ first: 0, size: 10 });
  const dispatch = useDispatch();

  function classCompleted(percent) {
    const value = Number(percent);
    if (value === 0) return "pendantTask";
    if (value < 70) return "coursedTask";
    if (value <= 99) return "doneTask";
    if (value === 100) return "completedTask";
  }

  useEffect(() => {
    if (loading) return;
    if (plan[0]) setLoading(false);
    if (year && (plant || !userData || userData.access === "Admin")) {
      dispatch(planActions.getPlan({ year, plant, user: userData.user }));
      setLoading(true);
    }
  }, [loading, plan, year, plant, userData, dispatch]);

  function updateFilter(filters) {
    setFilteredList(
      plan.filter((date) => {
        let check = true;
        if (filters.date) {
          const { year, month, day } = filters.date;
          if (year)
            if (new Date(date.date).getFullYear() !== year) check = false;
          if (month)
            if (new Date(date.date).getFullYear() !== month) check = false;
          if (day) if (new Date(date.date).getFullYear() !== day) check = false;
        }
        if (filters.location) {
          const { plant, area, line, device } = filters.location;
          if (plant) if (date.plant !== plant) check = false;
          if (area) if (date.area !== area) check = false;
          if (line) if (date.line !== line) check = false;
          if (device)
            if (!date.device.includes(device) && !date.code.includes(device))
              check = false;
        }
        if (filters.program) {
          const { program, responsible, supervisor } = filters.program;
          if (program) if (date.strategy !== program) check = false;
          if (responsible) {
            if (
              date.responsible &&
              date.responsible.id !== Number(responsible)
            ) {
              check = false;
            }
          }
          if (supervisor) {
            if (date.supervisor && date.supervisor.id !== Number(supervisor)) {
              check = false;
            }
          }
        }
        if (filters.progress) {
          const { min, max } = filters.progress;
          if (date.completed > max || date.completed < min) check = false;
        }
        return check;
      })
    );
  }

  useEffect(() => {
    const supervisors = [];
    const responsibles = [];
    for (let date of filteredList) {
      if (
        date.supervisor &&
        !supervisors.map((s) => s.id).includes(date.supervisor.id)
      )
        supervisors.push(date.supervisor);
      if (
        date.responsible &&
        !responsibles.map((r) => r.id).includes(date.responsible.id)
      )
        responsibles.push(date.responsible);
    }
    setResponsibles(responsibles);
    setSupervisors(supervisors);
  }, [filteredList]);

  useEffect(() => setFilteredList(plan), [plan]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <ProgramFilters
            responsibles={responsibles}
            supervisors={supervisors}
            select={(f) => updateFilter(f)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="title">{`PLAN DE MANTENIMIENTO ${year}`}</div>
          <div className="planContainer my-2">
            {filteredList[0]
              ? filteredList
                  .slice(page.first, page.first + page.size)
                  .map((date, index) => (
                    <div
                      key={index}
                      className={`planRow ${classCompleted(date.completed)}`}
                    >
                      <div className="planDate">
                        {new Date(date.date).toLocaleDateString().split(" ")[0]}
                      </div>
                      <div className="planCard planDeviceCard">
                        <div>
                          <b>{`[${date.code}] ${date.device}`}</b>
                        </div>
                        <div className="subTitle">
                          {`${date.plant} > ${date.area} > ${date.line}`}
                        </div>
                      </div>
                      <div className="planCard planPeopleCard">
                        {userData.access !== "Worker" && date.responsible && (
                          <div>
                            <b>{`Responsable: `}</b>
                            {date.responsible.name}
                          </div>
                        )}
                        <div>
                          <b>{`Supervisor: `}</b>
                          {date.supervisor.name}
                        </div>
                      </div>
                      <div className="planCard planTaskCard">
                        <b>{"Observaciones "}</b>
                        {date.observations}
                      </div>
                      <div
                        className={`planCard percentTask bg${classCompleted(
                          date.completed
                        )}`}
                      >
                        <b>{"Avance "}</b>
                        {`${date.completed}%`}
                      </div>
                    </div>
                  ))
              : "No hay elementos que coincidan con ese criterio de búsqueda"}
          </div>
          <Paginate
            pages={Math.ceil(filteredList.length / page.size)}
            length="10"
            min="5"
            step="5"
            defaultValue={page.size}
            select={(value) =>
              setPage({ ...page, first: (Number(value) - 1) * page.size })
            }
            size={(value) => setPage({ ...page, size: Number(value) })}
          />{" "}
        </div>
      </div>
      {planResult.error && (
        <ErrorModal
          message={planResult.error}
          close={() => dispatch(planActions.resetPlanResult())}
        />
      )}
    </div>
  );
}
