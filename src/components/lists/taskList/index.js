import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deviceActions, planActions } from "../../../actions/StoreActions";

function TaskItem(props) {
  const { className, task } = props;
  const dispatch = useDispatch();

  let zero = [139, 0, 0];
  let half = [180, 180, 0];
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
    <div className="card bg-base-content/10 text-xs p-2">
      <div className="">
        <p className="text-sm font-bold">{task.device}</p>
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col w-full md:w-1/2 min-w-fit gap-2 md:pr-4">
            <p>
              <Link to={`/devices/${task.code}`}>
                <b>[{task.code}]</b>
              </Link>
              {` - ${task.area} > ${task.line}`}
            </p>

            <div className="flex gap-2 items-center">
              <details className="dropdown">
                <summary className="btn btn-sm btn-neutral bg-neutral/40 hover:bg-neutral/60 border-none">
                  {" "}
                  Ver OTs
                </summary>
                <ul className="menu dropdown-content bg-base-100 rounded-lg z-[1] w-40 p-2 shadow">
                  {task.workOrders[0] ? (
                    task.workOrders.map((order, i) => (
                      <li key={i}>
                        <Link to={`/ots/detail/${order}`}>{`OT ${order}`}</Link>
                      </li>
                    ))
                  ) : (
                    <li className="py-0 text-secondary text-sm">
                      No hay OT asociadas
                    </li>
                  )}
                </ul>
              </details>
              <Link
                className="btn btn-sm btn-neutral bg-neutral/40 hover:bg-neutral/60 border-none"
                to="/ots/new"
                onClick={handleNewOrder}
              >
                Crear OT
              </Link>
              <Link
                className="btn btn-sm btn-neutral bg-neutral/40 hover:bg-neutral/60 border-none"
                to={`/devices/${task.code}`}
              >
                Ver Equipo
              </Link>
            </div>
          </div>
          <div className="flex w-full md:w-1/2 text-sm items-center">
            <div className="flex flex-col gap-1 w-full">
              <p>
                <span>
                  <b>Observaciones:</b> {task.observations}
                </span>
              </p>
              <div className="flex w-full items-center text-xs font-semibold gap-4">
                <div>Avance: {task.completed}%</div>
                <div className="flex-grow h-1 bg-base-content/20">
                  <div
                    style={{
                      width: `${task.completed}%`,
                      backgroundImage: `linear-gradient(to right, rgb(${zero.toString()}), ${
                        task.completed > 50 ? `rgb(${half.toString()}),` : ""
                      } ${bgColor})`,
                    }}
                    className="bg-base-content/20 h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaskList({ pendant, current, next, loading }) {
  return (
    <div className="flex flex-col h-full">
      <div className="page-title">Pendientes del plan</div>
      <div className="flex flex-col gap-2 flex-grow overflow-y-auto">
        <div className="collapse collapse-arrow bg-error/50">
          <input type="radio" name="my-accordion-2" className="h-12 min-h-0" />
          <div className="collapse-title text-base sm:text-lg font-medium p-2 h-fit min-h-0">
            {loading
              ? "Cargando pendientes..."
              : `${
                  pendant[0] ? pendant.length + " P" : "No hay p"
                }endientes hasta la semana pasada`}
          </div>
          <div className="collapse-content px-2 min-h-0 overflow-y-auto">
            <div className="flex flex-col gap-2 min-h-0 max-h-[65vh] overflow-y-auto">
              {pendant.map((task, index) => (
                <TaskItem key={index} task={task} className="pendant" />
              ))}
            </div>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-warning/50">
          <input
            type="radio"
            name="my-accordion-2"
            className="h-12 min-h-0"
            defaultChecked
          />
          <div className="collapse-title text-base sm:text-lg font-medium p-2 h-fit min-h-0">
            {loading
              ? "Cargando pendientes..."
              : `${
                  loading
                    ? "Cargando p"
                    : current[0]
                    ? current.length + " P"
                    : "No hay p"
                }endientes de esta semana`}
          </div>
          <div className="collapse-content px-2">
            <div className="flex flex-col gap-2 min-h-0 max-h-[65vh] overflow-y-auto">
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
        <div className="collapse collapse-arrow bg-info/50">
          <input type="radio" name="my-accordion-2" className="h-12 min-h-0" />
          <div className="collapse-title text-base sm:text-lg font-medium py-2 h-fit min-h-0 py-auto">
            {loading ? "Cargando taras" : `Tareas de la próxima semana`}
          </div>
          <div className="collapse-content">
            <div className="flex flex-col gap-2 min-h-0 max-h-[65vh] overflow-y-auto">
              {next.map((task, index) => (
                <TaskItem key={index} task={task} className="next" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
