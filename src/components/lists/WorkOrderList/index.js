import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons";

function WorkOrderCard({ order }) {
  const {
    code,
    status,
    area,
    line,
    device,
    initIssue,
    cause,
    solicitor,
    registration,
  } = order;
  const isClosed = status === "Cerrada";

  return (
    <Link
      to={`/ots/detail/${code}`}
      className={`card w-full shadow-md mb-2 border ${
        isClosed
          ? " border border-success/75 hover:bg-success/20"
          : "bg-error/20  border-transparent  hover:border-error"
      }`}
    >
      <div className="card-body px-3 py-1">
        <div className="flex flex-wrap justify-between items-start">
          <div>
            <h2 className="card-title text-sm">
              N° {code}{" "}
              <span
                className={`badge badge-sm  ${
                  isClosed
                    ? "badge-success bg-success/50 text-base-content/75"
                    : "badge-error"
                }`}
              >
                {status}
              </span>
            </h2>
            <p className="text-xs">
              {area} &gt; {line} &gt;{" "}
              <span className="font-bold">{device}</span>
            </p>
          </div>
          <div className="text-sm mt-2">
            <p>
              <span className="font-bold">Motivo:</span> {initIssue} ({cause})
            </p>
            <p>
              <span className="font-bold">Solicitante:</span> {solicitor.name} (
              {solicitor.phone}) - {new Date(registration).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function WOList({ mostRecent = [] }) {
  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-lg font-bold text-center mb-4">
        10 reclamos más recientes
      </h2>
      {mostRecent.length > 0 ? (
        mostRecent.map((order, index) => (
          <WorkOrderCard key={index} order={order} />
        ))
      ) : (
        <p className="text-center">No hay reclamos recientes.</p>
      )}
    </div>
  );
}
