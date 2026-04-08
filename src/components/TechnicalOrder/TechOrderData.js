import { formatDate } from "../../utils/utils";
import { DataField } from "./TechOrderDataField";

function Section({ title, children }) {
  return (
    <div>
      <div className="card-title uppercase underline mb-2">{title}</div>
      <div className="flex w-full flex-wrap gap-2 rounded-box border p-4">
        {children}
      </div>
    </div>
  );
}

export function TechOrderData({ order }) {
  const {
    // code,
    // status,
    description,
    // supervisor,
    // responsible,
    registration,
    tech,
  } = order;
  const {
    //  generatedBy,
    planned,
  } = tech ?? {};

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* <Section title="Información general">
        <DataField label="Código">{code}</DataField>
        <DataField label="Estado">{status}</DataField>
      </Section>

      <Section title="Personas">
        <DataField label="Supervisor">{supervisor?.name}</DataField>
        <DataField label="Responsable">{responsible?.name}</DataField>
        <DataField label="Generado por">{generatedBy?.name}</DataField>
      </Section>
 */}
      <Section title="Tarea Planificada">
        <DataField label="Descripción">{description}</DataField>
        <DataField label="Fecha registro">
          {formatDate(registration?.date)}
        </DataField>
        <DataField label="Prioridad">
          {planned?.priority?.label || "-"}
        </DataField>
        <DataField label="Activador">
          {planned?.activator?.label || "-"}
        </DataField>
        <DataField label="Fecha y hora de Inicio">
          {formatDate(planned?.startDate) || ""}
        </DataField>
        <DataField label="Fecha y hora de Fin">
          {formatDate(planned?.endDate) || ""}
        </DataField>
        <DataField label="Tiempo de trabajo">
          {planned?.worktime || "-"}
        </DataField>
        <DataField label="Tiempo de parada">
          {planned?.downtime || "-"}
        </DataField>
        <DataField label="Solicitante">{planned?.requester || "-"}</DataField>
      </Section>
    </div>
  );
}
