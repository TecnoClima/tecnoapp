import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPlantList, getPlantLocationTree } from "../../actions/dataActions"
import { cloneJson } from "../../utils/utils"
import DropdownChoice from "./DropdownChoice"

export default function GetLocationTree(props){
    const {locationTree} =useSelector(state=>state.data)
    const [locations, setLocations]=useState(props.plant?{plantName:props.plant}:{})
    const dispatch = useDispatch()

    useEffect(()=>dispatch(getPlantList()),[dispatch])
    useEffect(()=>locations.plantName && dispatch(getPlantLocationTree(locations.plantName)),[dispatch, locations])

    function selectLocation(item, value){
        let obj=cloneJson(locations)
        if(value==='0'){
            let check = false
            for (let key of Object.keys(obj)){
                if(key===item)check=true
                check&& delete obj[key]
            }
        }else{
            obj[item] = value
            item==='plantName' && dispatch(getPlantLocationTree(value))
        }
        setLocations(obj)
        props.pickerFunction && props.pickerFunction(obj)
    }
    
    return(
        <div>
            {!props.plant && Object.keys(locationTree).length>0&&
                DropdownChoice('plantName', Object.keys(locationTree), selectLocation)}

            {locations.plantName && locationTree[locations.plantName] && 
                    DropdownChoice('area', Object.keys(locationTree[locations.plantName]), selectLocation) }

            {locations.area && 
                DropdownChoice('line', locationTree[locations.plantName][locations.area], selectLocation)
            }            

        </div>
    )
}
