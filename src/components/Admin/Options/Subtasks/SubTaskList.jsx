import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subTaskActions } from "../../../../actions/StoreActions";
import { appConfig } from "../../../../config";
import { SearchInput } from "../../../ui/SearchInput";
import { CreateSubTask } from "./CreateSubTask";
import { DeleteSubTask } from "./DeleteSubTask";
const { headersRef } = appConfig;

export function SubTaskList({ handleAdd, isSubtaskDisabled }) {
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
        {handleAdd ? <div /> : <div className="card-title">"Subtareas"</div>}
        <div className="flex gap-2 items-center">
          <div className="w-80 max-w-full ml-auto">
            <SearchInput searchKey={searchKey} setSearchKey={setSearchKey} />
          </div>

          {!handleAdd && <CreateSubTask />}
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
                .map((subtask) => {
                  const { _id, devicePart, procedure, options, resultType } =
                    subtask;
                  const isDisabled = isSubtaskDisabled
                    ? isSubtaskDisabled(subtask)
                    : false;
                  return (
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
                        {handleAdd ? (
                          isDisabled ? (
                            <div title="Subtarea ya agregada">
                              <FontAwesomeIcon
                                icon={faCheck}
                                title="Subtarea ya agregada"
                                className="text-base text-success"
                              />
                            </div>
                          ) : (
                            <button
                              className="btn btn-info btn-outline btn-sm"
                              title={"Agregar esta subtarea"}
                              onClick={() => handleAdd(subtask)}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          )
                        ) : (
                          <DeleteSubTask id={_id} procedure={procedure} />
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
