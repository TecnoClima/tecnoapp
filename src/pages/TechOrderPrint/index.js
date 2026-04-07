import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { TechOrderData } from "../../components/TechnicalOrder.js/TechOrderData";
import { DataField } from "../../components/TechnicalOrder.js/TechOrderDataField";
import { TechOrderDeviceData } from "../../components/TechnicalOrder.js/TechOrderDeviceData";
import TechOrderFailureData from "../../components/TechnicalOrder.js/TechOrderFailureData";
import TechOrderHeader from "../../components/TechnicalOrder.js/TechOrderHeader";
import { TechOrderSignatures } from "../../components/TechnicalOrder.js/TechOrderSignatures";
import { TechOrderSubTaskList } from "../../components/TechnicalOrder.js/TechOrderSubTaskList";
import { usePrintSignatures } from "../../hooks/print.hooks";

export default function TechnicalOrder() {
  const technicalOrder = useRef(null);
  const adjustSignatures = usePrintSignatures();

  function handlePrint(e) {
    e.preventDefault();
    adjustSignatures();
    window.print();
  }
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

  const generatePDF = useReactToPrint({
    contentRef: technicalOrder,
    documentTitle: "MiDocumentoModerno",
  });

  return (
    <>
      <button
        className="absolute top-2 right-32 btn btn-info btn-outline btn-xs"
        onClick={handlePrint}
      >
        <FontAwesomeIcon icon={faPrint} />
        Imprimir
      </button>
      <div
        id="technicalOrder"
        ref={technicalOrder}
        className="page-container gap-8"
      >
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
        <div className="push-signatures" />

        <TechOrderSignatures order={order} />
      </div>
    </>
  );
}
