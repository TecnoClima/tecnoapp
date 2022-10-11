import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CylindersList from "../../../components/lists/CylindersList";

import { peopleActions } from "../../../actions/StoreActions";

import NewCylinder from "../../../components/forms/NewCylinder";
import { FormSelector } from "../../../components/forms/FormInput";
import { cylinderActions } from "../../../actions/StoreActions";
import { appConfig } from "../../../config";
const { cylinderStatuses } = appConfig;

export default function AdminCylinders() {
  const dispatch = useDispatch();

  const { allCylinders, refrigerants } = useSelector(
    (state) => state.adminCylinders
  );
  const { workersList, supervisors } = useSelector((s) => s.people);
  const [addCylinder, setAdd] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [filterState, setFilterState] = useState({
    user: "",
    status: "",
    refrigerant: "",
  });
  const [requested, setRequested] = useState(false);
  const statuses = cylinderStatuses.map((s) => s.name);
  // Nueva: Aún no se encuentra asignada
  // En uso: Asignada y con carga útil
  // Vacía: Sin carga
  // Descartada: Enviada a desecho
  useEffect(() => {
    if (requested) return;
    if (!workersList[0]) dispatch(peopleActions.getWorkers({ active: "all" }));
    if (!supervisors[0])
      dispatch(peopleActions.getSupervisors({ active: "all" }));
    if (!allCylinders[0]) dispatch(cylinderActions.getList());
    if (!refrigerants[0]) dispatch(cylinderActions.getGases());
    setRequested(true);
  }, [
    requested,
    workersList,
    supervisors,
    allCylinders,
    refrigerants,
    dispatch,
  ]);

  useEffect(
    () =>
      setFilteredList(
        allCylinders.filter((c) => {
          const { user, status, refrigerant } = filterState;
          if (user && (!c.user || c.user.id !== user)) return false;
          if (status && c.status !== status) return false;
          if (refrigerant && c.refrigerant !== refrigerant) return false;
          return true;
        })
      ),
    [allCylinders, filterState]
  );

  function setFilter(event) {
    event.preventDefault();
    const newFilter = { ...filterState };
    const { name, value } = event.target;
    newFilter[name] = isNaN(value) ? value : Number(value);
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
              options={workersList}
              valueField="idNumber"
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
            workers={workersList}
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
