import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStrategies } from "../../../actions/planActions";
import NewProgram from "../../forms/NewProgram";
import "./index.css";

const ProgramCard = ({ strategy }) => {
  const [edit, setEdit] = useState(false);

  function openEdit(e) {
    if (e) e.preventDefault();
    setEdit(true);
  }
  function closeEdit(e) {
    if (e) e.preventDefault();
    setEdit(false);
  }

  return (
    <div className="col-sm-3 mb-3 text-center">
      <div className="container bg-warning bg-opacity-25 d-flex flex-column justify-content-between rounded-3 h-100 pb-1">
        <div className="row">
          <div className="col" style={{ fontSize: "70%" }}>
            {`${strategy.plant} - ${strategy.year}`}
          </div>
        </div>
        <div className="row bg-secondary rounded-3">
          <div className="col text-light">{strategy.name}</div>
        </div>
        <div className="row mt-auto mb-auto">
          <div className="col pt-2 pb-2">{strategy.description}</div>
        </div>
        <div className="row mt-auto mb-auto p-0">
          <div className="col">{strategy.supervisor.name}</div>
        </div>
        <div className="row d-flex">
          <div className="col  d-grid gap-2 p-0">
            <button className="btn btn-info" onClick={openEdit}>
              <i className="fas fa-pen" />
            </button>
            {edit && <NewProgram close={closeEdit} editProgram={strategy} />}
          </div>
          <div className="col d-grid gap-2 p-0">
            <button className="btn btn-danger">
              <i className="fas fa-trash-alt" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProgramManagement(props) {
  const [create, setCreate] = useState(false);
  const { plant, year } = useSelector((state) => state.data);
  const { programList } = useSelector((state) => state.plan);
  const dispatch = useDispatch();

  useEffect(
    () => dispatch(getStrategies({ plant, year })),
    [dispatch, plant, year]
  );

  return (
    <div className="container bg-light">
      <button
        className="btn btn-outline-success m-1"
        onClick={() => setCreate(!create)}
      >
        Crear Programa
      </button>
      {create && (
        <NewProgram close={() => setCreate(!create)} plant={props.plant} />
      )}
      {programList && (
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h5>Programas</h5>
            </div>
          </div>
          <div className="row justify-content-center">
            {programList.map((element, index) => (
              <ProgramCard key={index} strategy={element} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
