import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

function classCompleted(percent) {
  const value = Number(percent);
  if (value === 0) return "pendantTask";
  if (value < 70) return "coursedTask";
  if (value <= 99) return "doneTask";
  if (value === 100) return "completedTask";
}

let zero = [139, 0, 0];
let half = [180, 180, 0];
let full = [0, 128, 0];

function setBadgeBg(percent) {
  const value = Number(percent);
  if (value === 0) return zero;
  if (value < 70) return half;
  if (value <= 100) return full;
}

export default function PlanCard({ date }) {
  const { userData } = useSelector((state) => state.people);
  const displayedDate = new Date(date.date).toLocaleDateString().split(" ")[0];
  const displayResponsible = userData.access !== "Worker" && date.responsible;
  const badgeBg = setBadgeBg(date.completed);
  return (
    <div
      className="card gap-1 w-full p-1 bg-base-content/10 rounded-box"
      style={{
        border: `1px solid rgba(${badgeBg.toString()},0.5)`,
        background:
          date.completed === 100
            ? `rgba(${badgeBg.toString()},0.2)`
            : undefined,
      }}
    >
      <div className="flex text-center text-sm">
        <div className="font-bold w-28 bg-neutral rounded-box">
          {displayedDate}
        </div>
        <div className="hidden md:block font-bold w-36 bg-base-content/30 rounded-box px-2">
          {date.code}
        </div>
        <div className="hidden md:block font-bold flex-grow w-80 text-left px-2">
          {date.device}
        </div>
        <div
          className="text-sm px-2 rounded-full h-fit w-12 ml-auto"
          style={{ background: `rgba(${badgeBg.toString()},0.5)` }}
        >
          {`${date.completed}%`}
        </div>
      </div>
      <p className="md:hidden text-sm -indent-2 ml-2">
        <span className="font-bold w-36 bg-base-content/30 rounded-box px-2">
          {date.code}
        </span>

        <span className="font-bold flex-grow w-80 text-left px-2">
          {date.device}
        </span>
      </p>
      <div className="font-bold text-xs mx-2 md:mx-1">
        <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
        {`${date.plant} > ${date.area} > ${date.line}`}
      </div>
      <div className="flex text-xs px-1 justify-between flex-wrap-reverse md:flex-nowrap gap-x-4">
        <div className="md:flex-grow min-w-60">{date.observations}</div>
        <div className="flex flex-row-reverse flex-wrap justify-between md:block w-full md:w-fit flex-none mb-1">
          {displayResponsible && (
            <div className="flex  gap-1 border border-base-content/30 rounded-sm pr-1 flex-grow">
              <div className="w-20 bg-base-content/30 px-2 rounded-sm">
                Responsable
              </div>
              {date.responsible.name}
            </div>
          )}
          {date.supervisor && (
            <div className="flex gap-1 border border-base-content/30 rounded-sm pr-1 flex-grow">
              <div className="w-20 bg-base-content/30 px-2 rounded-sm">
                Supervisor
              </div>
              {date.supervisor.name}
            </div>
          )}
        </div>
      </div>
    </div>

    // <div className={`planRow ${classCompleted(date.completed)}`}>

    //   <div className="planCard planTaskCard">
    //     <b>{"Observaciones "}</b>
    //     {date.observations}
    //   </div>
    //   <div
    //     className={`planCard percentTask bg${classCompleted(date.completed)}`}
    //   >
    //     <b>{"Avance "}</b>
    //     {`${date.completed}%`}
    //   </div>
    // </div>
  );
}
