import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deviceActions, planActions } from "../../../actions/StoreActions";
import "./index.css";

function TaskItem(props) {
  const { className, task } = props;
  const dispatch = useDispatch();

  let zero = [139, 0, 0];
  let half = [255, 255, 0];
  let full = [0, 128, 0];
  let color = [];
  for (let i = 0; i <= 2; i++) {
    const completed = task.completed;
    let percent = completed >= 50 ? completed - 50 : completed;
    let start = completed >= 50 ? [...half] : [...zero];
    let end = completed >= 50 ? [...full] : [...half];

    color[i] = Math.floor(start[i] + ((end[i] - start[i]) / 50) * percent);
  }
  let bgColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  if (className === "next") bgColor = "navy";

  function handleNewOrder() {
    dispatch(deviceActions.getDetail(task.code, true));
    dispatch(planActions.selectTask(task));
  }

  return (
    <div
      className="container-fluid p-0 bg-opacity-25 mb-2 rounded-3"
      style={{
        background: `${bgColor}`,
        fontSize: "80%",
        boxShadow: "2px 2px 2px grey",
      }}
    >
      <div className="row m-0 p-0">
        <div className="col text-light">
          <div>
            <b>{task.device}</b>
          </div>
          <div style={{ fontSize: "90%" }}>
            <Link to={`/devices/${task.code}`}>
              <b>[{task.code}]</b>
            </Link>
            {` - ${task.area} > ${task.line}`}
          </div>
        </div>
      </div>
      <div className="row m-0 bg-opacity-75 bg-light">
        <div className="col">{task.observations || <br />}</div>
      </div>
      <div className="row p-1 m-0">
        <div className="btn-group col-3 p-0">
          <button
            className="btn btn-light btn-sm dropdown-toggle p-0 mx-1"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Ver OTs
          </button>
          <ul className="dropdown-menu py-0">
            {task.workOrders[0] ? (
              task.workOrders.map((order, i) => (
                <li key={i}>
                  <Link
                    className="dropdown-item"
                    to={`/ots/detail/${order}`}
                  >{`OT ${order}`}</Link>
                </li>
              ))
            ) : (
              <li className="dropdown-item py-0 text-secondary">
                No hay OT asociadas
              </li>
            )}
          </ul>
        </div>
        <div className="col-3 p-0 d-grid gap-2">
          <Link
            className="btn btn-light px-0 py-1 me-1"
            style={{ fontSize: "90%" }}
            to="/ots/new"
            onClick={handleNewOrder}
          >
            Crear OT
          </Link>
        </div>
        <div className="col-3 p-0 d-grid gap-2">
          <Link
            className="btn btn-light px-0 py-1 me-1"
            style={{ fontSize: "90%" }}
            to={`/devices/${task.code}`}
          >
            Ver Equipo
          </Link>
        </div>
        <div
          className="col-3 p-0 d-flex text-light align-items-center justify-content-center fs-6"
          style={{ background: bgColor }}
        >
          <b>{task.completed} %</b>
        </div>
      </div>
    </div>
  );
}

export default function TaskList({ pendant, current, next }) {
  return (
    <div className="container-fluid p-0 h-100 d-flex flex-column">
      <div className="row m-0">
        <h5 className="text-center fw-bold my-3">
          <u>Pendientes del plan</u>
        </h5>
      </div>

      <div className="flex-grow-1" style={{ overflowY: "auto", minHeight: 0 }}>
        <div className="accordion">
          <div className="accordion-item m-0 border-0 pb-2">
            <button
              className={`${
                pendant[0] ? "alert-danger" : "alert-success"
              } text-darkpx-0 py-2 fw-bold w-100 rounded-3 border-0`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
              disabled={!pendant[0]}
            >
              {`${
                pendant[0] ? pendant.length + " P" : "No hay p"
              }endientes hasta la semana pasada`}
            </button>
            <div
              id="collapseOne"
              className={`accordion-collapse collapse ${
                !current[0] && pendant[0] ? "show" : ""
              }`}
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body p-0">
                <div
                  className="container-fluid p-0 overflow-auto"
                  style={{ height: "65vh" }}
                >
                  {pendant.map((task, index) => (
                    <TaskItem key={index} task={task} className="pendant" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item m-0 border-0 pb-2">
            <button
              className={`${
                current[0] ? "alert-warning " : "alert-success"
              } text-darkpx-0 py-2 fw-bold w-100 rounded-3 border-0`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="true"
              aria-controls="collapseTwo"
            >
              {`${
                current[0] ? current.length + " P" : "No hay p"
              }endientes de esta semana`}
            </button>
            <div
              id="collapseTwo"
              className={`accordion-collapse collapse ${
                current[0] ? "show" : ""
              }`}
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body p-0">
                <div className="container-fluid p-0 h-75 overflow-auto">
                  {current.map((task, index) => (
                    <TaskItem
                      key={index}
                      task={task}
                      className={
                        task.completed < 75
                          ? "pendant"
                          : task.completed === 100
                          ? "completed"
                          : "incourse"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item m-0 border-0 pb-2">
            <button
              className="alert-primary text-darkpx-0 py-2 fw-bold w-100  rounded-3 border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Tareas para la próxima semana
            </button>
            <div
              id="collapseThree"
              className={`accordion-collapse collapse ${
                !current[0] && !pendant[0] && next[0] ? "show" : ""
              }`}
              aria-labelledby="headingThree"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body p-0">
                <div className="container-fluid p-0 h-100 overflow-auto">
                  {next.map((task, index) => (
                    <TaskItem key={index} task={task} className="next" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
