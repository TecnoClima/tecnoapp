import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircle as faFullCircle } from "@fortawesome/free-solid-svg-icons";
import ClassBadge from "../Badges/ClassBadge";
import { useState } from "react";
import Filters from "../filters/Filters";

export default function AssignedWO(props) {
  const { assignedOrders } = useSelector((state) => state.workOrder);
  const [filteredList, setFilteredList] = useState(assignedOrders);

  return (
    <div className="flex flex-col h-full">
      <div className="page-title">Órdenes Asignadas</div>
      <div className="sm:-mx-3">
        <Filters list={assignedOrders} setList={setFilteredList} />
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-wrap items-stretch">
          {filteredList.map(
            ({ code, class: cls, device, description, completed }) => (
              <div className="w-full sm:w-1/2 lg:w-1/3 py-1 sm:p-3">
                <Link
                  key={code}
                  to={`/ots/detail/${code}`}
                  className="w-full text-xs sm:text-sm"
                >
                  <div className="card bg-base-content/10 shadow-xl md:h-full hover:scale-105 transition-transform duration-500">
                    <div className="card-body p-2 sm:p-4 justify-start">
                      <div className="flex flex-col gap-2">
                        <div className="flex w-full items-center justify-between">
                          <h2 className="card-title">OT {code}</h2>
                          <div className="flex items-center gap-2">
                            {completed}%
                            {completed === 0 ? (
                              <FontAwesomeIcon icon={faCircle} />
                            ) : (
                              <FontAwesomeIcon
                                icon={faFullCircle}
                                className={`${
                                  completed === 100
                                    ? `text-success`
                                    : `text-warning`
                                }`}
                              />
                            )}
                          </div>
                        </div>
                        <div className="-mt-4 -mb-2">
                          <ClassBadge cls={cls} />
                        </div>
                        {/* <div className="flex w-full items-center">
                          <div
                            className={`flex-grow border ${classBorderColor[cls]}`}
                          />
                          <div
                            className={`badge h-fit text-xs text-center w-fit border-2 bg-neutral/50 ${classBorderColor[cls]}`}
                          >
                            {cls}
                          </div>
                          <div
                            className={`flex-grow border ${classBorderColor[cls]}`}
                          />
                        </div> */}
                      </div>
                      <div>
                        <p className="font-bold">
                          [{device.code}] - {device.name}
                        </p>
                      </div>
                      <div className="md:h-20 text-ellipsis overflow-hidden">
                        {description || "Sin descripción"}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
