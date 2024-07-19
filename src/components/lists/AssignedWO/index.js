import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function AssignedWO(props) {
  const { assignedOrders } = useSelector((state) => state.workOrder);

  return (
    <div className="container-fluid d-flex flex-column h-100">
      <h5 className="text-center fw-bold my-3">
        <u>Órdenes Asignadas</u>
      </h5>
      <div
        className="d-flex flex-wrap justify-content-center"
        style={{ overflowY: "auto", minHeight: 0 }}
      >
        {assignedOrders.map(
          ({ code, class: cls, device, description, completed }) => (
            <div
              key={code}
              className="card m-1 bg-light"
              style={{ width: "18rem" }}
            >
              <div className="card-body">
                <div className="d-flex w-100 align-items-center mb-2">
                  <h5 className="card-title mb-0">OT {code}</h5>
                  <Link
                    to={`/ots/detail/${code}`}
                    className="card-link m-2 ms-auto text-decoration-underline"
                  >
                    Ver Detalle
                  </Link>
                </div>
                <h6 className="card-subtitle mb-2 text-muted">
                  {cls} - Avance: {completed}
                </h6>
                <p className="card-text fw-bold mb-0">
                  [{device.code}] - {device.name}
                </p>
                <p className="card-text">{description || "Sin descripción"}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
