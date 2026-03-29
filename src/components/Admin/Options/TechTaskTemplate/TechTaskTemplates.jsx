import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { techTaskTemplateActions } from "../../../../actions/StoreActions";
import { appConfig } from "../../../../config";
import { SearchInput } from "../../../ui/SearchInput";
const { headersRef } = appConfig;

export function TechTaskTemplates({ handleSelect }) {
  const { list: techTaskTemplates } = useSelector(
    (state) => state.techTaskTemplates,
  );
  const [searchKey, setSearchKey] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => dispatch(techTaskTemplateActions.getList()), [dispatch]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center text-base-content w-full">
        <div className="w-80 max-w-full ml-auto">
          <SearchInput searchKey={searchKey} setSearchKey={setSearchKey} />
        </div>
      </div>
      {techTaskTemplates
        .filter(({ name }) =>
          searchKey?.length > 2
            ? name.toLowerCase().includes(searchKey.toLowerCase())
            : true,
        )
        .map((template) => {
          const { _id, name, subtasks } = template;
          const isSelected = selectedTemplate === _id;
          return (
            <div
              key={_id}
              className={`card bg-base-content/5 border border-transparent hover:border-primary hover:bg-base-content/10 p-4 ${isSelected ? "" : "cursor-pointer"}`}
            >
              <div className="w-full flex justify-between">
                <button
                  className={`flex items-center gap-4 ${isSelected ? "" : "w-full h-full"}`}
                  onClick={() => setSelectedTemplate(isSelected ? null : _id)}
                >
                  <div className="card-title">{name}</div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition-transform duration-300 ${isSelected ? "rotate-180" : ""}`}
                  />
                </button>
                {isSelected && handleSelect && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleSelect(template)}
                  >
                    Seleccionar
                  </button>
                )}
              </div>
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
            </div>
          );
        })}
    </div>
  );
}
