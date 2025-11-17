import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function PendantDropdown({ reclaims }) {
  const reclaimList = [...new Set(reclaims)];
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex="0"
        role="button"
        className="btn btn-circle btn-ghost btn-xs text-warning"
      >
        <FontAwesomeIcon icon={faTriangleExclamation} />
      </div>
      <div
        tabIndex="0"
        className="card compact dropdown-content bg-base-200 rounded-box z-[1] w-64 shadow-sm p-2 shadow-base-content/20"
      >
        <div tabIndex="0" className="card-body">
          <h2 className="font-bold">Intervenciones pendientes de cierre</h2>
          {reclaimList.map((reclaim) => (
            <Link
              className="link link-warning font-bold"
              key={reclaim}
              to={`/ots/detail/${reclaim}`}
            >
              {reclaim}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
