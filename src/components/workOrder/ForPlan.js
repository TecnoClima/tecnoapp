import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalBase from "../../Modals/ModalBase";

export default function ForPlan({ select, order }) {
  const { selectedDevice } = useSelector((s) => s.devices);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDates, setTaskDates] = useState(null);
  const [isForPlan, setIsForPlan] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  function clickButton(e) {
    e.preventDefault();
    const { value } = e.currentTarget;
    const forPlan = value === "yes" ? true : value === "no" ? false : undefined;
    console.log("forPlan", forPlan);
    if (forPlan) {
      select && select({ value: forPlan, taskDate: selectedTask });
    } else {
      setSelectedTask(null);
      select && select({ value: forPlan });
    }
    setIsForPlan(forPlan);
  }
  useEffect(() => {
    const dateList = order.taskDates || selectedDevice.taskDates;
    setTaskDates(dateList);
    if (isLoading) {
      if (order.taskDate) {
        const task = dateList?.find(
          (o) => o.id === order.taskDate || o.id === order.taskDate?.id
        );
        if (task) setSelectedTask(task);
      } else if (order.code) {
        setIsForPlan(false);
      }
      setIsLoading(false);
    }
  }, [order, selectedDevice, isLoading]);

  function selectDate(e) {
    e.preventDefault();
    const task = (order.taskDates || selectedDevice.taskDates)?.find(
      (o) => o.id === e.currentTarget.value
    );
    setSelectedTask(task);
    select && select({ value: isForPlan, taskDate: task });
  }

  return (
    <div className="w-full">
      <div
        className={`rounded-xl border ${
          selectedTask
            ? "border-success"
            : isForPlan === false
            ? "border-error"
            : "border-warning"
        } w-full`}
      >
        <div className="join items-center flex-wrap py-1 gap-y-1 px-2 text-sm">
          <span className="font-bold join-item mr-2">¿Es orden de plan?</span>
          <button
            className={`btn btn-xs text-sm btn-success disabled:bg-success disabled:text-success-content w-8 mr-2 ${
              isForPlan ? "" : "btn-outline"
            }`}
            value="yes"
            disabled={!!selectedTask}
            onClick={clickButton}
          >
            Si
          </button>
          <button
            className={`btn btn-xs text-sm btn-error w-8 ${
              isForPlan === false ? "" : "btn-outline"
            }`}
            value="no"
            onClick={clickButton}
          >
            No
          </button>
          {selectedTask && (
            <>
              <input
                className="input input-sm form-control bg-base-content/10 join-item ml-2 sm:w-24"
                value={selectedTask.date
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}
                readOnly
              />
              <button
                value=""
                className="btn btn-xs text-sm btn-error btn-outline join-item"
                onClick={selectDate}
              >
                <i className="fa fa-backspace" />
              </button>
            </>
          )}
        </div>

        <ModalBase
          open={isForPlan && !selectedTask}
          title="Seleccione fecha"
          className="bg-base-200"
        >
          <div className="flex flex-wrap gap-1 justify-center">
            {taskDates?.map((t, i) => {
              const selectable = new Date(t.date) <= new Date();
              const selected = selectedTask && selectedTask.id === t.id;
              return (
                <button
                  value={t.id}
                  key={i}
                  className={`btn w-24 btn-sm ${
                    selected ? "" : selectable ? "btn-outline" : "btn-outline"
                  }`}
                  disabled={!selectable}
                  onClick={selectDate}
                >
                  {t.date.split("T")[0].split("-").reverse().join("/")}
                </button>
              );
            })}
          </div>
        </ModalBase>
        {
          // <div className="alert-warning fw-bold">
          //   Seleccione fecha
          //   <div className="d-flex flex-wrap gap-1">
          //     {taskDates?.map((t, i) => {
          //       const selectable = new Date(t.date) <= new Date();
          //       const selected = selectedTask && selectedTask.id === t.id;
          //       return (
          //         <button
          //           value={t.id}
          //           key={i}
          //           className={`btn ${
          //             selected
          //               ? "btn-primary"
          //               : selectable
          //               ? "btn-outline-secondary"
          //               : "btn-outline-danger"
          //           }`}
          //           disabled={!selectable}
          //           onClick={selectDate}
          //         >
          //           {t.date.split("T")[0].split("-").reverse().join("/")}
          //         </button>
          //       );
          //     })}
          //   </div>
          // </div>
        }
      </div>
    </div>
  );
}
