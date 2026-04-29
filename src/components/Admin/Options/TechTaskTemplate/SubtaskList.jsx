import { Fragment } from "react/jsx-runtime";
import { appConfig } from "../../../../config";
const { headersRef } = appConfig;

export function SubtaskList({ subtasks, isSelected }) {
  return (
    <div
      className={`flex flex-col sm:grid sm:grid-cols-[8rem,auto,8rem] text-xs transition-height duration-300 ${isSelected ? "h-auto" : "h-0 overflow-y-hidden"}`}
    >
      {subtasks.map((subTask) => (
        <Fragment key={subTask._id}>
          <div className="hidden sm:block border-b border-dotted border-base-content/20">
            {subTask.devicePart?.label}
          </div>
          <div className="border-b border-dotted border-base-content/20">
            {subTask.procedure}
          </div>
          <div className="border-b border-dotted border-base-content/20 hidden sm:block">
            {subTask.options?.length > 1
              ? subTask.options.join(" / ")
              : `Ingresar ${headersRef[subTask.resultType]}`}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
