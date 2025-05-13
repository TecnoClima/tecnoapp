import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deviceActions, planActions } from "../../actions/StoreActions";
import { useEffect } from "react";

export default function TaskItem(props) {
  const { className, task } = props;
  const dispatch = useDispatch();

  let borderClass = {
    pendant: "border-error text-error font-bold",
    current: "border-warning text-warning font-bold",
    next: "border-info text-info font-bold",
  };

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
      <div>
        <div className="flex flex-wrap-reverse justify-between items-start">
          <div
            className="text-sm font-bold flex-grow"
            style={{ flexGrow: 1000 }}
          >
            {task.device}
          </div>
          <div className="flex items-center mx-auto" style={{ flexGrow: 1 }}>
            <div className={`flex-grow border  ${borderClass[className]}`} />
            <div
              className={`badge h-fit text-[11px] leading-snug text-center w-fit bg-neutral/10 border-2 ${borderClass[className]}`}
            >
              {task.strategy}
            </div>
            <div className={`flex-grow border ${borderClass[className]}`} />
          </div>
        </div>
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
                <summary className="btn btn-xs btn-neutral bg-neutral/40 hover:bg-neutral/60 border-none">
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
                className="btn btn-xs btn-neutral bg-neutral/40 hover:bg-neutral/60 border-none"
                to="/ots/new"
                onClick={handleNewOrder}
              >
                Crear OT
              </Link>
              <Link
                className="btn btn-xs btn-neutral bg-neutral/40 hover:bg-neutral/60 border-none"
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
                <div>Avance: {task.completed || 0}%</div>
                <div className="flex-grow h-1 bg-base-content/20">
                  <div
                    style={{
                      width: `${task.completed || 0}%`,
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
