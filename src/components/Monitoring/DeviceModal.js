import {
  faPowerOff,
  faThermometerEmpty,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ModalBase from "../../Modals/ModalBase";
import { monitorActions } from "../../actions/monitoringActions";
import Loading from "../Loading";

const icons = {
  temperaturaok: (
    <FontAwesomeIcon icon={faThermometerEmpty} className="text-success" />
  ),
  temperaturabaja: (
    <FontAwesomeIcon icon={faThermometerEmpty} className="text-info" />
  ),
  temperaturaalta: (
    <FontAwesomeIcon icon={faThermometerEmpty} className="text-error" />
  ),
  on: <FontAwesomeIcon icon={faPowerOff} className="text-success" />,
  off: <FontAwesomeIcon icon={faPowerOff} className="text-base-content/50" />,
};

export default function DeviceModal({ onClose, open, empresa, equipo }) {
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!equipo || !empresa) return;
    setLoading(true);
    monitorActions.deviceDetail(
      {
        empresa,
        equipo,
      },
      (data) => {
        setDeviceData(data);
        setLoading(false);
      }
    );
  }, [equipo, empresa]);

  return (
    <ModalBase
      className="md:px-8 md:pb-6"
      title={`Detalle ${equipo}`}
      {...{ onClose, open }}
    >
      {loading && (
        <div className="flex w-full h-40">
          <div className="flex gap-2 m-auto">
            <Loading />
            <span>Cargando...</span>
          </div>
        </div>
      )}
      {!!deviceData?.[0] && (
        <div className="flex flex-col gap-2">
          {deviceData.map(({ nombre, imagen, tipo, valor }) => {
            const iconIndex = imagen.split(".")[0];

            return (
              <div
                className="flex w-full border-b border-base-content/15"
                key={nombre}
              >
                <div className="w-40 flex-grow">{nombre}</div>
                <div className="w-5 flex-grow">{valor} °C</div>
                <div title="iconIndex" className="text-center w-5">
                  {icons[iconIndex]}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ModalBase>
  );
}
