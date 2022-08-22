import { useEffect } from 'react'
import { useState } from 'react'
import { appConfig } from '../../../config'
const {frequencies} = appConfig

export default function PlanDevice(props){
    const {onSave, programs, device} = props
    const [startProgram, setStartProgram] = useState(device.strategy || {}) // programa en el equipo
    const [program, setProgram] = useState(device.strategy?
        programs.find(program=>program.name===device.strategy.name)
        :undefined) //programa elegido de la lista de programas
    const [newProgram, setNewProgram] = useState(device.strategy||{}) // programa nuevo
    const [save, setSave]=useState(false)

    useEffect(()=>setSave( !( JSON.stringify(startProgram) === JSON.stringify(newProgram) ) )
    ,[startProgram,newProgram])

    useEffect(()=>setStartProgram( device.strategy || {} ),[device.strategy])

    function handleProperty(key, value){
        let program = {...newProgram}
        if (value === ''){
            delete program[key]
        }else{
            if(!program) program = {}
            program[key]=value
        }
        setNewProgram(program)
    }

    function handleProgram(value){
        const program = programs.find(program=>program.name===value)
        setProgram(program)
        setNewProgram(value==='' ?
            {} :
            {name: value, year:program.year, plant:program.plant})
    }

    function handleSave (){
        let program = {...newProgram}
        if (!program.frequency) program.frequency=48
        onSave({device: [device.code], program})
        setStartProgram(program)
    }

    return(
        <div className='container-fluid p-0 mt-1 mx-0'>
            <div className='row m-0'>
                <div className='col-auto p-1 d-flex align-items-center'>
                    <input type='checkbox'
                    className='form-check'
                    style={{transform: 'scale(1.6)'}}
                    id={device.code}
                    defaultChecked={props.checked}
                    onChange={(e)=>props.onCheck(e)}
                    />
                </div>
                <div className={`col p-0 bg-opacity-25 ${newProgram.name ? 'bg-success' : 'bg-secondary'} rounded p-1`} style={{fontSize: '90%'}}>
                    <div className='container-fluid p-0 '>
                        <div className='row m-0  d-flex justify-content-between'>
                            <div className='col-auto p-0'>
                                <b>{`[${device.code}] ${device.name}`}</b>
                            </div>
                            <div className='col-auto p-0'>
                                {` (${device.type} ${device.power>7500?
                                Math.floor(device.power/3000)+'TR'
                                :device.power+'Frig'}
                                ${device.refrigerant})`}
                            </div>
                            <div className='col-auto p-0 d-flex align-items-center' style={{fontSize: '80%'}}>
                                {`${device.plant} > ${device.area} > ${device.line}`}
                            </div>
                            <div className='col-auto p-0' style={{fontSize: '80%'}}>
                                <div className='flex w-100 justify-content-start flex-wrap'>
                                    <div className='bg-light rounded shadow-sm px-1 m-1'><i className="fas fa-table me-1"/>{device.category}</div>
                                    <div className='bg-light rounded shadow-sm px-1 m-1'><i className="fas fa-tools me-1"/>{device.service}</div>
                                    <div className='bg-light rounded shadow-sm px-1 m-1'><i className="fas fa-globe me-1"/>{device.environment}</div>
                                    <div className='bg-light rounded shadow-sm px-1 m-1'><i className="far fa-calendar-alt  me-1"/>{device.age + ' años'}</div>
                                    <div className='bg-light rounded shadow-sm px-1 m-1'><i className="far fa-star  me-1"/>{device.status}</div>
                                    <div className='bg-light rounded shadow-sm px-1 m-1'><i className="fas fa-bell me-1"/>{device.reclaims + ' reclamos'}</div>
                                </div>
                            </div>
                        </div>
                        <div className='row m-0'>
                            <div className='col-sm-4 p-0'>
                                <div className={`input-group ${newProgram.name ? '' : 'border border-2 border-danger'}`}>
                                    <label className="input-group-text col-3 px-1 py-0 is-flex justify-content-center"
                                        style={{minWidth: 'fit-content'}}>
                                        Programa
                                    </label>
                                    <select className="form-select px-1 py-0" 
                                        onChange={(e)=>handleProgram(e.target.value)}
                                        defaultValue={newProgram? newProgram.name : undefined}>
                                        <option value=''>Sin seleccionar</option>
                                        {programs && programs.map((p,index)=>
                                            <option key={index} value={p.name}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className='col-sm-3 p-0'>
                                <div className='input-group'>
                                    <label className="input-group-text col-3 px-1 py-0 is-flex justify-content-center" style={{minWidth: 'fit-content'}}>
                                        Responsable
                                    </label>
                                    <select className="form-select px-1 py-0"
                                        key={newProgram.responsible}
                                        onBlur={(event)=>handleProperty('responsible', program.people.find(worker=>worker.id === Number(event.target.value) ))}
                                        defaultValue={newProgram? newProgram.responsible && newProgram.responsible.id : undefined}>
                                        <option value=''>Sin Seleccionar</option>
                                        {program && program.people.map((worker, index)=>
                                         <option key={index} value={worker.id}>{worker.name}</option>
                                        )}
                                    </select>
                                </div>
                            </div>                            
                            <div className='col-sm-2 p-0'>
                                <div className='input-group'>
                                    <label className="input-group-text col-3 px-1 py-0 is-flex justify-content-center" style={{minWidth: 'fit-content'}}>
                                        Costo (mU$S)
                                    </label>
                                    <input className="form-control px-1 py-0 text-center"
                                        defaultValue={newProgram? newProgram.cost : 0}
                                        onBlur={(e)=>handleProperty( 'cost', Number(e.target.value) )}/>
                                </div>
                            </div>                            
                            <div className='col-sm-3 p-0'>
                                <div className={`input-group ${newProgram.frequency ? '' : 'border border-2 border-danger'}`}>
                                    <label className="input-group-text col-3 px-1 py-0 is-flex justify-content-center" style={{minWidth: 'fit-content'}}>
                                        Frecuencia
                                    </label>
                                    <select className="form-select px-1 py-0"
                                        key={newProgram.frequency}
                                        onChange={(e)=>handleProperty('frequency', Number(e.target.value))}
                                        defaultValue={newProgram ? newProgram.frequency : undefined}>
                                        <option value=''>Seleccionar</option>
                                            {frequencies && frequencies.map((item, index)=>
                                            <option key={index} value={item.weeks}>{item.frequency}</option>
                                            )}
                                    </select>
                                </div>
                            </div>                        
                        </div>
                        <div className='row m-0'>
                            <div className='col-sm-10 p-0'>
                                <div className='input-group d-flex'>
                                    <label className="input-group-text col-3 px-1 py-0 is-flex justify-content-center" style={{minWidth: 'fit-content'}}>
                                        Observaciones
                                    </label>
                                    <textarea className='form-control px-1 py-0'
                                        key={newProgram.description}
                                        placeholder='Ingrese una descripción si es necesaria'
                                        onBlur={(e)=>handleProperty('observations',e.target.value)}
                                        defaultValue={newProgram && newProgram.observations}
                                    />
                                </div>
                            </div>
                            <div className='col-sm-2 p-0'>
                                <button className='btn btn-success w-100 h-100 d-flex align-items-center justify-content-center' onClick={handleSave} disabled={!save}>
                                    {save && <i className="far fa-save fs-4 me-2"/>}<div>Guardar</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}