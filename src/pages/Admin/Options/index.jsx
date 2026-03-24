import { AdminOptionsNav } from "../../../components/Admin/OptionsNavigation";
import { OrderOptions } from "./OrderOptions";

export function AdminOptions() {
  return (
    <div className="page-container">
      <div className="page-title">Opciones</div>
      <AdminOptionsNav />
      <OrderOptions />
    </div>
  );
}
