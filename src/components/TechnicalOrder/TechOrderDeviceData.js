import { DataField } from "./TechOrderDataField";

export function TechOrderDeviceData({ device }) {
  const line = device?.line;
  const area = line?.area;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="card-title uppercase underline">Activo</div>
      <div className="flex flex-wrap gap-2 p-4 text-sm">
        <DataField label="Código equipo">{device?.code}</DataField>
        <DataField label="Equipo">{device?.name}</DataField>
        <DataField label="Ubicación">{`${area?.plant?.name} > ${area?.name} > ${line?.name}`}</DataField>
        <DataField label="Clasificacion">{device?.category}</DataField>
        <DataField label="Servicio">{device?.service}</DataField>
        <DataField label="Tipo">{device?.type}</DataField>
        {!!device?.costCenter && (
          <DataField label="Centro de Costo">{device?.costCenter}</DataField>
        )}
      </div>
    </div>
  );
}
