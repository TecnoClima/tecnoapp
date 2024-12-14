import { useEffect, useState } from "react";
import Pagination from "../Paginate/Pagination";
import TaskItem from "./TaskItem";
import TextInput from "../forms/FormFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function CollapseTask({ list, title, className, listName, defaultChecked }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [filteredList, setFilteredList] = useState(list);
  function handleSelectPage(e) {
    e.preventDefault();
    setCurrentPage(Number(e.target.value));
  }

  useEffect(() => {
    if (searchKey?.length < 3) {
      setFilteredList(list);
    } else {
      setFilteredList(
        list.filter((object) =>
          Object.keys(object)
            .filter((key) => key !== "id")
            .find((key) =>
              `${object[key].name || object[key]}`
                .toLowerCase()
                .includes(searchKey.toLowerCase())
            )
        )
      );
    }
    setCurrentPage(1);
  }, [list, searchKey]);

  return (
    <div className={`collapse collapse-arrow min-h-12 ${className}`}>
      <input
        type="radio"
        name="panel-tasks"
        className="h-12 min-h-12"
        defaultChecked={defaultChecked}
      />
      <div className="collapse-title text-base sm:text-lg font-medium p-2 h-fit min-h-12">
        {title}
      </div>
      <div className="collapse-content flex flex-col flex-grow px-2 min-h-0 overflow-y-auto h-full">
        <div className="flex w-full justify-between items-center flex-wrap gap-2 pb-2">
          <div className="flex gap-2 items-center text-base-100 w-fit mx-auto sm:ml-0 sm:mr-auto">
            <TextInput
              className=""
              name="newPassword"
              handleChange={(e) => setSearchKey(e.target.value)}
              value={searchKey}
              placeholder="3 caracteres o más"
            />
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <div className="w-fit mx-auto sm:mr-0 sm:ml-auto">
            <Pagination
              length={filteredList.length}
              current={currentPage}
              select={handleSelectPage}
              size={10}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 min-h-0 max-h-[calc(100%-2.5rem)] flex-grow overflow-y-auto">
          {filteredList
            .slice((currentPage - 1) * 10, currentPage * 10)
            .map((task, index) => (
              <TaskItem key={index} task={task} className={listName} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default function TaskList({ pendant, current, next, loading }) {
  return (
    <div className="flex flex-col h-full">
      <div className="page-title">Pendientes del plan</div>
      <div className="flex flex-col gap-2 flex-grow overflow-y-auto">
        <CollapseTask
          list={pendant}
          title={
            loading ? (
              <p>
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Cargando pendientes...
              </p>
            ) : (
              `${
                pendant[0] ? pendant.length + " P" : "No hay p"
              }endientes hasta la semana pasada`
            )
          }
          loadingMessage="Cargando pendientes..."
          className="bg-error/50"
          listName="pendant"
        />
        <CollapseTask
          list={current}
          title={
            loading ? (
              <p>
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Cargando pendientes...
              </p>
            ) : (
              `${
                current[0] ? current.length + " P" : "No hay p"
              }endientes de esta semana pasada`
            )
          }
          loadingMessage="Cargando pendientes..."
          className="bg-warning/50"
          listName="current"
          defaultChecked
        />
        <CollapseTask
          list={next}
          title={
            loading ? (
              <p>
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Cargando tareas
              </p>
            ) : (
              `${
                current[0] ? current.length + " T" : "No hay t"
              }areas para la próxima semana`
            )
          }
          className="bg-info/50"
          listName="next"
        />
      </div>
    </div>
  );
}
