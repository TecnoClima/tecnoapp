import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PeoplePicker from "../../pickers/PeoplePicker";
import "./index.css";
import AddCylinder from "../AddCylinder";
import AddTextForm from "../AddText";
import {
  addCylinderUsage,
  deleteCylinderUsage,
  updateIntervention,
} from "../../../actions/workOrderActions";
import { cylinderActions, peopleActions } from "../../../actions/StoreActions";
import CylinderIcon from "../../../assets/icons/Garrafa.svg";
import ModalBase from "../../../Modals/ModalBase";
import DateAndTime from "../DateAndTime";
import ErrorMessage from "../ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";

export default function AddIntervention(props) {
  const today = new Date().toISOString().split("T")[0];
  const time = new Date().toString().split(" ")[4].substring(0, 5);
  const { data, select, close } = props;
  const { userData, workersList } = useSelector((state) => state.people);
  const { allCylinders } = useSelector((state) => state.adminCylinders);
  const [intervention, setIntervention] = useState({
    date: today,
    workers:
      userData.access === "Worker"
        ? [
            {
              id: userData.id,
              name: "",
            },
          ]
        : [],
  });
  // const [user, setUser] = useState(undefined);
  const [cylinderList, setCylinderList] = useState([]);
  const [gasUsages, setGasUsages] = useState([]);
  const [addText, setAddText] = useState(false);
  const [list, setList] = useState(workersList);
  const [enableAddCylinder, setEnableAddCylinder] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!workersList[0]) return;
    setList(workersList);
    if (intervention.workers.find((worker) => !worker.name)) {
      setIntervention({
        ...intervention,
        workers: intervention.workers.map((worker) => ({
          id: worker.id,
          name: workersList.find((w) => w.idNumber === worker.id).name,
        })),
      });
    }
  }, [intervention, workersList]);

  useEffect(() => {
    if (data) {
      const editable = { ...data };
      const date = new Date(editable.date);
      editable.date = date.toISOString().split("T")[0];
      let hours = date.getHours();
      let minutes = date.getMinutes();
      editable.time =
        editable.time || `${hours}:${(minutes < 10 ? "0" : "") + minutes}`;

      if (editable.endDate) {
        const endDate = new Date(editable.endDate);
        editable.endDate = endDate.toISOString().split("T")[0];
        let endHours = endDate.getHours();
        let endMinutes = endDate.getMinutes();
        editable.endTime =
          editable.endTime ||
          `${endHours}:${(endMinutes < 10 ? "0" : "") + endMinutes}`;
      }

      setIntervention({ ...editable });
      dispatch(cylinderActions.getList(data.workers.map((e) => e.id)));
      setGasUsages(editable.refrigerant.filter((e) => !!e.code));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!allCylinders[0] || !workersList[0]) {
      setCylinderList([]);
    } else {
      const cylinders = [...allCylinders];

      for (let cylinder of cylinders) {
        let owner = workersList.find(
          (worker) =>
            cylinder.user &&
            [worker.id, worker.idNumber].includes(cylinder.user.id)
        );
        cylinder.owner = owner ? owner.name : "";
      }
      setCylinderList(cylinders);
    }
  }, [allCylinders, workersList]);

  useEffect(() => dispatch(cylinderActions.resetList()), [dispatch]);

  function saveIntervention() {
    if (intervention.id) {
      let update = {};
      const dataWorkers = data.workers.map((e) => e.id);
      const newWorkers = intervention.workers.map((e) => e.id);
      if (
        newWorkers.filter((id) => dataWorkers.includes(id)).length !==
        newWorkers.length
      ) {
        update.workers = intervention.workers;
      }
      if (intervention.task !== data.task) update.task = intervention.task;
      const date = intervention.date + " " + intervention.time;
      const endDate = intervention.endDate + " " + intervention.endTime;
      if (date !== data.date)
        update = {
          ...update,
          date: intervention.date,
          time: intervention.time,
        };
      if (endDate !== data.endDate)
        update = {
          ...update,
          endDate: intervention.endDate,
          endTime: intervention.endTime,
        };

      if (Object.keys(update).length >= 1)
        dispatch(updateIntervention(intervention.id, update));

      const newGases = gasUsages.filter((e) => !e.id && !!e.code);
      if (newGases[0])
        dispatch(addCylinderUsage(intervention.id, userData.id, newGases));

      const keptGases = gasUsages.map((gas) => gas.id);
      const deletedGases = data.refrigerant.filter(
        (e) => !!e.code && !keptGases.includes(e.id)
      );
      if (deletedGases[0])
        dispatch(
          deleteCylinderUsage(intervention.id, userData.id, deletedGases)
        );
    } else {
      select({ ...intervention, refrigerant: gasUsages });
    }
    close();
  }

  function handlePeople(idArray) {
    setIntervention({ ...intervention, workers: idArray });
    dispatch(cylinderActions.getList(idArray.map((e) => e.id)));
  }

  function deleteCylinder(e) {
    e.preventDefault();
    const index = Number(e.target.id);
    let usages = [...gasUsages];
    usages.splice(index, 1);
    setGasUsages(usages);
  }

  useEffect(() => {
    dispatch(
      peopleActions.getWorkers({
        plant: userData.access === "Admin" ? undefined : userData.plant,
      })
    );
  }, [userData, dispatch]);

  function handleChange(e) {
    const { name, value } = e.currentTarget;
    setIntervention({
      ...intervention,
      [name]: value,
    });
  }

  return (
    <ModalBase
      title={`${intervention.id ? "EDITAR" : "AGREGAR"} INTERVENCIÓN`}
      open={true}
      onClose={close}
      className="flex flex-col h-full"
    >
      <div className="flex w-full gap-4 justify-between flex-wrap">
        <DateAndTime
          className="flex-grow"
          label="Fecha Inicio"
          name="date"
          value={intervention.date}
          time={intervention.time}
          timeName="time"
          onChange={handleChange}
          max={today}
          maxTime={time}
        />

        <DateAndTime
          className="flex-grow"
          label="Fecha Fin"
          name="date"
          value={intervention.endDate}
          disabled={!intervention.date}
          time={intervention.endTime}
          timeName="time"
          onChange={handleChange}
          max={today}
          maxTime={time}
        />
      </div>
      <div className="my-2 text-center">
        <PeoplePicker
          name="Intervinientes"
          options={list}
          disabled={
            !intervention.time ||
            (intervention.id && userData.access !== "Admin")
          }
          idList={intervention.workers || []}
          update={(idArray) => handlePeople(idArray)}
        />
        {(!intervention.workers || intervention.workers.length < 2) && (
          <ErrorMessage>Debe ingresar al menos 2 personas.</ErrorMessage>
        )}
      </div>
      {intervention.workers?.[0] && (
        <div className="mb-4">
          <b>Tarea Realizada</b>
          <textarea
            className="textarea w-full bg-primary/10"
            disabled={!intervention.workers || !intervention.workers[0]}
            value={intervention.task}
            onBlur={(e) =>
              setIntervention({ ...intervention, task: e.target.value })
            }
          />

          {!intervention.task && (
            <ErrorMessage>Este campo no puede quedar vacío.</ErrorMessage>
          )}
          {intervention.id ? (
            addText ? (
              <AddTextForm
                user={userData.user}
                select={(text) =>
                  setIntervention({
                    ...intervention,
                    task: intervention.task + " || " + text,
                  })
                }
                close={() => setAddText(false)}
              />
            ) : (
              <button
                className="btn btn-xs border-base-content/30 w-full"
                onClick={() => setAddText(true)}
              >
                Agregar comentario
                <FontAwesomeIcon icon={faComment} />
              </button>
            )
          ) : (
            <></>
          )}
        </div>
      )}

      {enableAddCylinder ? (
        <div className="w-full bg-primary/10 rounded-md p-1">
          <div className="flex w-full justify-between items-center mb-2">
            <div className="card-title">Agregar consumo de gas</div>
            <button className="opacity-75 hover:opacity-100 mx-2">
              <FontAwesomeIcon
                icon={faTimes}
                onClick={() => setEnableAddCylinder(false)}
              />
            </button>
          </div>

          <AddCylinder
            cylinderList={cylinderList}
            disabled={false}
            stored={gasUsages}
            create={(cylinder) =>
              setGasUsages([...gasUsages, { ...cylinder, user: userData.id }])
            }
          />
        </div>
      ) : intervention.task ? (
        <button
          className="btn btn-sm btn-info w-full"
          onClick={() => setEnableAddCylinder(true)}
        >
          <img src={CylinderIcon} alt="garrafa" className="w-6" />
          Agregar consumo de gas
        </button>
      ) : (
        <></>
      )}

      {gasUsages.length > 0 && (
        <div className="mt-4">
          <div className="card-title">Consumos de gas</div>
          <table className="table text-center no-padding">
            <thead>
              <tr>
                <th>Código</th>
                <th>Responsable</th>
                <th>Consumo</th>
                <th>Quitar</th>
              </tr>
            </thead>
            <tbody>
              {gasUsages.map((cylinder, index) => (
                <tr key={index}>
                  <td className="p-0">
                    <b>{cylinder.code}</b>
                  </td>
                  <td className="p-0">{cylinder.owner}</td>
                  <td className="p-0">{cylinder.total} kg.</td>
                  <td className="p-0">
                    <button
                      className="btn btn-xs btn-error my-1"
                      id={index}
                      onClick={deleteCylinder}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-secondary/50">
                <td colSpan="2" className="p-0">
                  <b>Total:</b>
                </td>
                <td className="p-0">
                  <b>{`${Number(
                    gasUsages.map((e) => e.total).reduce((a, b) => a + b, 0)
                  )} kg.`}</b>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <button
        className="btn btn-sm btn-success mt-auto"
        onClick={() => saveIntervention()}
        disabled={!intervention.task}
      >
        GUARDAR INTERVENCIÓN
      </button>
    </ModalBase>
  );
}
