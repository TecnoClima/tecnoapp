import React, { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import TaskList from "../../components/lists/taskList";
import { getDeviceFromList } from "../../actions/deviceActions";
import { planActions } from "../../actions/StoreActions";
import AssignedWO from "../../components/lists/AssignedWO";
import { workOrderActions } from "../../actions/StoreActions";

export default function Panel() {
  const { assignedOrders } = useSelector((state) => state.workOrder);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.people);
  const { plan } = useSelector((state) => state.plan);
  const [conditions, setConditions] = useState(null);
  const [pendant, setPendant] = useState([]);
  const [current, setCurrent] = useState([]);
  const [next, setNext] = useState([]);

  useEffect(() => {
    dispatch(workOrderActions.getAssignedOrders());
  }, []);

  useEffect(() => {
    if (userData && userData.user) {
      const { plant, user, access } = userData;
      const year = new Date().getFullYear();
      plant && access !== "admin"
        ? setConditions({ year, plant, user })
        : setConditions({ year });
    }
  }, [userData]);

  useEffect(() => {
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
          date.completed < 100
      );
      return !!hasReallyPendant;
    });

    setPendant(
      plan.filter(
        (element) =>
          pendantCodes.includes(element.code) &&
          new Date(element.date) < new Date() &&
          element.completed < 100
      )
    );
    setCurrent(
      plan.filter(
        (element) =>
          new Date(element.date).toLocaleDateString() ===
          lastMonday.toLocaleDateString()
      )
    );
    setNext(
      plan.filter(
        (element) =>
          new Date(element.date).toLocaleDateString() ===
          nextMonday.toLocaleDateString()
      )
    );
  }, [plan]);

  return (
    <div className="container-fluid h-100 p-0">
      <div className="row h-100 m-0">
        {assignedOrders.length > 0 ? (
          <AssignedWO />
        ) : (
          <div className="h-100 p-0" style={{ overflowY: "auto" }}>
            <TaskList
              pendant={pendant}
              current={current}
              next={next}
              access={userData.access}
            />
          </div>
        )}
      </div>
    </div>
  );
}
