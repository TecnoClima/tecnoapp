import React, { useState } from 'react'
import './index.css'
import {appConfig} from "../../config"
import {capitalize} from '../../utils/utils'

export default function Table(props){
    const [activeRow, setActiveRow]=useState('')
    const {array, headers, clickFunction, firstIndex, onHover, attrib} = props

    function handleClick(index, code){
        setActiveRow(index)
        clickFunction(code)
    }

    function checkColumnWidth(header){
        let size=0
        for (let element of array){
            if ( (' '+element[header]).length>size ) size = (' '+element[header]).length
        }
        return size>100? ' xxlCell': size>70? ' xlCell': size>40? ' lCell': ' mCell'
    }

    return(
      <table className='tableBackground'>

            <thead className='tableHead'>
                <tr className='tableHeadRow'>
                    <th className='tableHeader tableIndex'>Index</th>
                    {headers.map(header=>
                        <th className={`tableHeader ${checkColumnWidth(header)}`} key={header}>
                            {capitalize(appConfig.headersRef[header] || header)}
                        </th>
                        )}
                </tr>
            </thead>

            <tbody className='tableBody'>
                {array.map((element,index)=>
                    <tr className={`tableBodyRow ${activeRow===index?'activeRow':''}`} key={index} 
                         onMouseOver={()=>onHover && onHover(element[attrib])}
                         onClick={()=>handleClick(index,element[attrib])}>
                        <td className={`tableValue tableIndex`}><b>{firstIndex+index+1}</b></td>
                        {headers.map((header,index)=>
                           <td className={`tableValue${checkColumnWidth(header)}`} key={index}>{element[header]}</td>
                        )}
                    </tr>)}
            </tbody>

      </table>
    )
  }