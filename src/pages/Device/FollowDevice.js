import { useDispatch, useSelector } from "react-redux";
import { deviceActions } from "../../actions/StoreActions";
import { useEffect, useState } from "react";

export default function FollowDevice() {
  const { userData } = useSelector((state) => state.people);
  const { selectedDevice } = useSelector((s) => s.devices);
  const [fetching, setFetching] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setFetching(false);
  }, [selectedDevice]);
  function handleCheck(e) {
    e.preventDefault();
    setFetching(true);
    dispatch(
      deviceActions.updateDevice({
        ...selectedDevice,
        following: !selectedDevice.following,
        follower: userData.user,
        followDate: new Date(),
      })
    );
  }

  return (
    <div
      key={selectedDevice.code}
      className={`${
        selectedDevice.following ? "bg-dark text-light" : ""
      } btn px-2 rounded-2`}
    >
      <div className="d-flex align-items-center gap-2">
        {fetching ? (
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <input
            style={{ transform: "scale(1.5)" }}
            type="checkbox"
            value=""
            id="flexCheckDefault"
            checked={selectedDevice.following}
            onChange={handleCheck}
            disabled={!["Admin", "Supervisor"].includes(userData.access)}
          />
        )}

        <label className="form-check-label" htmlFor="flexCheckDefault">
          Seguimiento
          {selectedDevice?.following ? (
            <i className="fas fa-chart-line ms-1" />
          ) : (
            ""
          )}
        </label>
      </div>
    </div>
  );
}
