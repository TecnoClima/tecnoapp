import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { workOrderActions } from "../../actions/StoreActions";
import { TechOrderData } from "../../components/TechnicalOrder/TechOrderData";
import { DataField } from "../../components/TechnicalOrder/TechOrderDataField";
import { TechOrderDeviceData } from "../../components/TechnicalOrder/TechOrderDeviceData";
import TechOrderFailureData from "../../components/TechnicalOrder/TechOrderFailureData";
import TechOrderHeader from "../../components/TechnicalOrder/TechOrderHeader";
import { TechOrderSignatures } from "../../components/TechnicalOrder/TechOrderSignatures";
import { TechOrderSubTaskList } from "../../components/TechnicalOrder/TechOrderSubTaskList";
import { usePrintSignatures } from "../../hooks/print.hooks";

export default function TechnicalOrder() {
  const technicalOrder = useRef(null);
  const adjustSignatures = usePrintSignatures();
  const { code } = useParams();

  const { orderDetail: order } = useSelector((s) => s.workOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(workOrderActions.searchWO(code));
  }, [code, dispatch]);

  useEffect(() => console.log("order", order), [order]);

  function handlePrint(e) {
    e.preventDefault();
    adjustSignatures();
    window.print();
  }

  useReactToPrint({
    contentRef: technicalOrder,
    documentTitle: `OT-${order?.code ?? code}`,
  });

  if (!order.code) return null;

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
        <TechOrderHeader code={order.code} date={order.registration?.date} />
        <div className="flex w-full flex-wrap rounded-box border p-4 gap-2">
          <DataField label="Generó">{order.tech?.generatedBy?.name}</DataField>
          <DataField label="Responsable">{order.responsible?.name}</DataField>
          <DataField label="Duración estimada">{`${order.tech?.estimatedDuration} horas`}</DataField>
          <DataField label="Fecha">
            {order.registration?.date?.split("T")[0]}
          </DataField>
        </div>
        <TechOrderDeviceData device={order.device} />
        <TechOrderData order={order} />
        <TechOrderSubTaskList subtasks={order.tech?.subtasks} />
        <TechOrderFailureData diagnostics={order.tech?.diagnostics} />
        <div className="push-signatures" />
        <TechOrderSignatures order={order} />
      </div>
    </>
  );
}
