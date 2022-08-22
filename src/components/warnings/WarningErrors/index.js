import { useState } from "react"

export default function WarningErrors(props){
    const {proceed, close} = props
    const [warnings, setWarnings] = useState(props.warnings)
    function deleteWarning(e){
        e.preventDefault()
        const index = Number(e.target.value)
        const newList = [...warnings]
        newList.splice(index,1)
        if (newList[0]){
            setWarnings(newList)
        }else{
            proceed()
            close()
        }
    }

    return(
        <div className="modal">
            <div className="alert alert-warning" role="alert">
            <div className="container p-0">
            <div className="row" style={{alignItems: 'center'}}>
                <div className="col-12">
                    <h3 style={{textAlign: 'center'}}>¡CUIDADO!</h3>
                </div>
            </div>
                {warnings.map((warning, index)=>
                <div className="row" key={index} style={{alignItems: 'center'}}>
                    <div className="col-8">{warning}</div>
                    <div className="col-2"><button type="button" className="btn btn-success p-0" value={index} style={{width:'100%'}} onClick={deleteWarning}>SI</button></div>
                    <div className="col-2"><button type="button" className="btn btn-warning p-0" value={index} style={{width:'100%'}} onClick={()=>close()}>NO</button></div>
                </div>)}
                </div>
            </div>
        </div>
    )
}