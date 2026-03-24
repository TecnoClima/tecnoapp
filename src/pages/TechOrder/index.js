import { useParams } from "react-router-dom";
import TechOrderForm from "../../components/workOrder/TechOrderForm";

export default function TechOrder() {
  const { orderCode } = useParams();
  return <TechOrderForm orderCode={orderCode} />;
}
