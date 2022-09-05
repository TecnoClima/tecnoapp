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

  const { allCylinders, workers, refrigerants } = useSelector(
    (state) => state.adminCylinders
  );
  const [addCylinder, setAdd] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [filterState, setFilterState] = useState({});
  const statuses = ["Nueva", "En uso", "Vacia", "Descartada"];

  useEffect(() => {
    dispatch(getEmpleados());
    dispatch(cylinderActions.getGases());
    dispatch(cylinderActions.getList());
  }, [dispatch]);

  useEffect(
    () =>
      setFilteredList(
        allCylinders.filter((cylinder) => {
          let check = true;
          for (let key of Object.keys(filterState)) {
            const cylinderValue =
              key === "user" && cylinder.user
                ? cylinder[key].id
                : cylinder[key];
            if (cylinderValue !== filterState[key]) check = false;
          }
          return check;
        })
      ),
    [filterState, allCylinders]
  );

  function setFilter(event) {
    event.preventDefault();
    const newFilter = { ...filterState };
    const { name, value } = event.target;
    value
      ? (newFilter[name] = name === "user" ? Number(value) : value)
      : delete newFilter[name];
    setFilterState(newFilter);
  }

  return (
    <div className="adminOptionSelected pt-4 px-2">
      <div className="container">
        <div className="row">
          <h4 className="col-sm-8">Administración de Garrafas</h4>
          <button
            className="btn btn-success col-sm-4"
            onClick={() => setAdd(true)}
          >
            Agregar Garrafa
          </button>
        </div>

        <div className="row my-2">
          <div className="col-md-auto">
            <label className="py-1 fw-bold text-center">Filtros</label>
          </div>
          <div className="col-md-3">
            <FormSelector
              label="Responsable"
              name="user"
              options={workers}
              valueField="id"
              captionField="name"
              onSelect={setFilter}
            />
          </div>
          <div className="col-md-3">
            <FormSelector
              label="Estado"
              name="status"
              options={statuses}
              onSelect={setFilter}
            />
          </div>
          <div className="col-md-3">
            <FormSelector
              label="Refrigerante"
              name="refrigerant"
              options={refrigerants.map((r) => r.refrigerante)}
              onSelect={setFilter}
            />
          </div>
        </div>

        <div className="row flex- overflow-scroll">
          <CylindersList
            cylinders={filteredList}
            workers={workers}
            refrigerants={refrigerants}
            statuses={statuses}
          />

          {addCylinder && (
            <NewCylinder
              key={allCylinders.length}
              onClose={() => setAdd(false)}
              statuses={statuses}
            />
          )}
        </div>
      </div>
    </div>
  );
}
