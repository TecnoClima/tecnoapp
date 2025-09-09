import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ClassBadge from "../../components/Badges/ClassBadge";
import { StatusBadge } from "../Badges/StatusBadge";

export default function WorkOrderListItem({
  order,
  onClick,
  handleWarning,
  isAdmin,
}) {
  return (
    <div key={order.code} className="flex w-full items-center gap-2">
      <Link
        title="Detalle"
        to={`/ots/detail/${order.code}`}
        onClick={onClick}
        className="card rounded-lg sm:rounded-box bg-base-content/10 overflow-x-auto flex flex-wrap flex-grow text-sm flex-row border-2 border-transparent hover:border-base-content/20"
      >
        <div className="flex items-center bg-neutral/75 text-base-content w-full sm:w-20 sm:px-2 font-bold">
          <p className="mx-auto">{order.code}</p>
        </div>
        <div className="pt-1 w-80 flex-grow ">
          <div className="flex w-full">
            <ClassBadge cls={order.class} />
            <StatusBadge className="text-xs" order={order} />
          </div>
          <div className="flex gap-3 py-1 px-2">
            <p>
              <b>{`[${order.devCode}]`}</b> <span>{order.devName}</span>
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs px-2 bg-neutral/50 py-1">
            <span>{order.plant} </span>
            <FontAwesomeIcon icon={faChevronRight} className="h-3" />
            <b> {order.area}</b>
            <FontAwesomeIcon icon={faChevronRight} className="h-3" />
            <b> {order.line}</b>
          </div>
        </div>
        <div className="p-1 text-sm w-60 flex-grow">
          <div className="text-xs bg-neutral/50 px-1 ">Solicitó</div>
          <div className="px-1">
            {`${new Date(order.date).toLocaleDateString()} - 
    ${order.solicitor}`}
          </div>
          <div className="text-xs bg-neutral/50 px-1 ">Supervisa:</div>
          <div className="px-1">{order.supervisor}</div>
        </div>
        <div className="text-sm w-60 flex-grow">
          {order.description && <div className="p-1">{order.description}</div>}
        </div>
      </Link>
      {isAdmin && (
        <>
          {handleWarning && (
            <button
              className="relative btn btn-error btn-sm mb-auto -ml-12 sm:mb-0 sm:ml-0"
              title="Eliminar"
              id={order.code}
              onClick={handleWarning}
            >
              <i className="fas fa-trash-alt" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
