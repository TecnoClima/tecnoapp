import { useEffect, useState } from "react"

function applyFilters(device, filters){
    const {valueFilters, rangeFilters, includeFilters} = filters
    let check = true
    if(valueFilters) for (let key of Object.keys(valueFilters)){
        if(device[key]!==valueFilters[key]) check = false
    }
    if(rangeFilters) for (let key of Object.keys(rangeFilters)){
        if(device[key]<rangeFilters[key].min || device[key]>rangeFilters[key].max)
        check = false
    }
    if(includeFilters) for (let key of Object.keys(includeFilters)){
        if(typeof includeFilters[key] === 'string'){
            if( !device[key].toLowerCase().includes(includeFilters[key].toLowerCase()) ) check = false
        }else{
            for (let element of device[key]){
                if (element.toLowerCase.includes(
                        includeFilters[key].toLowerCase() )) check=false
            }
        }

    }
    return check
}

        //************************ RANGE INPUT OPTIONS **************************/
        function RangeInput(props){
            const {title, field, equivalency, select, deletion} = props
            const [units] = useState(equivalency ? Object.keys(equivalency) : undefined)
            const [unit, setUnit] = useState(equivalency ? Object.keys(equivalency)[0] : undefined)
            const [values, setValues] = useState({})
    
            function selectValues (values, unit){
                const newValues = {...values}
                const keys = Object.keys(values)
                if(!keys[0]) return
                for ( let key of keys )newValues[key] = newValues[key] * (unit ? equivalency[unit] : 1)
                select(field,newValues)
            }
    
            function setNewValues(e){
                e.preventDefault()
                const {name} =e.target
                const value = Number(e.target.value)
                const newValues = {...values}
                newValues[name] = value
                selectValues(newValues,unit)
                setValues({...newValues,[name]:value})
            }
    
            function updateUnit(e){
                e.preventDefault()
                const newUnit = e.target.value 
                selectValues(values,newUnit)
                setUnit(newUnit)
            }

            function handleDelete(e){
                e.preventDefault()
                setValues({})
                deletion('rangeFilters',field)
            }
        
            return(
                <div className="container">
                        <b>{title}: </b>
                        <div className="row" key={values}>
                            <div className="col">
                                <input className='form-control col-3'
                                    type='number'
                                    name='min'
                                    placeholder='min'
                                    min='0'
                                    max={values.max}
                                    defaultValue={values.min}
                                    onChange={setNewValues}/>
                            </div>
                            <div className="col">
                                <input className='form-control col-3'
                                    type='number'
                                    name='max'
                                    placeholder="max"
                                    min={values.min || 0}
                                    defaultValue={values.max}
                                    onChange={setNewValues}/>
                            </div>
                            {units&& <div className="col">
                                <select key={unit} className='btn btn-primary' style={{width: '100%'}}
                                    defaultValue={unit}
                                    onChange={updateUnit}>
                                    {units.map(option=><option key={option} value={option}>{option}</option>)}                                   
                                </select>
                        </div>}
                        {(values.min || values.max) && 
                            <button type="button" className="btn btn-outline-danger col-1"
                                onClick={handleDelete}                
                                style={{padding:0}}>
                                <i className="fas fa-backspace"/>
                            </button>}
                    </div>
                </div>
            )
        }
        //*********************** END OF RANGE OPTIONS *******************************/


