import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CylindersList from "../../../components/lists/CylindersList";

import { peopleActions } from "../../../actions/StoreActions";

import { cylinderActions } from "../../../actions/StoreActions";
import { FormSelector } from "../../../components/forms/FormInput";
import NewCylinder from "../../../components/forms/NewCylinder";
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
    <div className="page-container">
      <div className="flex justify-between flex-wrap items-center">
        <div className="page-title">Administración de Garrafas</div>
        <button
          className="btn btn-success btn-sm mb-3"
          onClick={() => setAdd(true)}
        >
          Agregar Garrafa
        </button>
      </div>
      <div className="flex flex-col md:flex-row w-full gap-x-4">
        <FormSelector
          label="Responsable"
          name="user"
          options={workersList}
          valueField="idNumber"
          captionField="name"
          onSelect={setFilter}
        />
        <FormSelector
          label="Estado"
          name="status"
          options={statuses}
          onSelect={setFilter}
        />
        <FormSelector
          label="Refrigerante"
          name="refrigerant"
          options={refrigerants.map((r) => r.refrigerante)}
          onSelect={setFilter}
        />
      </div>
      <div className="flex-grow overflow-auto">
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
  );
}
