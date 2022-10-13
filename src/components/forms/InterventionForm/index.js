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
import { FormInput } from "../FormInput";

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
      if (date !== data.date)
        update = {
          ...update,
          date: intervention.date,
          time: intervention.time,
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

  return (
    <div className="modal">
      <div
        className="container-fluid bg-light rounded p-1"
        style={{ width: "40rem", maxWidth: "100vw" }}
      >
        <div className="row">
          <div className="col d-flex">
            <h5 className="w-100 text-center">
              <b>AGREGAR INTERVENCIÓN</b>
            </h5>
            <div className="btn btn-close" onClick={() => close()} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 text-center">
            <FormInput
              label="Fecha"
              type="date"
              defaultValue={intervention.date || today}
              onBlur={(e) =>
                setIntervention({ ...intervention, date: e.target.value })
              }
              max={today}
            />
            {!intervention.date && (
              <div className="errorMessage">
                Debe ingresarse una fecha menor o igual que hoy.
              </div>
            )}
          </div>
          <div className="col-sm-6">
            <FormInput
              label="Hora"
              type="time"
              disabled={!intervention.date}
              min="00:00"
              value={intervention.time || ""}
              max={intervention.date === today ? time : "23:59"}
              changeInput={(e) =>
                setIntervention({ ...intervention, time: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row text-center">
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
            <div className="errorMessage">
              Debe ingresar al menos 2 personas.
            </div>
          )}
        </div>
        <b>Tarea Realizada</b>
        <div className="row">
          <div className="col text-center">
            <textarea
              className="form-text-area w-100"
              disabled={!intervention.workers || !intervention.workers[0]}
              defaultValue={intervention.task}
              onBlur={(e) =>
                setIntervention({ ...intervention, task: e.target.value })
              }
            />
            {!intervention.task && (
              <div className="errorMessage">
                Este campo no puede quedar vacío.
              </div>
            )}
            {intervention.id && (
              <button className="btn btn-info" onClick={() => setAddText(true)}>
                Agregar comentario
              </button>
            )}
            {addText && (
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
            )}
          </div>
        </div>
        <b>Consumos de GAS</b>
        <div className="row">
          <div className="col">
            <AddCylinder
              cylinderList={cylinderList}
              disabled={false}
              stored={gasUsages}
              create={(cylinder) =>
                setGasUsages([...gasUsages, { ...cylinder, user: userData.id }])
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <table className="table text-center">
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
                    <td>
                      <b>{cylinder.code}</b>
                    </td>
                    <td>{cylinder.owner}</td>
                    <td>{cylinder.total} kg.</td>
                    <td>
                      <button
                        className="btn btn-danger h-50 p-0 w-100"
                        id={index}
                        onClick={deleteCylinder}
                      >
                        <i id={index} className="fas fa-trash-alt" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="table-secondary">
                  <td colSpan="2">
                    <b>Total:</b>
                  </td>
                  <td>
                    <b>{`${Number(
                      gasUsages.map((e) => e.total).reduce((a, b) => a + b, 0)
                    )} kg.`}</b>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className='addInterventionSection'>
                    <div className='addInterventionField'>
                        <b>Fecha</b>
                        <input className='formInterventionItemDate'
                            type='date'
                            max={new Date().toISOString().split("T")[0]}
                            onBlur={(e)=>setIntervention({...intervention, date:e.target.value})}
                            defaultValue={intervention.date}
                        />
                        {(!intervention.date) && <div className='errorMessage'>Debe ingresarse una fecha menor o igual que hoy.</div>}
                    </div>

                    <div className='addInterventionField'>
                        <b>Hora</b>
                        <input className='formInterventionItemHour'
                        type='time'
                        disabled={!intervention.date}
                        min='00:00'
                        defaultValue={intervention.time}
                        max={intervention.date===(new Date().toISOString().split("T")[0])?
                            Date().toString().split(' ')[4].substring(0,5)
                            :'23:59'}
                        onBlur={(e)=>setIntervention({...intervention, time:e.target.value})}
                        />
                        {(intervention.time)?
                            ( (intervention.date===(new Date().toISOString().split("T")[0]) && 
                                intervention.time > Date().toString().split(' ')[4].substring(0,5))?
                                <div className='errorMessage'>No puede indicar un horario futuro.</div>:
                                ''
                            )
                            :<div className='errorMessage'>Debe ingresar la hora.</div>
                            }
                    </div>
            </div> 

            <div className='addInterventionSection'>
                    <div className='addInterventionField'>
                        <b>Personal</b>
                        <PeoplePicker name='Intervinientes'
                            key={(user?user.id:1)+(intervention.id?intervention.id:1)}
                            options={workersList}
                            disabled={!intervention.time || (intervention.id && userData.access!=="Admin")}
                            idList = {intervention.workers || []}
                            update={(idArray)=>handlePeople(idArray)}
                            />
                        {( (!intervention.workers) || intervention.workers.length<2) &&
                            <div className='errorMessage'>Debe ingresar al menos 2 personas.</div>}
                    </div>
                </div>

            <div className='addInterventionSection'>
                <div className='addInterventionField'>
                    <b>Tarea Realizada</b>
                    <textarea className='longTextInput'
                        id='addInterventionTask'
                        disabled={!intervention.workers || !intervention.workers[0]}
                        defaultValue={intervention.task}
                        onBlur={(e)=>setIntervention({...intervention, task:e.target.value})}
                        />
                    {(!intervention.task) &&
                        <div className='errorMessage'>Este campo no puede quedar vacío.</div>}

                    {intervention.id&&<button className='button addButton' onClick={()=>setAddText(true)}>Agregar comentario</button>}
                            {addText&&<AddTextForm user={userData.user} 
                                select={(text)=>setIntervention({...intervention, task: intervention.task+' || '+text})}
                                close={()=>setAddText(false)}
                                />}


                </div>
            </div>

            <AddCylinder 
                cylinderList={cylinderList}
                disabled={false}
                stored={gasUsages}
                create={(cylinder)=>setGasUsages([...gasUsages,{...cylinder, user:userData.id}])}/>


            <div className="addInterventionField">
            {gasUsages.map((cylinder, index)=>
                <div className='formListItem fr211' key={index}>
                    <div className='listField'>{`${cylinder.code} (${cylinder.owner})`}</div>
                    <div className='listField'>{`${cylinder.total} kg.`}</div>
                    <div className='listField'>
                        <button className="button removeButton delCylinder" value={index} onClick={(e)=>deleteCylinder(e)}/>
                    </div>
                </div>)}
            </div>
            <div className="addInterventionField">
                <div className='listField'>
                    <b>{`TOTAL: ${Number(gasUsages.map(e=>e.total).reduce((a,b)=>a+b,0))} kg.`}</b>
                </div>

            </div>                            
            */}
        <div className="row">
          <div className="col d-flex justify-content-center">
            <button
              className="btn btn-success"
              onClick={() => saveIntervention()}
            >
              GUARDAR INTERVENCIÓN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
