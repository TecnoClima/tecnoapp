import {appConfig} from "../../config"
import './index.css'

export default function JsonViewer(props){
    const json = props.json || {}
    const headers = json?Object.keys(json):[]
    return(
      <div className='JsonViewerBackground'>
        {props.title&&<div className='JsonViewerTitle'>{props.title}</div>}
        {headers.map((header,index)=>
            <div className='JsonViewerLine' key={index}>
                <div className='JsonViewerLineTitle'>{appConfig.headersRef[header] || header}:</div>
                {json[header]}
            </div>
        )}
      </div>
    )
  }