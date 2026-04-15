import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDeviceFromList } from "../../actions/deviceActions";
import { planActions, workOrderActions } from "../../actions/StoreActions";
import AssignedWO from "../../components/Panel/AssignedWO";
import TaskList from "../../components/Panel/TaskLists";

export default function Panel() {
  const { assignedOrders } = useSelector((state) => state.workOrder);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.people);
  const { plan } = useSelector((state) => state.plan);
  const [conditions, setConditions] = useState(null);
  const [pendant, setPendant] = useState([]);
  const [current, setCurrent] = useState([]);
  const [next, setNext] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  // const isAdmin = userData?.access === "admin";

  useEffect(() => {
    dispatch(workOrderActions.getAssignedOrders());
  }, [dispatch]);

  useEffect(() => {
    if (isFetching && plan) {
      setIsFetching(false);
    }
  }, [isFetching, plan]);

  useEffect(() => {
    if (userData?.user) {
      const hasPlant = !!userData.plant;
      const year = new Date().getFullYear();
      const filters = { year };
      const isAdmin = userData.access.toLowerCase() === "admin";
      if (hasPlant) filters.plant = userData.plant;
      if (!isAdmin) filters.user = userData.user;
      setConditions(filters);
    }
  }, [userData]);

  useEffect(() => {
    setIsFetching(true);
    dispatch(planActions.selectTask(undefined));
    dispatch(getDeviceFromList({}));
  }, [dispatch]);

  useEffect(() => {
    conditions && dispatch(planActions.getPlan(conditions));
  }, [conditions, dispatch]);

  useEffect(() => {
    //current week monday
    const today = new Date();
    const lastMonday =
      today.getDay() === 1
        ? today
        : new Date(today.setDate(today.getDate() - (today.getDay() - 1)));
    let nextMonday = new Date(lastMonday);
    nextMonday.setDate(lastMonday.getDate() + 7);
    const codes = [...new Set(plan.map((element) => element.code))];

    //set pendants, currents and netx tasks
    const pendantCodes = codes.filter((code) => {
      // select code tasks
      const codeTasks = plan.filter((date) => date.code === code);
      const mostRecentDone = codeTasks
        .filter((d) => d.completed === 100)
        .sort((d1, d2) => new Date(d1.date) - new Date(d2.date))
        .reverse()[0];

      if (!mostRecentDone) {
        return true;
      }
      const hasReallyPendant = codeTasks.find(
        (date) =>
          new Date(date.date) < new Date() &&
          new Date(date.date) > new Date(mostRecentDone.date) &&
          date.completed < 100,
      );
      return !!hasReallyPendant;
    });

    setPendant(
      plan.filter(
        (element) =>
          pendantCodes.includes(element.code) &&
          new Date(element.date) < new Date() &&
          element.completed < 100,
      ),
    );
    setCurrent(
      plan.filter(
        (element) =>
          new Date(element.date).toLocaleDateString() ===
          lastMonday.toLocaleDateString(),
      ),
    );
    setNext(
      plan.filter(
        (element) =>
          new Date(element.date).toLocaleDateString() ===
          nextMonday.toLocaleDateString(),
      ),
    );
  }, [plan]);

  return (
    <div className="page-container">
      {assignedOrders.length > 0 ? (
        <AssignedWO />
      ) : (
        <>
          {!isFetching && !plan[0] ? (
            <>
              <div className="page-title text-error">
                No hay un plan cargado para este año en su planta
              </div>
            </>
          ) : (
            <TaskList
              loading={!!isFetching}
              pendant={pendant}
              current={current}
              next={next}
              access={userData.access}
            />
          )}
        </>
      )}
    </div>
  );
}
