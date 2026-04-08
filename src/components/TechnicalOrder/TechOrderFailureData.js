import { DataField } from "./TechOrderDataField";

export default function TechOrderFailureData({ diagnostics }) {
  return (
    <div>
      <div className="card-title uppercase underline mb-2">Diagnóstico</div>
      <div className="border-collapse">
        <div className="flex w-full border px-2 py-1">
          <DataField label="Diagnóstico">
            {diagnostics?.diagnostics || "-"}
          </DataField>
        </div>

        {diagnostics.failureType && (
          <div className="flex w-full border px-2 py-1">
            <DataField label="Tipo de falla">
              {diagnostics.failureType?.label}
            </DataField>
          </div>
        )}
        {diagnostics.cause && (
          <div className="flex w-full border px-2 py-1">
            <DataField label="Causa de FAlla">
              {diagnostics.cause?.label}
            </DataField>
          </div>
        )}
        {diagnostics.method && (
          <div className="flex w-full border px-2 py-1">
            <DataField label="Método de detección de falla">
              {diagnostics.method?.label}
            </DataField>
          </div>
        )}

        {diagnostics.severity && (
          <div className="flex w-full border px-2 py-1">
            <DataField label="Severidad de las fallas">
              {diagnostics.severity?.label}
            </DataField>
          </div>
        )}
        <div className="flex w-full border px-2 py-1">
          <DataField label="Tiempo de interrupción a otros activos">
            {diagnostics.assetsDowntime || "-"}
          </DataField>
        </div>
        {diagnostics.damageType && (
          <div className="flex w-full border px-2 py-1">
            <DataField label="Tipo de daño causado">
              {diagnostics.damageType?.label}
            </DataField>
          </div>
        )}
      </div>
    </div>
  );
}
