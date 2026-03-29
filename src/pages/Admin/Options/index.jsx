import { useSearchParams } from "react-router-dom";
import { AdminOptionsNav } from "../../../components/Admin/Options/OptionsNavigation";
import { OrderOptions } from "../../../components/Admin/Options/WorkOrders/OrderOptions";
import { SubtaskOptions } from "../../../components/Admin/Options/Subtasks/SubtaskOptions";
import { TechTaskTemplates } from "../../../components/Admin/Options/TechTaskTemplate/TechTaskTemplates";
import { adminOptionsTabs } from "../../../constants/routes";

export function AdminOptions() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const components = {
    Ordenes: <OrderOptions />,
    Subtareas: <SubtaskOptions />,
    Tareas: <TechTaskTemplates />,
  };

  return (
    <div className="page-container">
      <div className="page-title">Opciones</div>
      <AdminOptionsNav tabs={adminOptionsTabs} />
      <div className="flex-grow overflow-y-auto pt-4">
        {components[tab] || null}
      </div>
    </div>
  );
}
