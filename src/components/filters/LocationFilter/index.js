// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getLineServicePoints, getPlantList, getPlantLocationTree } from "../../../actions/dataActions";
// import './index.css'

// export default function LocationFilter(props){
//     const {select} = props
//     const {locationTree} = useSelector(state=>state.data)
//     const {servicePointList} = useSelector(state=>state.data)
//     const {userData} = useSelector(state=>state.people)
//     const dispatch = useDispatch()
//     const [plant, setPlant] = useState(userData.plant)
//     const [filter, setFilter] =useState({plant: undefined, area:undefined, line:undefined, servicePoint:undefined})
//     const [areas, setAreas]=useState([])
//     const [lines, setLines]=useState([])
//     const [plants, setPlants]=useState([])

//     useEffect(()=>(!userData.plant || userData.access==='Admin') && dispatch(getPlantList()),[userData, dispatch])
//     useEffect(()=>setPlants(Object.keys(locationTree)),[locationTree])

//     function deleteFields(json,fields){
//         for(let field of fields){
//             delete json[`${field}Name`]
//             const element = document.getElementById(`${field}Selector`)
//             if(element) element.value=''
//         }
//         return json
//     }

//     function handleLocation(item,name){
//         let newFilter = {...filter}
//         const {plant, area, line} = {newFilter}
//         switch (item){
//             case 'plant':
//                 newFilter = name?{plantName:name}:{}
//                 setPlant(plant)
//             break;
//             case 'area':
//                 newFilter = {plant, area:name}
//                 name && setLines(locationTree[plant][name])
//             break;
//             case 'line':
//                 newFilter = {plant, area, line:name}
//                 newFilter = deleteFields(newFilter, name===''?['line','sp']:['sp'])
//                 name && dispatch(getLineServicePoints(name))
//             break;
//             case 'sp':
//                 newFilter = {plant, area, line, servicePoint:name}
//                 !name && delete newFilter.spName
//             break;
//             default: break;
//         }
//         if(name!=='') newFilter[`${item}Name`]=name
//         setFilter(newFilter)
//         select && select(newFilter)
//     }

//     useEffect(()=>{
//         if(plant){
//             dispatch(getPlantLocationTree(plant))
//             setFilter({plantName:plant})
//             deleteFields({}, ['area', 'line', 'sp'])
//         }
//     },[dispatch, plant])

//     useEffect(()=>setFilter({plantName: plant}),[plant])
//     useEffect(()=>{locationTree[plant] && setAreas(Object.keys(locationTree[plant]))},[locationTree,plant])

//     function LocationSelect(title, array, item, parent){
//         return(
//             <select className="form-select" id={`${item}Selector`} 
//                 onChange={(e)=>handleLocation(item,e.target.value)}
//                 defaultValue={filter[`${item}Name`]}
//                 disabled={parent? !filter[`${parent}Name`] : undefined}>
//                 <option value='' >{title}</option>
//                 {array && array.map((element, index)=>
//                     <option key={index} value={element}>{element}</option>
//                 )}
//             </select>
//         )
//     }

//     return(
//         <>
//             <button className="btn btn-primary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
//                 Filtrar Ubicación
//             </button>
//             <div className="collapse" id="collapseExample">
//                     {LocationSelect('Planta', plants, 'plant')}
//                 <div>
//                     {LocationSelect('Area', areas, 'area', 'plant')}
//                 </div>
//                 <div>
//                     {LocationSelect('Linea', lines, 'line', 'area')}
//                 </div>
//                 <div>
//                     {LocationSelect('Lugar de Servicio', servicePointList, 'sp', 'line')}
//                 </div>
//             </div>
//         </>
//     )
// }