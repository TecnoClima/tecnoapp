import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ForPlan({ select, order }) {
  const { selectedDevice } = useSelector((s) => s.devices);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDates, setTaskDates] = useState(null);
  const [isForPlan, setIsForPlan] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  function clickButton(e) {
    e.preventDefault();
    const { value } = e.currentTarget;
    const forPlan = value ? value === "yes" : undefined;
    setIsForPlan(forPlan);
    select && select({ value: forPlan, taskDate: selectedTask });
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
    <div>
      <div
        className={`rounded-3 container ${
          selectedTask
            ? "alert-success"
            : isForPlan === false
            ? "alert-danger"
            : "btn-warning"
        } w-100`}
      >
        <div className="row py-1 gap-1">
          <div className="col-sm-6 px-0">
            <div className="input-group">
              <span className="fw-bold flex-grow-1 input-group-text border-0 bg-light bg-opacity-50">
                ¿Es orden de plan?
              </span>
              <button
                className={`btn flex-grow-1 ${
                  isForPlan ? "btn-success" : "btn-outline-success"
                }`}
                style={{ width: "2rem" }}
                value="yes"
                disabled={!!selectedTask}
                onClick={clickButton}
              >
                Si
              </button>
              {!selectedTask && (
                <button
                  className={`btn flex-grow-1 ${
                    isForPlan === false ? "btn-danger" : "btn-outline-danger"
                  }`}
                  value="no"
                  style={{ width: "2rem" }}
                  onClick={clickButton}
                >
                  No
                </button>
              )}
            </div>
          </div>
          <div className="col-sm-auto px-0">
            {selectedTask && (
              <div className="input-group">
                <span className="input-group-text">Fecha plan</span>
                <input
                  className="form-control"
                  value={selectedTask.date
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")}
                  readOnly
                />
                <button
                  value=""
                  className="btn btn-danger"
                  onClick={selectDate}
                >
                  <i className="fa fa-backspace" />
                </button>
              </div>
            )}
          </div>
        </div>
        {isForPlan && !selectedTask && (
          <div className="alert-warning p-1 fw-bold">
            Seleccione fecha
            <div className="d-flex flex-wrap gap-1">
              {taskDates?.map((t, i) => {
                const selectable = new Date(t.date) <= new Date();
                const selected = selectedTask && selectedTask.id === t.id;
                return (
                  <button
                    value={t.id}
                    key={i}
                    className={`btn ${
                      selected
                        ? "btn-primary"
                        : selectable
                        ? "btn-outline-secondary"
                        : "btn-outline-danger"
                    }`}
                    disabled={!selectable}
                    onClick={selectDate}
                  >
                    {t.date.split("T")[0].split("-").reverse().join("/")}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
