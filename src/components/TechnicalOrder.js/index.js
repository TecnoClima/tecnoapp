import TechOrderHeader from "./TechOrderHeader";
import { DataField } from "./TechOrderDataField";
import { TechOrderDeviceData } from "./TechOrderDeviceData";
import { TechOrderData } from "./TechOrderData";
import { TechOrderSubTaskList } from "./TechOrderSubTaskList";
import TechOrderFailureData from "./TechOrderFailureData";
import { TechOrderSignatures } from "./TechOrderSignatures";

export default function TechnicalOrder() {
  const order = {
    calification: 5,
    generator: { name: "Nicolas Andrada" },
    responsible: { name: "Matias Perez" },
    registrationDate: new Date().toLocaleDateString(),
    estimatedDuration: "2",
    device: {
      code: "GEN-001",
      name: "EQUIPO GENÉRICO 1",
      location: "AREA / LINEA / LUGAR DE SERVICIO",
      type: "SPLIT",
      // priority: "ALTA",
      // Código de Barras / Nfc
      clasification: "Equipos menores",
      service: "Oficina",
      costCenter: 285,
    },
    description: "Descripción de la orden",
    programDate: new Date().toLocaleDateString(),
    // orderClass: "Preventivo",
    priority: "Media",
    activator: "Plan",
    class1: "Preventivo",
    // class2,
    initDate: new Date().toLocaleDateString(),
    endDate: new Date().toLocaleDateString(),
    noWorkTime: "2",
    solicitor: { name: "Nicolas Andrada" },
    solicitation: undefined,
    notes: undefined,

    failureType: "Falla",
    failureCause: "Causa X",
    failureDetection: "Inspección",
    failureSeverity: "Alta",
    otherDevicesInterruptionTime: 30,
    causedDamageType: "Ninguno",

    realizedBy: { name: "Matias Perez" },
  };
  const {
    date,
    calification,
    generator,
    responsible,
    registrationDate,
    estimatedDuration,
  } = order;

  return (
    <div className="page-container gap-8">
      <TechOrderHeader calification={calification} date={date} />
      <div className="flex w-full flex-wrap rounded-box border p-4 gap-2">
        <DataField label="Generó">{generator.name}</DataField>
        <DataField label="Responsable">{responsible.name}</DataField>
        <DataField label="Duración estimada">{`${estimatedDuration} horas`}</DataField>
        <DataField label="Fecha">{registrationDate}</DataField>
      </div>
      <TechOrderDeviceData device={order.device} />
      <TechOrderData order={order} />
      <div className="flex flex-col gap-2">
        <TechOrderSubTaskList />
        <TechOrderFailureData order={order} />
      </div>
      {/* ADJUNTOS */}
      <TechOrderSignatures order={order} />
    </div>
  );
}
