import { faCommentDots, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSelector } from "react-redux";

import { resultTypes } from "../../../constants/techOrders";
import { OrderField } from "../OrderFields";
import { setPermissions } from "./permissions";

export default function SubtaskItem({ subtask, onChange, schemaOnly = false }) {
  const { _id, devicePart, procedure, resultType, options, value, comments } =
    subtask;
  const { userData } = useSelector((state) => state.people);
  const { orderDetail: order } = useSelector((state) => state.workOrder);

  const [enableComment, setEnableComment] = useState(!!comments);

  const permissions = setPermissions(userData, order);

  function handleValueChange(e) {
    onChange(_id, { value: e.target.value });
  }

  function handleComments(e) {
    const value = e.target.value;
    if (!value) setEnableComment(false);
    onChange(_id, { comments: value });
  }

  return (
    <div
      // className={`flex flex-col gap-1 p-2 border-l-4 ${borderClass} bg-base-100 rounded-r-md transition-colors`}
      className="flex flex-col gap-1 p-2 w-full"
    >
      {/* Top row: task name + inputs + result buttons */}
      <div className="flex flex-wrap md:flex-nowrap items-center md:justify-between gap-2 w-full">
        <div
          className={
            schemaOnly
              ? "flex flex-row-reverse md:flex-row items-center w-full md:flex-grow justify-between md:justify-start gap-4"
              : "flex flex-col"
          }
        >
          <div
            className={`text-xs w-32 ${schemaOnly ? "md:text-sm flex-none" : "sm:opacity-50"}`}
          >
            {devicePart?.label}
          </div>
          <div className="text-sm font-medium min-w-[8rem]">{procedure}</div>
        </div>
        {!!schemaOnly ? (
          <div className="text-sm flex-none">
            {resultTypes.find((rt) => rt.value === resultType)?.label}
          </div>
        ) : (
          <div className="flex w-full md:w-fit gap-2 flex-none">
            {options?.length > 0 ? (
              <div className="flex">
                {options.map((opt) => {
                  const isSelected = opt === value;
                  return (
                    <button
                      className={`btn btn-primary btn-sm w-20 ${isSelected ? "" : "btn-outline"}`}
                      key={opt}
                      value={opt}
                      onClick={handleValueChange}
                      disabled={!permissions.updateSubtasks}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="w-full md:w-64">
                <OrderField
                  className="w-full"
                  field={
                    resultTypes.find((rt) => rt.value === resultType)?.label
                  }
                  name={resultType}
                  placeholder="Valor"
                  value={value}
                  disabled={!permissions.updateSubtasks}
                  onInput={handleValueChange}
                />
              </div>
            )}
            {!comments && (
              <button
                onClick={() => setEnableComment(true)}
                className={`btn btn-xs md:btn-sm btn-info btn-outline ml-auto md::ml-0`}
                disabled={!permissions.updateSubtasks}
              >
                <FontAwesomeIcon icon={faPlus} />
                <FontAwesomeIcon icon={faCommentDots} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Comments */}
      {enableComment && (
        <input
          className="input input-sm input-bordered w-full"
          placeholder="Comentarios... (opcional)"
          value={comments}
          onChange={handleComments}
        />
      )}
    </div>
  );
}