export default function DeviceFilters(props){
    const {select, list, plan}=props
    const [name, setName] = useState('')
    const [options, setOptions] = useState({})
    const [filters, setFilters] = useState({valueFilters:{}, rangeFilters:{},includeFilters:{}})
    const [filteredList, setFilteredList] = useState(list)

    // useEffect(()=>console.log('filters',filters),[filters])

    useEffect(()=>{
        if(!filteredList[0])return
        let newOptions = {}
        for (let key of Object.keys(filteredList[0])){
            if(!['power', 'age', 'reclaims', 'name'].includes(key)){
                newOptions[key] = [...new Set(filteredList.map(device=>device[key]))]
            }
        }
        setOptions(newOptions)
    },[filteredList])

    useEffect(()=>list&& setFilteredList(list.filter( device=>applyFilters(device, filters) )),[list,filters])
    useEffect(()=>select(filteredList),[filteredList, select])

    function inputRange(field,values){
        const newRange = {...filters.rangeFilters}
        newRange[field] = newRange[field]?
            {...newRange[field],...values}
            :values
        const newFilters = {...filters,rangeFilters: newRange}
        setFilters(newFilters)
    }

    function inputValue(item, value){
        let newValues = {...filters.valueFilters}
        if(value==='SIN ASIGNAR') value='unassigned'
        if(value===''){
            delete newValues[item]
        }else{
            newValues[item]=value
        }
        const newFilters = {...filters,valueFilters: newValues}
        setFilters(newFilters)
    }

    function includeFilter (item, value, event){
        event && event.preventDefault()
        const newFilter = {...filters.includeFilters}
        if (value === '' || value === undefined){
            delete newFilter[item]
        }else{
            newFilter[item]=value
        }
        const newFilters = {...filters,includeFilters: newFilter}
        setFilters(newFilters)    
    }


    function deleteFilter(subJson, key){
        let newJson = {...filters[subJson]}
        delete newJson[key]
        const newFilters = {...filters, [subJson]:newJson}
        setFilters(newFilters);
        // for (let cond of ['Value','Min','Max']){
        //     const input = document.getElementById(`${key}${cond}`)
        //     if(input) input.value=''
        // }
        // setFilters(newFilters)    
    }

    //**************** SELECTABLE OPTIONS ****************************
    function DeviceOptions(props){
        const {title, item, select} = props
        function handleSelect(e){
            e.preventDefault()
            select && select(item, e.target.value)
        }

        return(
            <div className="container">
                <b>{title}:</b>
                <div className="row">
                    <div className="col">
                        <select className="form-select col"
                            defaultValue={filters.valueFilters ? filters.valueFilters[item]:undefined}
                            onChange={(event)=>handleSelect(event)}>
                            <option value=''>Sin especificar</option>
                            {options[item] && options[item].map((option, index)=><option key={index} value={option}>{option}</option>)}
                        </select>
                    </div>
                    {filters.valueFilters && filters.valueFilters[item] &&
                        <button type="button" className="btn btn-outline-danger col-1"
                            onClick={()=>deleteFilter('valueFilters',item)}                
                            style={{padding:0}}>
                                <i className="fas fa-backspace"/>
                        </button>}
                </div>
            </div>
        )
    }
    //**************** END OF SELECTABLE OPTIONS ****************************/

    return(
        <>
        <button className="btn btn-primary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
            Filtrar Equipos
        </button>

        <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasExampleLabel">Propiedades del equipo</h5>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
           <div className="offcanvas-body">

            <DeviceOptions title='Planta' item='plant' select={inputValue}/>
            <DeviceOptions title='Area' item='area' select={inputValue}/>
            <DeviceOptions title='Linea' item='line' select={inputValue}/>

                <div className="container">
                    <b>Nombre:</b>
                    <div className="row">
                        <div className="col">
                            <form className="d-flex">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Nombre total o parcial"
                                    aria-label="Search"
                                    onBlur={(e)=>setName(e.target.value)}/>
                                <button className="btn btn-outline-success col" onClick={(event)=>includeFilter('name',name, event)}>BUSCAR</button>
                            </form>
                        </div>
                        {name&&<button type="button" className="btn btn-outline-danger col-1"
                                onClick={(e)=>{
                                    e.preventDefault()
                                    setName(undefined)
                                    deleteFilter('includeFilters','name')
                                    }}                
                                style={{padding:0}}>
                                    <i className="fas fa-backspace"/>
                            </button>}
                    </div>
                </div>


                <DeviceOptions title='Tipo' item='type' select={inputValue}/>
                <RangeInput 
                        key={filters.rangeFilters ? filters.rangeFilters.power : 0}
                        title='Potencia'
                        field='power'
                        equivalency={{Frig:1,TR:3000}}
                        select={inputRange}
                        deletion={deleteFilter}/>
                <DeviceOptions title='Refrigerante' item='refrigerant' select={inputValue}/>
                <DeviceOptions title='Categoría' item='category' select={inputValue}/>
                <DeviceOptions title='Ambiente' item='environment' select={inputValue}/>
                <DeviceOptions title='Servicio' item='service' select={inputValue}/>
                <RangeInput
                        title='Antigüedad(años)'
                        field='age'
                        select={inputRange}
                        deletion={deleteFilter}/>                       
                <DeviceOptions title='Estado' item='status' select={inputValue}/>
                {plan && <RangeInput 
                        title='Reclamos'
                        field='reclaims'
                        select={inputRange}
                        deletion={deleteFilter}/>}
                {plan && <DeviceOptions title='Programa' item='program' options={options} select={inputValue} deletion={deleteFilter}/>}
            </div>
        </div>
       </>
    )
}