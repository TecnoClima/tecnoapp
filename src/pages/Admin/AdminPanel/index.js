import { useParams } from "react-router-dom";
import MenuOptions from "../../../components/MenuOptions";
import AdminPlan from "../Plan";
import AdminPlants from "../Plants";
import AdminUsers from "../Users";
import AdminCylinders from "../Cylinders";
import DeviceAdmin from "../Devices";
import WOList from "../../../components/lists/WorkOrderList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { callMostRecent } from "../../../actions/workOrderActions";
import { LoadExcel } from "../LoadExcel";
import { LoadFrequencies } from "../LoadFrequencies";
import { planActions } from "../../../actions/StoreActions";
import WorkOrderListItem from "../../../components/workOrder/WorkOrderListItem";

export default function AdminPanel() {
  const { selected } = useParams();
  const options = [
    { caption: "Usuarios", url: "/admin/usuarios" },
    { caption: "Equipos", url: "/admin/equipos" },
    { caption: "Plantas", url: "/admin/plantas" },
    { caption: "Plan", url: "/admin/plan" },
    { caption: "Garrafas", url: "/admin/garrafas" },
    { caption: "Cargar Equipos", url: "/admin/carga_excel" },
    { caption: "Cargar Frecuencias", url: "/admin/carga_frecuencias" },
  ];
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
