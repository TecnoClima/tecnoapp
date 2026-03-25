import { useSearchParams } from "react-router-dom";
import { AdminOptionsNav } from "../../../components/Admin/OptionsNavigation";
import { OrderOptions } from "../../../components/Admin/OrderOptions";
import { SubtaskOptions } from "../../../components/Admin/SubtaskOptions";

export function AdminOptions() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const isWorkOrder = tab === "Ordenes";
  const isSubtasks = tab === "Subtareas";

  return (
    <div className="page-container">
      <div className="page-title">Opciones</div>
      <AdminOptionsNav />
      <div className="flex-grow overflow-y-auto pt-4">
        {isWorkOrder && <OrderOptions />}
        {isSubtasks && <SubtaskOptions />}
      </div>
    </div>
  );
}
