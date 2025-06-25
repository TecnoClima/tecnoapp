import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { planActions } from "../../../actions/StoreActions";
import NewProgram from "../../forms/NewProgram";
import { ErrorModal, SuccessModal } from "../../warnings";

const ProgramCard = ({ strategy }) => {
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();

  function openEdit(e) {
    if (e) e.preventDefault();
    setEdit(true);
  }
  function closeEdit(e) {
    if (e) e.preventDefault();
    setEdit(false);
  }

  return (
    <div className="card flex flex-row w-full bg-base-content/10 h-full rounded-md">
      <div className="flex flex-col gap-1 flex-grow p-2">
        <div className="text-xs text-center">{`${strategy.plant} - ${strategy.year}`}</div>
        <div className="font-bold text-center">{strategy.name}</div>
        <div className="bg-base-content/5 p-1 rounded-md text-sm w-full flex-grow text-base-content/75">
          {strategy.description}
        </div>
        {edit && <NewProgram close={closeEdit} editProgram={strategy} />}
        <div className="join text-sm w-full">
          <div className="join-item bg-base-100/50 px-2">Supervisor</div>
          <div className="join-item bg-base-content/10 px-2 flex-grow">
            {strategy.supervisor.name}
          </div>
        </div>
      </div>
      <div className="join join-vertical h-full">
        <button
          className="btn btn-sm btn-info btn-outline join-item flex-grow"
          onClick={openEdit}
        >
          <i className="fas fa-pen" />
        </button>
        <button
          className="btn btn-sm btn-error btn-outline join-item  flex-grow"
          onClick={() => dispatch(planActions.deleteStrategy(strategy.id))}
        >
          <i className="fas fa-trash-alt" />
        </button>
      </div>
    </div>
  );
};

export default function ProgramManagement(props) {
  const [create, setCreate] = useState(false);
  const { plant, year } = useSelector((state) => state.data);
  const { selectedPlant } = useSelector((state) => state.plants);
  const { programList, planResult } = useSelector((state) => state.plan);
  const dispatch = useDispatch();

  useEffect(
    () => dispatch(planActions.getStrategies({ plant, year })),
    [dispatch, plant, year]
  );

  return (
    <div className="px-2">
      {create && (
        <NewProgram close={() => setCreate(!create)} plant={props.plant} />
      )}
      {programList && (
        <div className="flex-grow border-base-content">
          <div className="flex items-center justify-between w-full flex-wrap">
            <div className="page-title">Programas</div>
            <button
              className="btn btn-success btn-outline btn-sm mb-3"
              onClick={() => setCreate(!create)}
            >
              <FontAwesomeIcon icon={faPlus} />
              Crear Programa
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programList
              .filter(({ plant }) => plant === selectedPlant.name)
              .map((element, index) => (
                <div key={index} className="w-full flex-grow">
                  <ProgramCard strategy={element} />
                </div>
              ))}
          </div>
          {planResult.error && planResult.id && (
            <ErrorModal
              message={planResult.error}
              open={true}
              close={() => dispatch(planActions.resetPlanResult())}
            />
          )}
          {planResult.success && planResult.id && (
            <SuccessModal
              message={planResult.success}
              open={true}
              close={() => dispatch(planActions.resetPlanResult())}
            />
          )}
        </div>
      )}
    </div>
  );
}
