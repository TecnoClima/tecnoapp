import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
import AddIntervention from '../../forms/InterventionForm'
import './index.css'

export default function InterventionList(props){
    const {onDelete, openAdd, permissions} = props
    // const {userData}=useSelector(state=>state.people)
    const [edit, setEdit] = useState(false)
    const [interventionList, setInterventionList]=useState(props.interventions)

    useEffect(()=>setInterventionList(props.interventions), [props.interventions])

    return(
        <div className='container-fluid p-0 align-items-center' style={{fontSize: '80%'}}>
            <div className='row border-bottom border-2 border-dark text-center' style={{fontWeight: 'bold'}}>
                <div className='col-1 p-1' style={{minWidth: 'fit-content'}}>Fecha</div>
                <div className='col-2 p-1' style={{minWidth: 'fit-content'}}>Intervinientes</div>
                <div className='col p-1' style={{minWidth: 'fit-content'}}>Tareas</div>
                <div className='col-2 p-1' style={{minWidth: 'fit-content'}}>Gas</div>
                <div className='col-1 p-1' style={{minWidth: 'fit-content'}}>Acción</div>
            </div>
            {interventionList && interventionList[0] && interventionList.map((item, index)=>{
                const date = new Date (item.date)
                const itemDate = date.toISOString().split('T')[0]
                const time = item.time || `${date.getHours()}:${date.getMinutes()}`
                return(<div className='row mb-1 border border-secondary' key={index}>
                    <div className='col-sm-1 p-1 bg-dark text-light'><b>{itemDate} {time}</b></div>
                    <div className='col-sm-2 p-1'><b>{item.workers.map(e=>e.name).join(', ')}</b></div>
                    <div className='col p-1'>{item.task}</div>
                    <div className='col-sm-2 p-1 d-flex flex-column'>{item.refrigerant.map((cyl, index)=>
                            <div className='d-flex' key={index}>
                                <b>{`${index===0 ? 'Refrigerante ':cyl.code}`}:</b>{cyl.total}kg.
                            </div>
                        )}
                    </div>
                    <div className='col-sm-1 p-1'>
                        <div className='d-flex justify-content-evenly'>
                        {permissions.edit &&
                            <button className="btn btn-info h-50 p0 w-50 d-flex align-items-center justify-content-center" title='Editar' onClick={()=>setEdit(item)}>
                                    <i className="fas fa-pencil-alt"/>
                                </button>}
                        {permissions.admin &&
                            <button className="btn btn-danger h-50 p0 w-50 d-flex align-items-center justify-content-center" title="Eliminar" onClick={()=>onDelete()}>
                                    <i className="fas fa-trash-alt"/>
                                </button>}
                        {edit && 
                            <AddIntervention select={()=>{}}
                                close={()=>setEdit(false)}
                                data={edit}
                                key={index}/>}
                        </div>
                    </div>
                </div>)})}
                {permissions.edit&&
                    <div className='row'>
                        <div className='col d-flex justify-content-center'>
                            <button className='btn btn-info pt-0 pb-0' onClick={openAdd}>
                                <i className="fas fa-plus"/> <b>Agregar intervención</b>
                            </button>
                        </div>
                    </div>}

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
    )
}