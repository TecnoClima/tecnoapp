import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CylindersList from "../../../components/lists/CylindersList";

import { getEmpleados } from "../../../actions/StoreActions";

import NewCylinder from "../../../components/forms/NewCylinder";
import { FormSelector } from "../../../components/forms/FormInput";
import { cylinderActions } from "../../../actions/StoreActions";

export default function AdminCylinders() {
  const dispatch = useDispatch();

  const { allCylinders, workers, refrigerants } = useSelector( (state) => state.adminCylinders )
  const [addCylinder, setAdd] = useState(false)
  const [filteredList, setFilteredList] = useState([])
  const [filterState, setFilterState] = useState({});
  const statuses = ["Nueva", "En uso", "Vacia", "Descartada"];


  useEffect(() => {
    dispatch(getEmpleados())
    dispatch(cylinderActions.getGases())
    dispatch(cylinderActions.getList())
  }, [dispatch]);

  useEffect(()=>setFilteredList(allCylinders.filter(cylinder=>{
    let check = true
    for (let key of Object.keys(filterState) ){
        const cylinderValue = (key === 'user' && cylinder.user) ? cylinder[key].id : cylinder[key]
        if ( cylinderValue !== filterState[key] ) check=false
    }
    return check
  })),[filterState,allCylinders])

  function setFilter(event){
    event.preventDefault()
    const newFilter = {...filterState}
    const {name, value} = event.target
    value? newFilter[name] = ( name === 'user'? Number(value) : value) : delete newFilter[name]
    setFilterState(newFilter)
  }

  return (
    <div className="adminOptionSelected">
      <div className="formTitle">Administración de Garrafas</div>

      <button className='button' title="Agregar Garrafa" onClick={() => setAdd(true)} style={{marginBottom:'.5rem'}}>
          Agregar Garrafa
        </button>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 2fr', textAlign: 'center'}}>
        <b>Filtros:</b>
        <FormSelector label='Responsable' name='user' options={workers} valueField='id' captionField='name' onSelect={setFilter}/> 
        <FormSelector label='Estado' name='status' options={statuses} onSelect={setFilter}/> 
        <FormSelector label='Refrigerante' name='refrigerant' options={refrigerants.map(r=>r.refrigerante)} onSelect={setFilter}/> 
      </div>

      <CylindersList
        cylinders={filteredList}
        workers={workers}
        refrigerants={refrigerants}
        statuses={statuses}
      />

      {addCylinder && <NewCylinder key={allCylinders.length} onClose={()=>setAdd(false)} statuses={statuses}/>}
    </div>
  );
}
