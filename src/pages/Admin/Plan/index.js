import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PlanCalendar from "../../../components/plan/Calendar";
import ProgramManagement from "../../../components/plan/ManagePrograms";
import PlanTask from "../../../components/plan/Tasks";
import PlanningNav from "./PlanningNav.js";

const routes = [
  {
    tab: "acciones",
    path: "/admin/plan/acciones",
    text: "Acciones",
    component: PlanTask,
  },
  {
    tab: "calendario",
    path: "/admin/plan/calendario",
    text: "Calendario",
    component: PlanCalendar,
  },
  {
    tab: "programas",
    path: "/admin/plan/programas",
    text: "Programas",
    component: ProgramManagement,
  },
];

export default function AdminPlan() {
  const { plant, year } = useSelector((state) => state.data);
  const { tab } = useParams();

  const navigate = useNavigate();
  const Component = (
    !tab ? routes[0] : routes.find((route) => route.tab === tab)
  )?.component;

  useEffect(() => {
    if (!Component) {
      navigate(routes[0].path);
    }
  }, [Component, navigate]);

  return (
    <div className="page-container">
      <PlanningNav routes={routes} />
      <div className="flex flex-col flex-grow">
        {Component && <Component plant={plant} year={year} />}
      </div>
    </div>
  );
}
