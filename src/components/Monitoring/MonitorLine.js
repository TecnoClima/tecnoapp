import {
  faChevronRight,
  faExclamationTriangle,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import tecnoclima from "../../assets/icons/logoTecnoclima.png";
import ternium from "../../assets/icons/ternium.jpg";
import DeviceModal from "./DeviceModal";

const images = {
  ternium,
  "logo siderar": ternium,
  Screenshot_7: tecnoclima,
};

export default function MonitorLine({
  imagen,
  empresa,
  area,
  sector,
  equipo,
  nombre,
  sensores,
}) {
  const [modalData, setModalData] = useState(null);
  const imageName = imagen.split(".")[0];

  function clickDevice(e) {
    e.preventDefault();
    setModalData({ equipo, empresa });
  }

  return (
    <div className="flex flex-wrap items-center lg:items-end border border-base-content/20 hover:border-base-content/50 rounded-box w-full p-4 gap-4">
      {!!modalData?.equipo && (
        <DeviceModal
          open={!!modalData}
          onClose={() => setModalData(null)}
          {...modalData}
        />
      )}
      <div className="flex flex-col gap-2 w-80 flex-grow">
        <div className="flex items-center gap-4 mb-auto">
          <button className="flex items-center" onClick={clickDevice}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-2xl text-warning"
            />
          </button>
          <img src={images[imageName]} alt={imageName} className="w-32 h-fit" />
        </div>
        <div className="flex flex-wrap w-full gap-y-1 gap-x-2 max-w-xl">
          <div className="w-60 flex-grow bg-base-content/10 p-1 rounded-md">
            <div className="flex gap-2 items-center text-xs">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <div>{area.toUpperCase()}</div>
              <FontAwesomeIcon icon={faChevronRight} />
              <div>{sector.toUpperCase()}</div>
            </div>
            <div className="font-bold px-2 text-lg">{equipo}</div>
          </div>
          <div className="w-60 flex-grow bg-base-content/10 p-1 rounded-md">
            <div className="flex gap-2 items-center text-xs">Servicio</div>
            {nombre}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] w-80 flex-grow gap-2">
        {sensores.map(
          ({
            color,
            nombre,
            registrador,
            relacion,
            sensor_id,
            tipo,
            valorTemp,
          }) => (
            <button className="join w-full flex-grow text-sm" key={nombre}>
              <div className="flex bg-primary/20 w-3/5 join-item text-sm px-2 items-center">
                {nombre}
              </div>
              <div className="flex items-center bg-base-content/20 w-2/5 join-item text-sm px-2 h-6">
                {valorTemp}
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}
