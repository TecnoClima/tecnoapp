import { useDispatch } from "react-redux";
import { peopleActions } from "../../../actions/StoreActions";
import worker from "../../../assets/icons/worker.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function UserCard(props) {
  const dispatch = useDispatch();
  const { user } = props;

  function setActive(e) {
    e.preventDefault();
    user.active = !user.active;
    dispatch(peopleActions.updateUser(user._id, { active: user.active }));
  }

  return (
    <>
      <div className="join w-full sm:w-[calc(50%-.5rem)] lg:w-[calc(33%-.5rem)]">
        <button
          onClick={() => props.editButton(user)}
          className={`join-item group btn flex-grow flex items-center gap-2 px-2 border min-h-fit h-full border-transparent ${
            user.active
              ? "hover:border-primary"
              : "border-transparent bg-base-content/50 hover:bg-base-content/75 opacity-50"
          }`}
        >
          <img src={worker} alt="worker" className="w-8 h-8" />
          <div className="w-20 flex-grow text-left relative">
            <p className="card-title text-capitalize">
              {user.name.toLowerCase()}
            </p>
            <div className="font-bold">{user.charge}</div>
            <FontAwesomeIcon
              icon={faPencil}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </button>
        {user.active ? (
          <button
            title="Desactivar"
            className="join-item btn btn-error btn-outline h-full"
            onClick={setActive}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
        ) : (
          <button
            title="Reactivar"
            className="join-item btn btn-info btn-outline h-full"
            onClick={setActive}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>
      <div className={`hidden  ${user.active ? "activeUser" : "inactiveUser"}`}>
        <div className="d-flex gap-2">
          <button
            className="btn btn-info rounded-circle"
            title="Editar"
            onClick={() => props.editButton(user)}
          >
            <i className="fas fa-pencil-alt"></i>
          </button>
          {user.active ? (
            <button
              onClick={(e) => {
                setActive(e);
              }}
              className="btn btn-danger rounded-circle "
              title="Desactivar"
            >
              <i className="fa fa-minus"></i>
            </button>
          ) : (
            <button
              onClick={(e) => {
                setActive(e);
              }}
              className="btn btn-success rounded-circle "
              title="Reactivar"
            >
              <i className="fa fa-plus"></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
