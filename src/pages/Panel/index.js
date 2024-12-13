import React, { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import TaskList from "../../components/Panel/TaskList";
import { getDeviceFromList } from "../../actions/deviceActions";
import { planActions } from "../../actions/StoreActions";
import AssignedWO from "../../components/Panel/AssignedWO";
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
  }, [dispatch]);

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
    //set pendants, currents and netx tasks
    setPendant(
      plan.filter(
        (element) =>
          new Date(element.date) < new Date() && element.completed < 100
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
    <div className="page-container">
      {assignedOrders.length > 0 ? (
        <AssignedWO />
      ) : (
        <TaskList
          loading={!plan?.[0]}
          pendant={pendant}
          current={current}
          next={next}
          access={userData.access}
        />
      )}
    </div>
  );
}
