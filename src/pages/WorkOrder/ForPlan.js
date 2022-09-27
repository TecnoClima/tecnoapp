import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ForPlan(props) {
  const { select, current } = props;
  const { plan } = useSelector((s) => s.plan);
  const [tasks, setTasks] = useState(undefined);
  const [forPlan, setForPlan] = useState(current.forPlan);
  const [device] = useState(props.device);
  const [selectedTask, setSelectedTask] = useState(
    current.task ? plan.find((t) => t.id === current.task) : undefined
  );

  useEffect(() => {
    if (!(device && plan[0])) return;
    let tasks = plan.filter((p) => p.code === device.code);
    setTasks(tasks);
  }, [device, plan]);

  function handleForPlan(e) {
    e.preventDefault();
    let forPlan = e.target.value === "yes";
    setForPlan(forPlan);
    select && select({ value: forPlan, selectedTask });
  }

  function handleSelectDate(e) {
    e.preventDefault();
    const { value } = e.target;
    let task = tasks.find((t) => t.id === value);
    setSelectedTask(task);
    select && select({ value: true, taskDate: task });
  }

  function handleDeselect(e) {
    e.preventDefault();
    setSelectedTask(undefined);
    select && select({ ...forPlan, task: undefined });
  }

  return (
    <div>
      <div
        className={`rounded-3 container ${
          selectedTask
            ? "alert-success"
            : forPlan === false
            ? "alert-danger"
            : "btn-warning"
        } w-100`}
      >
        <div className="row py-1 gap-1">
          <div className="col-sm-6 px-0">
            <div className="input-group">
              <span
                className="fw-bold flex-grow-1 input-group-text border-0 bg-light bg-opacity-50
               "
              >
                ¿Es orden de plan?
              </span>
              <button
                className={`btn flex-grow-1 ${
                  forPlan ? "btn-success" : "btn-outline-success"
                }`}
                style={{ width: "2rem" }}
                value="yes"
                disabled={!!selectedTask}
                onClick={handleForPlan}
              >
                Si
              </button>
              {!selectedTask && (
                <button
                  className={`btn flex-grow-1 ${
                    forPlan === false ? "btn-danger" : "btn-outline-danger"
                  }`}
                  value="no"
                  style={{ width: "2rem" }}
                  onClick={handleForPlan}
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
                <button className="btn btn-danger" onClick={handleDeselect}>
                  <i className="fa fa-backspace" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {forPlan && !selectedTask && (
        <div className="alert-warning p-1 fw-bold">
          Seleccione fecha
          <div className="d-flex flex-wrap gap-1">
            {tasks.map((t, i) => {
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
                  onClick={handleSelectDate}
                >
                  {t.date.split("T")[0].split("-").reverse().join("/")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
