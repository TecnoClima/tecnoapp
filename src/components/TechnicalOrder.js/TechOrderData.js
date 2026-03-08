import { DataField } from "./TechOrderDataField";

export function TechOrderData({ order }) {
  const {
    description,
    programDate,
    orderClass,
    priority,
    activator,
    class1,
    class2,
    registrationDate,
    initDate,
    endDate,
    noWorkTime,
    solicitor,
    solicitation,
    notes,
  } = order;
  return (
    <div>
      <div className="card-title uppercase underline mb-2">{`Tarea ${
        activator === "Plan" ? " " : " no "
      } planificada`}</div>
      <div className="flex w-full flex-wrap gap-2 rounded-box border p-4">
        <DataField label="Descripción">{description}</DataField>
        <DataField label="Fecha Programada">{programDate}</DataField>
        <DataField label="Tipo de Trabajo">{orderClass}</DataField>
        <DataField label="Prioridad">{priority}</DataField>
        <DataField label="Activador">{activator}</DataField>
        <DataField label="Clasificación 1">{class1}</DataField>
        <DataField label="Clasificación 2">{class2}</DataField>
        <DataField label="Fecha del evento">{registrationDate}</DataField>
        <DataField label="Fecha y hora de inicio">{initDate}</DataField>
        <DataField label="Fecha y hora de finalización">{endDate}</DataField>
        <DataField label="Tiempo total de trabajo">
          {endDate - initDate}
        </DataField>
        <DataField label="Tiempo fuera de Servicio">{noWorkTime}</DataField>
        <DataField label="Solicitado por">{solicitor.name}</DataField>
        <DataField label="Número de solicitud">{solicitation}</DataField>
        <DataField label="Notas">{notes}</DataField>
      </div>
    </div>
  );
}
