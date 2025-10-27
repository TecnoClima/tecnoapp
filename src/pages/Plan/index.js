import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Pagination from "../../components/Paginate/Pagination";
import { planActions } from "../../actions/StoreActions";
import ProgramFilters from "../../components/filters/ProgramFilters";
import { ErrorModal } from "../../components/warnings";
import PlanCard from "../../components/plan/PlanCard";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const [showFilters, setShowFilters] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) return;
    if (plan[0]) setLoading(false);
    if (year && (plant || !userData || userData.access === "Admin")) {
      dispatch(planActions.getPlan({ year, plant, user: userData.user }));
      setLoading(true);
    }
  }, [loading, plan, year, plant, userData, dispatch]);

  function updateFilter(filters) {
    const filteredData = plan.filter((date) => {
      let check = true;
      if (filters.date) {
        const { year, month, day } = filters.date;
        const dateObj = new Date(date.date);

        if (year) {
          if (dateObj.getFullYear() !== Number(year)) check = false;
        }
        if (month && check) {
          if (dateObj.getMonth() !== Number(month - 1)) check = false;
        }
        if (day && check) {
          if (dateObj.getDate() !== Number(day)) check = false;
        }
      }
      if (filters.location) {
        const { plant, area, line, device, servicePoint } = filters.location;
        if (plant) if (date.plant !== plant) check = false;
        if (area) if (date.area !== area) check = false;
        if (line) if (date.line !== line) check = false;

        // Filtrado por texto para servicePoint (observations)
        if (servicePoint && check) {
          const observations = date.observations || "";
          if (
            !observations.toLowerCase().includes(servicePoint.toLowerCase())
          ) {
            check = false;
          }
        }

        // Filtrado por texto para device (device y code)
        if (device && check) {
          const deviceName = date.device || "";
          const deviceCode = date.code || "";
          if (
            !deviceName.toLowerCase().includes(device.toLowerCase()) &&
            !deviceCode.toLowerCase().includes(device.toLowerCase())
          ) {
            check = false;
          }
        }
      }
      if (filters.program) {
        const { program, responsible, supervisor } = filters.program;
        if (program) if (date.strategy !== program) check = false;
        if (responsible) {
          if (date.responsible && date.responsible.id !== Number(responsible)) {
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
    });

    setFilteredList(filteredData);

    // Ajustar la página actual si es necesario
    const totalPages = Math.ceil(filteredData.length / page.size);
    const currentPageNumber = Math.floor(page.first / page.size) + 1;

    if (totalPages > 0 && currentPageNumber > totalPages) {
      // Si la página actual es mayor que el total de páginas, ir a la última página disponible
      const newFirst = (totalPages - 1) * page.size;
      setPage({ ...page, first: newFirst });
    }
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
    <div className="page-container">
      <div className="page-title mb-[0!important]">{`PLAN DE MANTENIMIENTO ${year}`}</div>
      <div className="my-2 px-2 py-0 bg-base-200/50 rounded-box">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowFilters((s) => !s)}
        >
          <h3 className="font-bold text-base">Filtros</h3>
          <button className="btn btn-ghost btn-sm">
            <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} />
          </button>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showFilters ? "max-h-screen mt-2" : "max-h-0"
          }`}
        >
          <ProgramFilters
            responsibles={responsibles}
            supervisors={supervisors}
            select={(f) => updateFilter(f)}
          />
        </div>
      </div>
      <div className="flex flex-col min-h-0 gap-1 h-screen overflow-y-scroll">
        {filteredList[0]
          ? filteredList
              .slice(page.first, page.first + page.size)
              .map((date, index) => <PlanCard date={date} key={index} />)
          : "No hay elementos que coincidan con ese criterio de búsqueda"}
      </div>
      <div className="flex justify-center pt-2">
        <Pagination
          length={filteredList.length}
          current={Math.floor(page.first / page.size) + 1}
          size={page.size}
          setPage={(value) =>
            setPage({ ...page, first: (Number(value) - 1) * page.size })
          }
          setSize={(value) =>
            setPage({ ...page, size: Number(value), first: 0 })
          }
        />
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
