import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { techTaskTemplateActions } from "../../../../actions/StoreActions";
import { appConfig } from "../../../../config";
import { SearchInput } from "../../../ui/SearchInput";
import { CreateTaskTemplate } from "./CreateTaskTemplate";
import { SubtaskList } from "./SubtaskList";
const { headersRef } = appConfig;

export function TechTaskTemplates({ handleSelect, editable = false }) {
  const { list: techTaskTemplates } = useSelector(
    (state) => state.techTaskTemplates,
  );
  const [searchKey, setSearchKey] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => dispatch(techTaskTemplateActions.getList()), [dispatch]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center justify-between text-base-content w-full">
        <div className="card-title">Tareas</div>
        <div className="flex gap-2 items-center">
          <div className="w-80 max-w-full ml-auto">
            <SearchInput searchKey={searchKey} setSearchKey={setSearchKey} />
          </div>
          <CreateTaskTemplate />
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
              className={`card rounded-xl bg-base-content/5 border border-transparent hover:border-primary hover:bg-base-content/10 px-4 py-1 ${isSelected ? "" : "cursor-pointer"}`}
            >
              <div className="w-full flex items-center">
                <button
                  className={`flex items-center gap-4 mr-auto ${isSelected ? "" : "w-full h-full"}`}
                  onClick={() => setSelectedTemplate(isSelected ? null : _id)}
                >
                  <div className="card-title">{name}</div>
                </button>
                {isSelected && handleSelect && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleSelect(template)}
                  >
                    Seleccionar
                  </button>
                )}
                {isSelected && editable && (
                  <CreateTaskTemplate editTemplateTask={template} />
                )}
                <button
                  className="ml-4"
                  onClick={() => setSelectedTemplate(isSelected ? null : _id)}
                >
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition-transform duration-300 ${isSelected ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              <SubtaskList subtasks={subtasks} isSelected={isSelected} />
            </div>
          );
        })}
    </div>
  );
}
