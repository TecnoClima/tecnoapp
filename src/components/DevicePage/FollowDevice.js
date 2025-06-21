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
        selectedDevice.following ? "" : " btn-outline"
      } btn-neutral btn btn-sm px-2 rounded-lg flex-grow md:flex-grow-0 justify-start`}
      onClick={handleCheck}
      disabled={!["Admin", "Supervisor"].includes(userData.access)}
    >
      <div className="flex items-center gap-4">
        {fetching ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          <input
            style={{ transform: "scale(1.5)" }}
            type="checkbox"
            value=""
            id="flexCheckDefault"
            checked={selectedDevice.following || false}
            onChange={() => {}}
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
