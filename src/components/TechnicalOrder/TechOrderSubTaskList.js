import { Fragment } from "react";

export function TechOrderSubTaskList({ subtasks = [] }) {
  if (!subtasks.length) return null;

  return (
    <div>
      <div className="grid grid-cols-[auto,1fr,auto] w-full border border-collapse">
        <div className="col-span-3 border p-4 text-center text-lg font-bold">
          SUBTAREAS
        </div>
        <div className="font-bold border p-1">Parte / Lugar</div>
        <div className="font-bold border p-1">Procedimiento</div>
        <div className="font-bold border p-1">Valor</div>
        {subtasks.map((item, index) => (
          <Fragment key={index}>
            <div className="border p-1">{item.subtask?.devicePart.label}</div>
            <div className="border p-1">{item.subtask.procedure}</div>
            <div className="border p-1">
              {item.subtask.options ? (
                <div className="flex justify-center gap-6">
                  {item.subtask.options.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        name={option}
                        type="radio"
                        className="radio"
                        readOnly
                        checked={item.value === option}
                      />
                      {option}
                    </div>
                  ))}
                </div>
              ) : (
                <>{item.value}</>
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
