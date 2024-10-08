import { useDispatch, useSelector } from "react-redux";
import { appConfig } from "../../config";
import { useEffect, useState } from "react";
import { deviceActions } from "../../actions/StoreActions";

export default function SetFrequency() {
  const [isFetching, setIsFetching] = useState(false);
  const { selectedDevice } = useSelector((s) => s.devices);
  const { userData } = useSelector((state) => state.people);
  const { frequencies } = appConfig;
  const dispatch = useDispatch();

  function handleSelect(e) {
    e.preventDefault();
    const { value } = e.target;
    setIsFetching(true);
    dispatch(
      deviceActions.updateDevice({
        ...selectedDevice,
        frequency: value,
      })
    );
  }

  useEffect(() => {
    if (selectedDevice) {
      setIsFetching(false);
    }
  }, [selectedDevice]);

  return (
    <div className="d-flex gap-2 align-items-center">
      <div className="input-group">
        <div className="input-group-prepend flex-grow-1">
          <label className="input-group-text" for="inputGroupSelect01">
            Frecuencia MTO
          </label>
        </div>
        <select
          value={selectedDevice.frequency || ""}
          className="custom-select rounded-2"
          id="inputGroupSelect01"
          onChange={handleSelect}
          disabled={
            isFetching || !["Admin", "Supervisor"].includes(userData.access)
          }
        >
          <option value="" selected>
            Sin Seleccionar
          </option>
          {frequencies.map(({ weeks, frequency }, i) => (
            <option key={i} value={weeks}>
              {frequency}
            </option>
          ))}
        </select>
      </div>
      {isFetching && (
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </div>
  );
}
