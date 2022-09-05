import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cylinderActions } from "../../../actions/StoreActions";
import NewCylinder from "../../forms/NewCylinder";
import "./index.css";

export default function CylindersList({ cylinders, workers, statuses }) {
  const { refrigerants } = useSelector((state) => state.adminCylinders);
  const [cylinder, selectCylinder] = useState(false);
  const dispatch = useDispatch();

  //Función boton editar una garrafa de la lista
  const handleEditCylinder = (id) => {
    const cylinder = { ...cylinders.find((e) => e.id === id) };
    if (!cylinder.assignedTo && cylinder.user)
      cylinder.assignedTo = cylinder.user;
    delete cylinder.user;
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

      <table className="table table-striped" style={{ textAlign: "center" }}>
        <thead>
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
              const user = element.user
                ? workers.find((e) => e.id === element.user.id)
                : "STOCK";
              return (
                <tr key={index}>
                  <td>
                    <b>{element.code}</b>
                  </td>
                  {/* <td>{element.user? workers.find(e=>e.id===element.user).name : 'STOCK'}</td> */}
                  <td className={user ? "" : "crossedUp"}>
                    {element.user ? element.user.name : "STOCK"}
                    {user ? (
                      ""
                    ) : (
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
                  <td>
                    <button
                      className="btn btn-danger"
                      title="Eliminar"
                      onClick={() =>
                        dispatch(cylinderActions.delete(element.id))
                      }
                      style={{ margin: "0" }}
                      value={element.id}
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                    <button
                      className="btn btn-info"
                      title="Modificar"
                      value={element._id}
                      style={{ margin: "0 .2rem" }}
                      onClick={() => handleEditCylinder(element.id)}
                    >
                      <i className="fas fa-pencil-alt" />
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
