import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callMostRecent } from "../../../actions/workOrderActions";
import WOList from "../../../components/lists/WorkOrderList";

export default function AdminPanel() {
  const { mostRecent } = useSelector((state) => state.workOrder);
  const dispatch = useDispatch();

  useEffect(
    () =>
      dispatch(callMostRecent({ conditions: { class: "Reclamo" }, limit: 10 })),
    [dispatch]
  );

  return (
    <div className="flex h-full w-full">
      <div className="flex-grow overflow-auto p-4">
        <WOList mostRecent={mostRecent} />
      </div>
    </div>
  );
}
