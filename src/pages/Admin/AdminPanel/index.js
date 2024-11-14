import { useParams } from "react-router-dom";
import MenuOptions from "../../../components/MenuOptions";
import AdminPlan from "../Plan";
import AdminPlants from "../Plants";
import AdminUsers from "../Users";
import AdminCylinders from "../Cylinders";
import "./index.css";
import DeviceAdmin from "../Devices";
import WOList from "../../../components/lists/WorkOrderList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { callMostRecent } from "../../../actions/workOrderActions";
import { LoadExcel } from "../LoadExcel";
import { LoadFrequencies } from "../LoadFrequencies";

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
    <div className="adminBackground">
      <MenuOptions options={options} />
      <div className="d-flex flex-grow-1 overflow-auto">
        {selected === "usuarios" && <AdminUsers />}
        {selected === "equipos" && <DeviceAdmin />}
        {selected === "plantas" && <AdminPlants />}
        {selected === "plan" && <AdminPlan />}
        {selected === "garrafas" && <AdminCylinders />}
        {selected === "carga_excel" && <LoadExcel />}
        {selected === "carga_frecuencias" && <LoadFrequencies />}
        {!selected && (
          <div className="container-fluid p-0">
            <div className="col-12">
              <WOList mostRecent={mostRecent} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
