import logo from "../../assets/icons/logoTecnoclima.png";
import { companyData } from "../../constants/OrderData";
import { formatDate } from "../../utils/utils";

export default function TechOrderHeader({ code, date }) {
  const { name, cuit } = companyData;

  return (
    <div className="flex w-full items-center">
      <div className="w-60 flex-grow flex flex-col items-start">
        <img src={logo} alt="Tecnoclima Logo" className="w-60" />
      </div>
      <div className="w-60 flex-grow flex flex-col items-center">
        <span className="text-lg font-bold">{name}</span>
        <span className="text-sm">{cuit}</span>
        <span className="uppercase">Orden de trabajo técnica</span>
      </div>
      <div className="w-60 flex-grow flex flex-col items-end">
        <span className="font-bold">N°: {code}</span>
        <span>Fecha: {date.split("T")[0]}</span>
      </div>
    </div>
  );
}
