import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { optionActions } from "../../../../actions/StoreActions";
import { OptionCard } from "./OptionCard";

export function OrderOptions() {
  const { list: optionList } = useSelector((state) => state.options);
  const dispatch = useDispatch();
  const targetCollection = "workOrder";
  useEffect(
    () => dispatch(optionActions.getList(targetCollection)),
    [dispatch],
  );
  const types = [...new Set(optionList.map((o) => o.type))];

  return (
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
    </div>
  );
}
