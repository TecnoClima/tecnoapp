import { useDispatch, useSelector } from "react-redux";
import { optionActions } from "../../../actions/StoreActions";
import { useEffect } from "react";
import { CreateOrderOptionValues } from "./CreateOrderOptionValues";
import { appConfig } from "../../../config";
const { headersRef } = appConfig;

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
        const order =
          (Math.max(...typeOptions.map(({ order }) => order)) || 0) + 1;

        return (
          <div
            key={type}
            className="relative card w-full bg-base-content/5 p-2"
          >
            <div className="card-title mb-3">{headersRef[type] || type}</div>
            <div className="grid grid-cols-5 gap-2">
              {typeOptions.map((o) => (
                <div key={o._id} className="badge w-full h-6">
                  {o.label}
                </div>
              ))}
            </div>
            <div className="absolute top-2 right-2">
              <CreateOrderOptionValues
                order={order}
                targetCollection={targetCollection}
                type={type}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
