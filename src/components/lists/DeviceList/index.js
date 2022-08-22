import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions } from "../../../actions/StoreActions";
import { useNavigate } from "react-router-dom";
import DeviceFilters from "../../filters/DeviceFilters";
import Paginate from "../../Paginate";

export default function DeviceList({close}){
    const {deviceFullList} = useSelector(state=>state.devices)
    const {userData} = useSelector(state=>state.people)
    const [filteredList, setFilteredList] = useState(deviceFullList)
    const [page, setPage] =useState({first:0, size:20})

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>setFilteredList(deviceFullList),[deviceFullList])
    useEffect(()=>dispatch(deviceActions.getFullList(userData.plant)),[dispatch, userData])

    function handleSelect(e, code){
        e.preventDefault()
        const device = deviceFullList.find(device=>device.code === code)
        dispatch(deviceActions.setDevice(device))
        close? close() : navigate(`./${code}`, { replace: true })
    }

    return(
        <div className="container-fluid h-100 d-flex flex-column">
            <div className='row'>
                <div className='col d-flex'>
                    <b className="me-2">Filtros: </b>
                    <DeviceFilters list={deviceFullList} select={setFilteredList}/>
                </div>
            </div>
            <div className='row' style={{height:'70vh', overflowY:'auto'}}>
                <div className="col">
                    <table className="table table-hover" style={{fontSize: '80%'}}>
                        <thead>
                            <tr>
                                <th scope="col">Codigo Eq.</th>
                                <th scope="col">Nombre</th>
                                <th scope="col" className="text-center">Tipo</th>
                                <th scope="col" className="text-center">Potencia [kCal]</th>
                                <th scope="col" className="text-center">Potencia [TR]</th>
                                <th scope="col" className="text-center">Refrigerante</th>
                                <th scope="col" className="text-center">Categoría</th>
                                <th scope="col" className="text-center">Ambiente</th>
                                <th scope="col" className="text-center">Servicio</th>
                                <th scope="col" className="text-center">Antigüedad</th>
                                <th scope="col" className="text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList[0] &&
                                filteredList.slice(page.first, page.first+page.size)
                                .map((device, index)=>{
                                    return<tr key={index} style={{cursor:'pointer'}} onClick={(e)=>handleSelect(e,device.code)}>
                                        <th style={{minWidth: '5rem'}}>{device.code}</th>
                                        <td>{device.name}</td>
                                        <td className="text-center">{device.type}</td>
                                        <td className="text-center">{device.power}</td>
                                        <td className="text-center">{Math.floor(device.power/3000)}</td>
                                        <td className="text-center">{device.refrigerant}</td>
                                        <td className="text-center">{device.category}</td>
                                        <td className="text-center">{device.environment}</td>
                                        <td className="text-center">{device.service}</td>
                                        <td className="text-center">{device.age} años</td>
                                        <td className="text-center">{device.status}</td>
                                    </tr>}
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row m-auto">
                <Paginate pages={Math.ceil(filteredList.length / page.size)}
                    length='10'
                    min='5'
                    step='5'
                    defaultValue={page.size}
                    select={(value)=>setPage({...page,first: (Number(value) -1) * page.size })} 
                    size={(value)=>setPage({...page, size: Number(value)})}
                    />
            </div>
        </div>
    )
}