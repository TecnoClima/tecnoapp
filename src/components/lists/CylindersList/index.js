import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cylinderActions } from "../../../actions/StoreActions";
import NewCylinder from "../../forms/NewCylinder";

import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CylindersList({ cylinders, workers, statuses }) {
  const { refrigerants } = useSelector((state) => state.adminCylinders);
  const [cylinder, selectCylinder] = useState(false);
  const dispatch = useDispatch();

  //Función boton editar una garrafa de la lista
  const handleEditCylinder = (id) => {
    const cylinder = { ...cylinders.find((e) => e.id === id) };
    // if (!cylinder.assignedTo && cylinder.user)
    //   cylinder.assignedTo = cylinder.user;
    // delete cylinder.user;
    cylinder.refrigerant = refrigerants.find(
      (r) => r.code === cylinder.refrigerant
    ).id;
    selectCylinder(cylinder);
  };
  //Fin funciones para editar una garrafa de la lista

  return (
    <div>
      {cylinder && (
        <NewCylinder
          cylinder={cylinder}
          onSave={() => {}}
          statuses={statuses}
          onClose={() => selectCylinder(false)}
        />
      )}

      <table className="table no-padding text-center">
        <thead className="sticky bg-base-100 top-0">
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Asignado</th>
            <th scope="col">Estado</th>
            <th scope="col">Entregada</th>
            <th scope="col">Stock Inicial</th>
            <th scope="col">Stock Actual</th>
            <th scope="col">Refrigerante</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cylinders[0] &&
            cylinders.map((element, index) => {
              const { user } = element;
              return (
                <tr
                  key={index}
                  className="relative group hover:bg-base-content/5 cursor-pointer"
                  onClick={() => handleEditCylinder(element.id)}
                >
                  <td>
                    <FontAwesomeIcon
                      icon={faPencil}
                      className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    <b>{element.code}</b>
                  </td>
                  {/* <td>{element.user? workers.find(e=>e.id===element.user).name : 'STOCK'}</td> */}
                  <td className={user && !user.active ? "crossedUp" : ""}>
                    {element.user ? element.user.name : "STOCK"}
                    {user && user.active === false && (
                      <i
                        className="fas fa-ban"
                        style={{ color: "darkred" }}
                        title="inactivo"
                      />
                    )}
                  </td>
                  <td>{element.status}</td>
                  <td>
                    {element.givenDate
                      ? new Date(element.givenDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{element.initialStock}</td>
                  <td>{element.currentStock}</td>
                  <td>{element.refrigerant}</td>
                  <td className="text-start">
                    <button
                      className="btn btn-error btn-outline btn-sm btn-square"
                      title="Eliminar"
                      onClick={() =>
                        dispatch(cylinderActions.delete(element.id))
                      }
                      style={{ margin: "0" }}
                      value={element.id}
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
