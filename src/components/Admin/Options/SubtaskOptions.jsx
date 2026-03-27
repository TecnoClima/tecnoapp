import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { optionActions } from "../../../actions/StoreActions";
import { appConfig } from "../../../config";
import { CreateOrderOptionValues } from "./CreateOrderOptionValues";
import { OptionCard } from "./OptionCard";
import { SubTaskList } from "./SubTaskList";
const { headersRef } = appConfig;

const RESULT_TYPES = [
  { value: "boolean", label: "Sí / No" },
  { value: "number", label: "Número" },
  { value: "text", label: "Texto" },
  { value: "gps", label: "GPS" },
];

const GROUPS = ["Sitio", "Equipo"];

const emptyTask = () => ({
  group: "Equipo",
  procedure: "",
  resultType: "boolean",
});

export function SubtaskOptions() {
  const { list: optionList } = useSelector((state) => state.options);
  const dispatch = useDispatch();
  const targetCollection = "subTask";
  useEffect(
    () => dispatch(optionActions.getList(targetCollection)),
    [dispatch],
  );
  const types = [...new Set(optionList.map((o) => o.type))];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {types.map((type) => {
          const typeOptions = optionList.filter((o) => o.type === type);
          return (
            <OptionCard
              key={type}
              options={typeOptions}
              targetCollection={targetCollection}
              type={type}
            />
          );
        })}
        <SubTaskList />
      </div>
    </div>
  );
}
