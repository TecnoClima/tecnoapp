import { useSearchParams } from "react-router-dom";
import { AdminOptionsNav } from "../../../components/Admin/Options/OptionsNavigation";
import { OrderOptions } from "../../../components/Admin/Options/OrderOptions";
import { SubtaskOptions } from "../../../components/Admin/Options/SubtaskOptions";
import { TechTaskTemplates } from "../../../components/Admin/Options/TechTaskTemplates";

export function AdminOptions() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const isWorkOrder = tab === "Ordenes";
  const isSubtasks = tab === "Subtareas";
  const istechTasks = tab === "Tareas";

  return (
    <div className="page-container">
      <div className="page-title">Opciones</div>
      <AdminOptionsNav />
      <div className="flex-grow overflow-y-auto pt-4">
        {isWorkOrder && <OrderOptions />}
        {isSubtasks && <SubtaskOptions />}
        {istechTasks && <TechTaskTemplates />}
      </div>
    </div>
  );
}
