import { faCommentDots, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function SubtaskItem({ subtask, onChange }) {
  const {
    _id,
    order,
    procedure: task,
    options: availableOptions,
    value: customValue,
    resultType,
    comments,
  } = subtask;
  const [enableComment, setEnableComment] = useState(!!comments);

  function handleOption(e) {
    onChange(_id, { selectedOption: e.target.value, customValue: "" });
  }

  function handleCustomValue(e) {
    onChange(_id, { customValue: e.target.value, selectedOption: "" });
  }

  function handleComments(e) {
    onChange(_id, { comments: e.target.value });
  }

  return (
    <div
      // className={`flex flex-col gap-1 p-2 border-l-4 ${borderClass} bg-base-100 rounded-r-md transition-colors`}
      className={`flex flex-col gap-1 p-2 bg-base-100/40 rounded-md transition-colors w-full`}
    >
      {/* Top row: task name + inputs + result buttons */}
      <div className="flex flex-wrap md:flex-nowrap items-center md:justify-between gap-2 w-full">
        <div className="w-full md:w-1/2 text-sm font-medium min-w-[8rem]">
          {task}
        </div>

        <div className="flex w-full md:w-fit gap-2">
          {availableOptions?.length > 0 ? (
            <div className="flex">
              {availableOptions.map((opt) => {
                const isSelected = opt === customValue;
                return (
                  <button
                    className={`btn btn-primary btn-sm w-20 ${isSelected ? "" : "btn-outline"}`}
                    key={opt}
                    value={opt}
                    onClick={handleOption}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              className="input input-sm input-bordered w-60"
              placeholder="Valor"
              value={customValue}
              onChange={handleCustomValue}
            />
          )}
          {!comments && (
            <button
              onClick={() => setEnableComment(true)}
              className={`btn btn-sm btn-info btn-outline ml-auto md::ml-0`}
            >
              <FontAwesomeIcon icon={faPlus} />
              <FontAwesomeIcon icon={faCommentDots} />
            </button>
          )}
        </div>
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
