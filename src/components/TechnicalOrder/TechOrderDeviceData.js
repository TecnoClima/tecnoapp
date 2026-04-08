import { DataField } from "./TechOrderDataField";

export function TechOrderDeviceData({ device }) {
  const { code, name, location, type, clasification, service, costCenter } =
    device;
  return (
    <div>
      <div className="card-title uppercase underline mb-2">ACTIVOS</div>
      <div className="flex w-full flex-wrap gap-2 text-sm">
        <DataField label="Código">{code}</DataField>
        <DataField label="Equipo">{name}</DataField>
        <DataField label="Ubicación">{location}</DataField>
        <DataField label="Tipo">{type}</DataField>
        <DataField label="Clasificación">{clasification}</DataField>
        <DataField label="Tipo de Servicio">{service}</DataField>
        <DataField label="Centro de Costo">{costCenter}</DataField>
      </div>
    </div>
  );
}
