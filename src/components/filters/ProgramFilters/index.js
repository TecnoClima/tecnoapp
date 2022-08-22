import { useEffect, useState } from "react"
import './index.css'

export default function ProgramFilters(props){
    const {programList} = props
    const [filters, setFilters]=useState({})
    const [workers, setWorkers]=useState([])

    useEffect(()=>{
        let workers = []
        const list = filters.name?
            programList.filter(program=>program.name===filters.name)
            :programList
        for (let program of list){
            for (let worker of program.people){
                const found = workers.find(element=>element.id === worker.id)
                if(!found) workers.push(worker)
        }}
        workers.sort((a,b)=>a.name>b.name? 1 : -1)
        setWorkers(workers)
    },[filters, programList])

    function handleValue (item,value){
        const newFilters = {...filters}
        if(value===''){
            delete newFilters[item]
        }else{
            newFilters[item]= Number(value) || value
        }
        setFilters(newFilters)
        props.select(newFilters)
    }
    function handleDates(boolean){
        const newFilters = {...filters}
        if (boolean) newFilters.dates=[]
        if (!boolean) delete newFilters.dates
        setFilters(newFilters)
        props.select(newFilters)
    }


    return(<div className="input-group m-0">
        <select className='form-select py-0' onChange={(e)=>handleValue('strategy',e.target.value)} disabled={!programList}>
            <option value = ''>{programList?'todos los programas':'Seleccione Planta y año'}</option>
            {programList && programList.map(element=>element.name).map(name=>
                <option key={name} value={name}>{name}</option>
            )}
        </select>
        <select className='form-select py-0' onChange={(e)=>handleValue('responsible', e.target.value)} disabled={!programList}>
            <option value = ''>Todos los responsables</option>
            {workers.map(worker=>
                <option key={worker.id} value={worker.id}>{worker.name}</option>
            )}
        </select>
        <button className="btn btn-info py-0" onClick={()=>handleDates(!filters.dates)}>
            {filters.dates?'Mostrar todos los equipos':'Mostrar equipos sin fecha'}
        </button>

    </div>)
}