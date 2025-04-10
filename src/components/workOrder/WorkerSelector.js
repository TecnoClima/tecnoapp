import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions } from "../../actions/StoreActions";
import ModalBase from "../../Modals/ModalBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function WorkerSelector({
  label,
  defaultValue,
  action,
  permissions,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(`${defaultValue || ""}`);
  const [requested, setRequested] = useState(false);
  const { workersList } = useSelector((s) => s.people);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!workersList.length && !requested) {
      dispatch(peopleActions.getWorkers());
      setRequested(true);
    }
  }, [workersList, requested, dispatch]);

  function toggleModal(e) {
    e.preventDefault();
    setOpenModal(!openModal);
  }

  function handleChange(e) {
    e.preventDefault();
    const { value } = e.currentTarget;
    setSelected(value);
    action && action(value);
    setOpenModal(false);
  }

  const id = selected;
  const name = workersList.find(
    (worker) => worker.idNumber === Number(id)
  )?.name;
  const isEnabled =
    permissions?.admin || permissions?.author || permissions?.supervisor;

  return (
    <div className="flex sm:w-1/3 flex-grow">
      <div className="w-full ">
        <div className="text-xs">Responsable</div>
        <div className="join w-full max-w-full">
          <div className="flex flex-grow items-center input-sm join-item cursor-default bg-base-100 border-2 border-primary text-ellipsis whitespace-nowrap overflow-hidden">
            {selected ? `(${id}) - ${name}` : "Sin seleccionar"}
          </div>
          <button
            className="label btn btn-sm btn-primary join-item"
            onClick={toggleModal}
            disabled={!isEnabled}
          >
            {selected ? <FontAwesomeIcon icon={faSyncAlt} /> : "Seleccionar..."}
          </button>
        </div>
      </div>
      <ModalBase
        className="bg-base-200 max-w-2xl"
        title="Selecciona Responsable"
        onClose={toggleModal}
        open={openModal}
      >
        <div className="flex flex-wrap gap-2 md:gap-4 max-h-[50vh] min-h-0 overflow-auto">
          {workersList.map(({ idNumber, name }) => (
            <button
              className="btn btn-sm btn-primary sm:w-1/3 flex-grow justify-start"
              key={idNumber}
              value={idNumber}
              onClick={handleChange}
            >
              ({idNumber}) - {name}
            </button>
          ))}
        </div>
      </ModalBase>
    </div>
  );
}
