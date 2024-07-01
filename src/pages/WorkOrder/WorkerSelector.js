import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions } from "../../actions/StoreActions";

export default function WorkerSelector({
  label,
  defaultValue,
  action,
  permissions,
}) {
  const [selected, setSelected] = useState(`${defaultValue}`);
  const [requested, setRequested] = useState(false);
  const { workersList } = useSelector((s) => s.people);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!workersList.length && !requested) {
      dispatch(peopleActions.getWorkers());
      setRequested(true);
    }
  }, [workersList, requested, dispatch]);

  function handleChange(e) {
    e.preventDefault();
    const { value } = e.target;
    setSelected(value);
    action && action(value);
  }

  return (
    <>
      <div className="position-relative w-100">
        <div className="input-group">
          <span className="input-group-text" id="inputGroup-sizing-default">
            {label}
          </span>
          {permissions?.admin ||
          permissions?.author ||
          permissions?.supervisor ? (
            <select
              className="form-select"
              value={selected}
              onChange={handleChange}
              disabled={!workersList.length}
            >
              <option value="">Sin Seleccionar</option>
              {workersList.map(({ idNumber, name }, i) => (
                <option key={i} value={idNumber}>
                  ({idNumber}) - {name}
                </option>
              ))}
            </select>
          ) : (
            <span className="input-group-text fw-bold">
              {workersList.find((w) => w.idNumber == selected)?.name ||
                "Sin Asignar"}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
