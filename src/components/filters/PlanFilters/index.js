import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPlantList, getPlantLocationTree } from "../../../actions/dataActions"
import { deviceListByLine, getDeviceList } from "../../../actions/deviceActions"
import { getStrategies } from "../../../actions/planActions"
import { appConfig } from "../../../config"
import './index.css'
const {startingYear} = appConfig.values



export default function PlanFilters(props){
    const {year,userData, select} = props
    const [data,setData]=useState([])
    const {programList} = useSelector(state=>state.plan)
    const {locationTree} = useSelector(state=>state.data)
    const {partialList, deviceFullList} = useSelector(state=>state.devices)
    const {access} = userData
    const [filters,setFilters] = useState({})
    const [years, setYears]=useState([year])
    const [days,setDays]=useState([])
    const [plantList, setPlantList] = useState([])
    const [areaList, setAreaList] = useState([])
    const [lineList, setLineList] = useState([])
    const [deviceList,setDeviceList] = useState([])
    // const [searchWord, setSearchWord] = useState('')
    const [workers, setWorkers] = useState([])
    const [strategies, setStrategies] = useState([])
    const [supervisors, setSupervisors] = useState([])
    const [range, setRange] = useState([])
    const dispatch = useDispatch()

    const months = Array.from({ length: 12 }, (_, index) => index+1)

    useEffect(()=>setData(props.data),[props.data])

    function completeDevices(event){
        const input = event.target.value
        let devices = []
        if(!input){
            setDeviceList([])
            let newFilter = deleteFilterFields(['code','deviceCodes'])
            setFilters(newFilter)
            select(newFilter)
        }else{
            data.map(date=>!devices.map(e=>e.code).includes(date.code) && devices.push({code: date.code, name: date.device}))
            setDeviceList(devices.filter(device=>device.code.includes(input) || device.name.includes(input)))
        }
    }

    // useEffect(()=>{
    //     let aux = []
    //     data.map(date=>!aux.map(e=>e.code).includes(date.code) && aux.push({code: date.code, name: date.device}))
    //     setDeviceList(aux)
    // },[data])

    useEffect(()=>(filters.plant || userData.plant)
        && dispatch(getStrategies({year,plant: filters.plant || userData.plant}))
    ,[dispatch, year,filters.plant, userData.plant])

    useEffect(()=>{
        let workers = []
        if(filters.strategy){
            workers = programList.find(strategy=>strategy.name===filters.strategy).people
        }else{
            programList.map(program=>program.people.map(worker=> 
                !(workers.map(element=>element.id).includes(worker.id)) && workers.push(worker)))
        }
        setWorkers(workers.sort((a,b)=>a.name>b.name?1:-1))
    },[filters.strategy,programList])

    useEffect(()=>{
        setStrategies(programList.map(strategy=>strategy.name).sort((a,b)=>a>b?1:-1))
        let supervisors=[]
        programList.map(strategy=>
            !supervisors.map(e=>e.id).includes(strategy.supervisor.id) && supervisors.push(strategy.supervisor))
        setSupervisors(supervisors)
    },[programList])

    useEffect(()=>{
        if(!userData || !dispatch)return
        dispatch(getPlantList())
        if(userData.plant){
            (!deviceFullList || !deviceFullList[0]) && dispatch(getDeviceList(userData.plant))
            dispatch(getPlantLocationTree(userData.plant))
        }
    },[deviceFullList,userData,dispatch])

    useEffect(()=>setPlantList(Object.keys(locationTree)),[locationTree])
        useEffect(()=>dispatch(getPlantLocationTree(userData.plant)),[userData, dispatch])

    useEffect(()=>{
        if (!filters.plant && !locationTree[userData.plant]) return
        setAreaList(Object.keys(locationTree[filters.plant || userData.plant]))
    },[userData, locationTree,filters.plant])

    useEffect(()=>filters.line && setDeviceList(partialList?
        partialList.sort((a,b)=>a.name>b.name?1:-1):[]),[partialList, filters.line])

    function deleteFilterFields(fieldArray){
        let newFilter = {...filters}
        for (let field of fieldArray){
            delete newFilter[field]
        }
        return newFilter
    }
    
    // function deviceFilterByWord(event){
    //     event.preventDefault()
    //     const {value} = event.target

    //     if(!value)setDeviceList([])
    //     if(value && deviceFullList[0]) setDeviceList(deviceFullList.filter(device=>
    //         (device.code.toLowerCase().includes(value.toLowerCase())
    //         ||device.name.toLowerCase().includes(value.toLowerCase())
    //         )
    //     ))
    // }

    function deviceSelect(value){
        const newFilter = {...filters}
        if(value==='all'){
            delete newFilter.code
            newFilter.deviceCodes=deviceList.map(dev=>dev.code)
        }else{
            delete newFilter.deviceCodes
            value? newFilter.code=value : delete newFilter.code 
        }
        setFilters(newFilter)
        select&&select(newFilter)
        setDeviceList([])
    }

  
    function handleComplete(type,event){
        event.preventDefault()
        const {value} = event.target
        // let newFilter = {...filters}
        let newFilter = {}
        
        if (type==='value'){
            // deleteFilterFields(['minComplete', 'maxComplete'])
            newFilter = deleteFilterFields(['minComplete', 'maxComplete'])
            value? newFilter.complete=value : delete newFilter.complete
        }else{
            // delete newFilter.complete
            newFilter = deleteFilterFields(['complete'])
            value? newFilter[`${type}Complete`]=value : delete newFilter[`${type}Complete`]
        }
        setFilters(newFilter)
        select&&select(newFilter)
    }
    function deleteComplete(){
        setFilters( deleteFilterFields(['minComplete', 'maxComplete', 'complete']) )
    }

    function daysOfMonth(year,month){
        if(!month){
            let newFilter = {...filters}
            delete newFilter.date
            delete newFilter.month
            setFilters(newFilter)
            select&&select(newFilter)
        }
        let date = new Date(filters.year || year, month,1)
        date.setDate(date.getDate()-1)
        const days = Array.from({ length: date.getDate() }, (_, index) => index+1)
        setDays(days)
    }

    useEffect(()=>{
        let years = []
        for (let i=startingYear;i<=year;i++) years.unshift(i);
        setYears(years)
    },[year])

    function PlanItemFilter(props){
        const {item,filterKey,disabled,defaultValue,options,value,caption, extraAction,className}=props
        
        function handleValue(item, event){
            event.preventDefault()
            let value = event.target.value
            let newFilter = {...filters}
            value? newFilter[item]=value : delete newFilter[item]
            setFilters(newFilter)
            select(newFilter)
            if(props.extraAction)extraAction(value)
        }

        return<select title={item}
            className={className}
            onChange={(e)=>handleValue(filterKey,e)}
            disabled={disabled}
            defaultValue={defaultValue}>
            <option value=''>{item}</option>
            {options?
                options.map((option,index)=>
                <option key={index} value={value?option[value]:option}>{caption?option[caption]:option}</option>)
                :''}
        </select>
    }

    return(
        <div className='planFilterBar'>
            <div className="filterSection">
                <div className="filterSectionTitle"><b>FECHAS</b></div>
                <div className="section">
                    <PlanItemFilter item='Año' filterKey='year' options={years}
                        defaultValue={filters.year}/>
                    <PlanItemFilter item='Mes' filterKey='month' options={months}
                        defaultValue={filters.month}
                        extraAction={(value)=>daysOfMonth(filters.year || year,value)}
                        />
                    <PlanItemFilter item={"Día"} filterKey='date' options={days}
                        defaultValue={filters.date} disabled={!filters.month}/>
                </div>
            </div>
            <div className="filterSection">
                <div className="filterSectionTitle"><b>UBICACIÓN</b></div>
                <div className="filterSectionRow">
                    <PlanItemFilter item='Planta' filterKey='plant' options={plantList}
                        defaultValue={filters.plant}
                        className='wordWidth'
                        extraAction={(value)=>{
                            if(!value && !userData.plant)return
                            dispatch(getPlantLocationTree(value || userData.plant))
                            dispatch(getDeviceList(value || userData.plant))
                        }}/>
                    <PlanItemFilter item='Area' filterKey='area' options={areaList} 
                        defaultValue={filters.area || ''}
                        className='wordWidth' 
                        extraAction={(value=>{
                            if(!value) setFilters( deleteFilterFields(['line']) )
                            setLineList(value&&(filters.plant || userData.plant)?
                                locationTree[filters.plant || userData.plant][value]
                                :[])
                            })}
                        />
                    <PlanItemFilter item='Línea' filterKey='line' options={lineList}
                        disabled = {!filters.area}
                        className='wordWidth'
                        defaultValue={filters.line}
                        extraAction={(value)=>{
                            value ? dispatch(deviceListByLine(value)) : setDeviceList([])
                            }}
                        />
                    {filters.line?
                        <PlanItemFilter className='wordWidth' item='Equipo' filterKey='code' options={deviceList} value={'code'} caption={'name'}
                            defaultValue={filters.code}/>
                        :<div><input className='deviceSearcher' onBlur={(e)=>{completeDevices(e)}} placeholder='nombre o código de equipo'/>
                            {deviceList[0]&&<ul className='autoComplete'>
                                    {deviceList[1]&&<li onClick={()=>deviceSelect('all')}>Toda la lista</li>}
                                {deviceList.map((device, index)=>
                                    <li onClick={()=>deviceSelect(device.code)} key={index}>{`[${device.code}] ${device.name}`}</li>)}
                            </ul>}
                        </div>
                    }
                </div>
            </div>

            <div className="filterSection">
                <div className="filterSectionTitle"><b>PLAN</b></div>
                <div className="filterSectionRow">
                    <PlanItemFilter className='wordWidth' item='Programa' filterKey='strategy' options={strategies}
                            defaultValue={filters.strategy}/>
                    {access!=='Worker'&& <PlanItemFilter className='wordWidth' item='Responsable' filterKey='responsible' options={workers} value={'id'} caption={'name'}
                            defaultValue={filters.responsible}/>}
                    <PlanItemFilter className='wordWidth' item='Supervisor' filterKey='supervisor' options={supervisors} value={'id'} caption={'name'}
                            defaultValue={filters.supervisor}/>
                    </div>
            </div>

            <div className="filterSection">
                <div className="filterSectionTitle"><b>AVANCE</b></div>
                <div className="filterSectionRow">
                    <div className='rangeFilter'>
                        <button className='rangeButton long' onClick={()=>setRange(!range)}>{range?'Valor':'Rango'}</button>
                        {range?
                            <div>
                                {['min','max'].map(type=>
                                    <input 
                                        key={type}
                                        className='rangeInput'
                                        type="number"
                                        min='0'
                                        max='100'
                                        placeholder={type}
                                        defaultValue={filters[`${type}Complete`]}
                                        onBlur={(e)=>handleComplete(type,e)}/>)}
                            </div>
                            :<div>
                                <input
                                    className='valueInput'
                                    type="number"
                                    min='0'
                                    max='100'
                                    placeholder="valor"
                                    defaultValue={filters.complete}
                                    onBlur={(e)=>handleComplete('value',e)}/>                
                            </div>
                            }
                        {(filters.complete || filters.maxComplete || filters.minComplete) &&
                            <button className="deleteButton" onClick={()=>deleteComplete()} title='Borrar Filtro Avance'>X</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}
// Avance