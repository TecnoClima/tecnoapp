import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './index.css'


export default function WOList(props){
    const [mostRecent, setMostRecent]=useState(props.mostRecent)
    useEffect(()=>setMostRecent(props.mostRecent),[props.mostRecent])

    return(
      <div className="container-fluid p-1" style={{fontSize: '85%', maxHeight:'100%', overflowY:'auto'}}>
        <div className="row m-0">
          <div className="col p-0">
            <h5 className="fw-bold text-center"><u>10 reclamos más recientes</u></h5>
            {mostRecent[0]&&mostRecent.map((ot, index)=>
            <div className={`container-fluid mb-2 p-0`} key={index}>
                <div className="row m-0">
                  <div className="col-sm-11 px-1">
                    <div className={`container-fluid p-0 ${ot.status==='Cerrada'? 'bg-success': 'bg-danger'} bg-opacity-25 px-0 py-1 rounded`}>
                      <div className="row m-0">
                        <div className="col-sm-auto">
                          <b>N° {ot.code}</b> ({ot.status})
                        </div>
                        <div className="col-sm-auto">
                          {`${ot.area} > ${ot.line} > `}<b>{ot.device}</b>
                        </div>
                      </div>
                      <div className="row m-0">
                        <div className="col-sm-7 pe-0">
                          <b>Motivo</b> {ot.initIssue}({ot.cause})
                        </div>
                        <div className="col-sm-5">
                          <b>{ot.solicitor.name}</b>{` (${ot.solicitor.phone}) ${ot.registration.split("T")[0]}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-1 px-0 d-flex align-items-center">
                    <Link className="btn btn-info w-100 px-0 mx-1" to={`/ots/detail/${ot.code}`}>
                      <i className="fas fa-search-plus"/>
                    </Link>
                  </div>
                </div>
            </div>)}
            </div>
        </div>
        <div className="row">

        </div>
      </div>
    )
}