import { useEffect, useState } from "react";
// import { useSelector } from 'react-redux'
import AddIntervention from "../../forms/InterventionForm";
import "./index.css";
import WorkOrderCard from "../../workOrder/WorkOrderCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import InterventionCard from "./interventionCard";

export default function InterventionList(props) {
  const { onDelete, openAdd, permissions, interventions } = props;
  const [edit, setEdit] = useState(false);

  function handleDelete(e, id) {
    e.preventDefault();
    onDelete(id);
  }

  return (
    <>
      <WorkOrderCard
        title="INTERVENCIONES"
        headerButton={
          <button
            className="btn btn-xs btn-info mb-1 font-bold"
            onClick={openAdd}
          >
            <FontAwesomeIcon icon={faPlus} />
            Agregar intervención
          </button>
        }
      >
        {interventions?.[0] ? (
          interventions.map((item, index) => (
            <InterventionCard
              key={index}
              item={item}
              permissions={permissions}
              index={index}
              handleDelete={handleDelete}
              setEdit={setEdit}
            />
          ))
        ) : (
          <p>No hay intervenciones registradas</p>
        )}
      </WorkOrderCard>
      {edit && (
        <AddIntervention
          select={() => {}}
          close={() => setEdit(false)}
          data={edit}
        />
      )}
    </>
  );
}
