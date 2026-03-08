import { DataField } from "./TechOrderDataField";

export default function TechOrderFailureData({ order }) {
  const {
    failureType,
    failureCause,
    failureDetection,
    failureSeverity,
    otherDevicesInterruptionTime,
    causedDamageType,
  } = order;
  return (
    <div className="div border-collapse">
      <div className="flex w-full border">
        <DataField label="Tipo de falla">{failureType}</DataField>
      </div>
      <div className="flex w-full border">
        <DataField label="Causa de FAlla">{failureCause}</DataField>
      </div>
      <div className="flex w-full border">
        <DataField label="Método de detección de falla">
          {failureDetection}
        </DataField>
      </div>

      <div className="flex w-full border">
        <DataField label="Severidad de las fallas">{failureSeverity}</DataField>
      </div>
      <div className="flex w-full border">
        <DataField label="Tiempo de interrupción a otros activos">
          {otherDevicesInterruptionTime}
        </DataField>
      </div>
      <div className="flex w-full border">
        <DataField label="Tipo de daño causado">{causedDamageType}</DataField>
      </div>
    </div>
  );
}
