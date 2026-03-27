import { CreateSubTask } from "./CreateSubTask";
import { useDispatch, useSelector } from "react-redux";
import { subTaskActions } from "../../../actions/StoreActions";
import { useEffect, useState } from "react";
import { DeleteSubTask } from "./DeleteSubTask";
import { appConfig } from "../../../config";
const { headersRef } = appConfig;

export function SubTaskList() {
  const { list: subtaskList } = useSelector((state) => state.subTasks);
  const dispatch = useDispatch();
  useEffect(() => dispatch(subTaskActions.getList()), [dispatch]);

  return (
    <div className="relative card w-full bg-base-content/5 p-2">
      <div className="card-title">Subtareas</div>
      <div className="absolute top-2 right-2">
        <CreateSubTask />
      </div>
      <div className="overflow-auto">
        {!!subtaskList?.[0] && (
          <table className="table text-center no-padding">
            <thead>
              <tr>
                <th>Parte / Lugar</th>
                <th>Procedimiento</th>
                <th>Tipo de Respuesta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subtaskList.map(
                ({ _id, devicePart, procedure, options, resultType }) => (
                  <tr key={_id}>
                    <td className="p-0 min-w-fit whitespace-nowrap">
                      {devicePart.label}
                    </td>
                    <td className="p-0 w-full">{procedure}</td>
                    <td className="p-0 min-w-fit whitespace-nowrap">
                      {options?.length > 1
                        ? options.join(" / ")
                        : `Ingresar ${headersRef[resultType]}`}
                    </td>
                    <td className="p-0">
                      <DeleteSubTask id={_id} procedure={procedure} />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
