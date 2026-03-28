import { CreateSubTask } from "./CreateSubTask";
import { useDispatch, useSelector } from "react-redux";
import { subTaskActions } from "../../../../actions/StoreActions";
import { useEffect, useState } from "react";
import { DeleteSubTask } from "./DeleteSubTask";
import { appConfig } from "../../../../config";
import { SearchInput } from "../../../ui/SearchInput";
const { headersRef } = appConfig;

export function SubTaskList() {
  const { list: subtaskList } = useSelector((state) => state.subTasks);
  const [searchKey, setSearchKey] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        subTaskActions.getList(
          searchKey ? { procedure: searchKey } : undefined,
        ),
      );
    }, 1000); // ⏱️ 1 segundo

    // 🧹 Cleanup: cancela el timeout anterior si searchKey cambia
    return () => clearTimeout(timeoutId);
  }, [dispatch, searchKey]);

  return (
    <div className="relative card w-full bg-base-content/5 p-2">
      <div className="w-full justify-between flex">
        <div className="card-title">Subtareas</div>
        <div className="flex gap-2 items-center">
          <div className="w-80 max-w-full ml-auto">
            <SearchInput searchKey={searchKey} setSearchKey={setSearchKey} />
          </div>

          <CreateSubTask />
        </div>
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
              {subtaskList
                .filter(({ procedure }) =>
                  procedure.toLowerCase().includes(searchKey.toLowerCase()),
                )
                .map(({ _id, devicePart, procedure, options, resultType }) => (
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
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
