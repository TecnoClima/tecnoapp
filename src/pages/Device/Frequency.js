import { useDispatch, useSelector } from "react-redux";
import { appConfig } from "../../config";
import { useEffect, useState } from "react";
import { deviceActions } from "../../actions/StoreActions";
import Loading from "../../components/Loading";

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
    <div className="flex gap-2 items-center">
      <div className="join flex-grow-1">
        <label
          className="label text-sm join-item h-8 bg-primary/20 px-2"
          htmlFor="inputGroupSelect01"
        >
          Frecuencia MTO
        </label>

        <select
          value={selectedDevice.frequency || ""}
          className="select rounded-2 join-item select-sm select-bordered"
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
      {isFetching && <Loading />}
    </div>
  );
}
