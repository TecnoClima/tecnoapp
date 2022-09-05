import { useDispatch } from "react-redux";
import { updateUser } from "../../../actions/peopleActions";
import { peopleActions } from "../../../actions/StoreActions";
import worker from "../../../assets/icons/worker.png";
import "./index.css";

export default function UserCard(props) {
  const dispatch = useDispatch();
  const { user } = props;

  function setActive(e) {
    e.preventDefault();
    user.active = !user.active;
    dispatch(peopleActions.updateUser(user._id, { active: user.active }));
  }

  return (
    <div className={`userCard ${user.active ? "activeUser" : "inactiveUser"}`}>
      <img src={worker} alt="" className="cardMainImg" />
      <div className="cardMainCaption">{user.name}</div>
      <div>
        <b>{user.charge}</b>
      </div>
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
  );
}
