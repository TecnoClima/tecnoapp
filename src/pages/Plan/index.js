import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getPlan } from "../../actions/planActions";
import Paginate from "../../components/Paginate";
import PlanFilters from "../../components/filters/PlanFilters";
import "./index.css";
import DateFilter from "../../components/filters/DateFilter";
import LocationFilter from "../../components/filters/LocationFilter";

export default function Plan() {
  const { plan } = useSelector((state) => state.plan);
  const { userData } = useSelector((state) => state.people);
  const [year] = useState(new Date().getFullYear());
  const [plant] = useState(userData.plant || undefined);
  const [filteredList, setFilteredList] = useState(plan);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState({ first: 0, size: 10 });
  const dispatch = useDispatch();

  function classCompleted(percent) {
    const value = Number(percent);
    if (value === 0) return "pendantTask";
    if (value < 70) return "coursedTask";
    if (value <= 99) return "doneTask";
    if (value === 100) return "completedTask";
  }

  useEffect(
    () =>
      year && plant && dispatch(getPlan({ year, plant, user: userData.user })),
    [year, plant, userData, dispatch]
  );

  useEffect(() => {
    setFilteredList(
      plan.filter((date) => {
        let check = true;
        for (let key of Object.keys(filters)) {
          switch (key) {
            case "year":
              if (new Date(date.date).getFullYear() !== Number(filters[key]))
                check = false;
              break;
            case "month":
              if (new Date(date.date).getMonth() !== Number(filters[key] - 1))
                check = false;
              break;
            case "date":
              if (new Date(date.date).getDate() !== Number(filters[key]))
                check = false;
              break;
            case "deviceCodes":
              if (!filters[key].includes(date.code)) check = false;
              break;
            case "minComplete":
              if (date.completed < filters[key]) check = false;
              break;
            case "maxComplete":
              if (date.completed > filters[key]) check = false;
              break;
            case "complete":
              if (date.completed !== Number(filters[key])) check = false;
              break;
            case "responsible":
              if (date.responsible.id !== Number(filters[key])) check = false;
              break;
            default:
              if (date[key] !== filters[key]) check = false;
          }
        }
        return check;
      })
    );
  }, [plan, filters]);

  return (
    <div className="container">
      <div className="row">
        {/* <DateFilter />
        <LocationFilter /> */}
      </div>
      <PlanFilters
        year={year}
        userData={userData}
        select={(json) => setFilters(json)}
        data={plan}
        key={plan.length}
      />
      <div className="title">{`PLAN DE MANTENIMIENTO ${year}`}</div>
      <div className="planContainer">
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
  );
}
