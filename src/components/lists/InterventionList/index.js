import { useEffect, useState } from "react";
// import { useSelector } from 'react-redux'
import AddIntervention from "../../forms/InterventionForm";
import "./index.css";

export default function InterventionList(props) {
  const { onDelete, openAdd, permissions, interventions } = props;
  const [edit, setEdit] = useState(false);

  function handleDelete(e, id) {
    e.preventDefault();
    onDelete(id);
  }

  function getDate(dateInput) {
    const givenDate = new Date(dateInput);
    if (isNaN(givenDate.getTime())) return ["", ""];
    const date = givenDate.toISOString().split("T")[0];
    let hours = givenDate.getHours();
    let minutes = givenDate.getMinutes();
    const time = `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;
    return [date, time];
  }

  return (
    <div
      className="container p-0 align-items-center"
      style={{ fontSize: "80%" }}
    >
      <div
        className="row border-bottom border-2 border-dark text-center m-0"
        style={{ fontWeight: "bold" }}
      >
        <div className="col-1 p-1" style={{ minWidth: "fit-content" }}>
          Inicio
        </div>
        <div className="col-2 p-1" style={{ minWidth: "fit-content" }}>
          Intervinientes
        </div>
        <div className="col p-1" style={{ minWidth: "fit-content" }}>
          Tareas
        </div>
        {interventions.find((e) => e.endDate) && (
          <div className="col-1 p-1" style={{ minWidth: "fit-content" }}>
            Fin
          </div>
        )}
        <div className="col-2 p-1" style={{ minWidth: "fit-content" }}>
          Gas
        </div>
        <div className="col-1 p-1" style={{ minWidth: "fit-content" }}>
          Acción
        </div>
      </div>
      {interventions &&
        interventions[0] &&
        interventions.map((item, index) => {
          const [date, time] = getDate(item.date);
          const [endDate, endTime] = getDate(item.endDate);
          return (
            <div className="input-group border-bottom border-2" key={index}>
              <div
                className="btn btn-dark w-fit p-1 "
                style={{ fontSize: "100%" }}
              >
                <b>
                  {date}
                  <br />
                  {time}
                </b>
              </div>
              <div className="col-sm-2 p-1">
                <b>{item.workers.map((e) => e.name).join(", ")}</b>
              </div>
              <div className="col p-1">{item.task}</div>
              {endDate && (
                <div
                  className="btn btn-light w-fit p-1 "
                  style={{ fontSize: "100%" }}
                >
                  <b>
                    {endDate}
                    <br />
                    {endTime}
                  </b>
                </div>
              )}
              <div className="col-sm-2 p-1 d-flex flex-column">
                {item.refrigerant.map((cyl, index) => (
                  <div className="d-flex" key={index}>
                    <b>{`${index === 0 ? "Refrigerante " : cyl.code}`}:</b>
                    {cyl.total}kg.
                  </div>
                ))}
              </div>
              <div className="col-sm-1 flex align-items-stretch p-1">
                <div className="d-flex w-100 h-100">
                  <button
                    className="btn btn-info h-100 w-50 d-flex align-items-center justify-content-center"
                    title="Editar"
                    onClick={() => setEdit(item)}
                  >
                    <i className="fas fa-pencil-alt" />
                  </button>
                  {(!item.id || permissions.admin) && (
                    <button
                      className="btn btn-danger h-100 p0 w-50 d-flex align-items-center justify-content-center"
                      title="Eliminar"
                      onClick={(e) => handleDelete(e, index)}
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      {edit && (
        <AddIntervention
          select={() => {}}
          close={() => setEdit(false)}
          data={edit}
        />
      )}

      {!(interventions && interventions[0]) && (
        <div className="w-100 text-center py-2 fw-bold text-primary">
          {" "}
          No hay intervenciones registradas{" "}
        </div>
      )}
      <div className="row">
        <div className="col d-flex justify-content-center">
          <button className="btn btn-info pt-0 py-0 my-2" onClick={openAdd}>
            <i className="fas fa-plus" /> <b>Agregar intervención</b>
          </button>
        </div>
      </div>
      {/* <div className='interventionList'>
                <div className='gridHeaders'>
                    <div className='gridHeader' id='dateField'>Fecha</div>
                    <div className='gridHeader' id='workersField'>Personal</div>
                    <div className='gridHeader' id='tasksField'>Tareas</div>
                    <div className='gridHeader' id='refrigerantField'>Gas</div>
                    <div className='gridHeader' id='buttonsField'>Quitar</div>
                </div>
            
            {interventionList && interventionList[0] && interventionList.map((item, index)=>{
                const date = new Date (item.date)
                const itemDate = date.toISOString().split('T')[0]
                const time = item.time || `${date.getHours()}:${date.getMinutes()}`

                return(
                    <div className="interventionItem" key={index}>
                        <div className="interventionListColumns">
                            <div className='gridField dateField'>
                                <div className='gridFieldLine'>
                                    <div><b>{itemDate}</b></div>
                                    <div>{time}</div>
                                </div>
                            </div>
                            <div className='gridField'>{item.workers.map((worker, index)=>
                                <div className='gridFieldLine workerName' key={index}>{worker.name}</div>)}
                            </div>
                            <div className='gridField taskField'>{item.task}</div>
                            <div className='gridField'>
                                {item.refrigerant.map((cyl, index)=>
                                    <div className='gridFieldLine' key={index}>
                                        <div><b>{`${index===0 ? 'Refrigerante: ':cyl.code}`}</b></div>
                                        <div>{cyl.total}kg.</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='gridField buttonsField'>
                            {permission&&<button className="btn btn-info" title='Editar' onClick={()=>setEdit(item)}>
                                <i className="fas fa-pencil-alt"/>
                            </button>}
                            {userData.access==='Admin'&&<button className="btn btn-danger" onClick={()=>onDelete()}>
                                <i className="fas fa-trash-alt"/>
                            </button>}
                            {edit && 
                                <AddIntervention select={()=>{}}
                                    close={()=>setEdit(false)}
                                    data={edit}
                                    key={index}/>}
                        </div>
                    </div>)
            })}

            {permission&&<button className='button addButton' onClick={()=>{openAdd()}}>
                <b>Agregar intervención</b>
            </button>}
        </div> */}
    </div>
  );
}
