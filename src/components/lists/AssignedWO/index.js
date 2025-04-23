import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Filters from "../../filters/Filters";
import { useState } from "react";

export default function AssignedWO(props) {
  const { assignedOrders } = useSelector((state) => state.workOrder);
  const [filteredList, setFilteredList] = useState(assignedOrders);
  return (
    <div
      className="container-fluid d-flex flex-column h-100"
      style={{ overflowY: "auto", minHeight: 0 }}
    >
      <h5 className="text-center fw-bold my-3">
        <u>Órdenes Asignadas</u>
      </h5>
      <Filters list={assignedOrders} setList={setFilteredList} />
      <div className="row">
        {filteredList
          .filter((o) => !!o)
          .map(
            ({
              code,
              class: cls,
              device,
              description,
              registration,
              completed,
            }) => {
              return (
                <div key={code} className="col-md-6 col-lg-4 px-2 py-2">
                  <div
                    className="card bg-light w-100 h-100 "
                    // style={{ width: "20rem", maxWidth: "100%" }}
                  >
                    <div className="card-body">
                      <div className="d-flex d-grid w-100 align-items-center justify-content-between mb-2">
                        <div className="badge fs-6 font-bold mb-0 bg-dark text-light ">
                          OT {code}
                        </div>
                        <div className="d-flex ">
                          <span className="badge bg-secondary">
                            Emision <br />
                            {registration?.date &&
                              registration.date
                                .split("T")[0]
                                .split("-")
                                .reverse()
                                .join("/")}
                          </span>
                          <Link
                            to={`/ots/detail/${code}`}
                            className="btn btn-sm btn-info"
                          >
                            <i className="fas fa-search-plus"></i>
                          </Link>
                        </div>
                      </div>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {cls} - Avance: {completed}
                      </h6>
                      <div className="fw-bold" style={{ fontSize: "70%" }}>
                        {`${device.line.area.plant.name} > 
                  ${device.line.area.name} > 
                  ${device.line.name}`}
                      </div>
                      <p className="card-text fw-bold mb-0">
                        [{device.code}]<br />
                        {device.name}
                      </p>
                      <p className="card-text">
                        {description || "Sin descripción"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
      </div>
    </div>
  );
}
