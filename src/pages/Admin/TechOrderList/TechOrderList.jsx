import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { workOrderActions } from "../../../actions/StoreActions";
import WorkOrderListItem from "../../../components/workOrder/WorkOrderListItem";

export function TechOrderList() {
  const { workOrderList } = useSelector((state) => state.workOrder);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(workOrderActions.getList(2026));
  }, [dispatch]);

  useEffect(() => {
    console.log("workOrderList", workOrderList);
  }, [workOrderList]);

  return (
    <div className="page-container">
      <div className="flex flex-col h-20 flex-grow gap-4">
        <div className="flex items-center flex-wrap w-full">
          <div className="page-title">Lista de órdenes técnicas</div>
          <Link
            to={"/orden-tecnica/nueva"}
            className="btn btn-success btn-sm ml-auto"
          >
            Crear órden Técnica
          </Link>
        </div>
        {workOrderList
          .filter(({ type }) => type === "tech")

          .map((order) => (
            <WorkOrderListItem key={order.code} order={order} />
          ))}
      </div>
    </div>
  );
}
