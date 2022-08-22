import { useEffect, useState } from 'react'
import {appConfig} from "../../../config"
const {headersRef}=appConfig

export default function DeviceOptions(props){
    const {item, options, defaultValue}=props
    const [value, setValue]=useState(props.value)

    useEffect(() =>{
        setValue(props.value)
    }, [props.value])

    return(
        <select className={props.className || "shortDropdown"}
            onChange={(e)=>props.select(item, e)} id={`${item}Value`}
            defaultValue={defaultValue}
            value={value}>
            <option value=''>{headersRef[item] || item}</option>
            {options && options.map((element,index)=>
                <option key={index} value={element}>{element}</option>
            )}
        </select>
    )
}
