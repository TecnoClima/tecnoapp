import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDates, getPlanDevices, getStrategies } from "../../../actions/planActions.js";
import ProgramFilters from "../../filters/ProgramFilters/index.js";
import NewPaginate from "../../newPaginate/index.js";
// import Paginate from "../../Paginate/index.js";
import CalendarPicker from "../../pickers/CalendarPicker/index.js";
import './index.css'

export default function PlanCalendar(props){
    const {programList, calendar} = useSelector(state=>state.plan)
    const [plant, setPlant] = useState(props.plant)
    const [year, setYear] = useState(props.year)
    // const [page, setPage]=useState({first: 0, size:15})
    const [paginate, setPaginate] = useState({first:0, last:15})
    const [filteredList, setFilteredList] = useState([])
    const [dates, setDates] = useState([])
    const dispatch = useDispatch()
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    //trabajar directamente con la lista de equipos
    useEffect(()=>setPlant(props.plant),[props.plant])
    useEffect(()=>setYear(props.year),[props.year])
    useEffect(()=>(year&&plant)&&dispatch(getDates({year,plant})),[year,plant,dispatch])
    // useEffect(()=>setFilteredList('calendar',calendar),[calendar])
    useEffect(()=>calendar && setFilteredList(calendar),[calendar])

    //getAllWeeks
    useEffect(()=>{
        let newMonday = undefined
        let number = 1
        while (newMonday===undefined){
          const date = new Date(`${year}/01/${number}`)
          if (date.getDay()===1) newMonday = date
          number++
        }
        let mondays = []
        while (newMonday.getFullYear()===year){
            mondays.push( new Date( newMonday ) )
            newMonday.setDate(newMonday.getDate()+7)
        }
        setDates(mondays)
    },[year])

    function sortByFirstDate(e){
        e.preventDefault()
        const newList = [...filteredList]
        setFilteredList(newList.sort((a,b)=>
            new Date (a.dates[0]?a.dates[0].date : `${year-1}/12/05`)>new Date (b.dates[0]?b.dates[0].date : `${year-1}/12/05`) ? 1 : -1 ))
    }
    function sortByDevice(e){
        e.preventDefault()
        const newList = [...filteredList]
        setFilteredList(newList.sort((a,b)=>a.name > b.name?1:-1))
    }

   
    function applyFilters(filters){
        setFilteredList(calendar.filter(task=>{
            let check = true
            for (let key of Object.keys(filters)){
                switch (key){
                    case 'responsible':
                        if (task[key].id!==filters[key])check=false;
                        break
                    case 'dates':
                        if (task[key] && task[key].length!==filters[key].length)check=false;
                        break
                    default: if(task[key]!==filters[key])check=false;
                }
            }
            return check
        }))
    }

    useEffect(()=>{
        dispatch( getStrategies({plant,year}) )
        dispatch(getPlanDevices({plant,year}))    
    },[plant,year, dispatch])

    return(
        <><div className="container-fluid bg-light pt-1 d-flex h-full flex-column">
            <div className="row">
                <div className="col-auto d-flex align-items-center">
                    <b>Filtros:</b>
                </div>
                <div className="col-auto">
                        {! (props.plant && props.year) && <label className='longLabel'>Debe seleccionar Planta y Año</label>}
                        { (props.plant && props.year) && <ProgramFilters
                            programList = {programList}
                            select={(json)=>applyFilters(json)}/>}
                </div>
            </div>
            <div className="row" style={{height: '70vh', overflowY:'auto'}}>
                <div className="col">
                    <table className="table">
                        <thead className="text-center p-0" style={{fontSize: '75%'}}>
                            <tr>
                                <th rowSpan='2' className="p-0">
                                    <button className="btn btn-outline-secondary m-1 py-0"
                                        onClick={sortByDevice}
                                        style={{fontSize: '100%'}}>
                                        <b>Equipos </b><i className="fas fa-sort-alpha-down"/>
                                    </button>
                                </th>
                                <th rowSpan='2' className="p-0">
                                    <button className="btn btn-outline-secondary m-1 py-0 px-1"
                                        onClick={sortByFirstDate}
                                        style={{fontSize: '100%'}}>
                                        <b>Inicio </b><i className="fas fa-sort-numeric-down"/>
                                    </button>
                                </th>
                                <th colSpan='12' className='fs-6 py-0'>{`Calendario ${year}`}</th>
                            </tr>
                            <tr>
                                {months.map((month, index)=>
                                    <th className='p-0' key={index} id={index} style={{fontSize: '90%'}}>
                                        {month}
                                    </th>                            
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.slice(paginate.first, paginate.last).map((task, index)=>
                            <CalendarPicker key={task.code+index}
                                plant={plant}
                                year={year}
                                titles={index===0}
                                task={task}
                                yearDates={dates}
                                />)}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row flex-fill d-flex">
                <NewPaginate
                    key={filteredList}
                    length={filteredList.length}
                    visible='6'
                    size='15'
                    select={(first, last, size)=>setPaginate({first, last, size})}
                 />
            </div>
        </div>
        </>
    )
}