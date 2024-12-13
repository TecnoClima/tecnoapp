import { useState } from "react";
import Pagination from "../Paginate/Pagination";
import TaskItem from "./TaskItem";

function CollapseTask({ list, title, className, listName, defaultChecked }) {
  const [currentPage, setCurrentPage] = useState(1);
  function handleSelectPage(e) {
    e.preventDefault();
    setCurrentPage(Number(e.target.value));
  }
  return (
    <div className={`collapse collapse-arrow ${className}`}>
      <input
        type="radio"
        name="panel-tasks"
        className="h-12 min-h-0"
        defaultChecked={defaultChecked}
      />
      <div className="collapse-title text-base sm:text-lg font-medium p-2 h-fit min-h-0">
        {title}
      </div>
      <div className="collapse-content px-2 min-h-0 overflow-y-auto">
        <div className="flex justify-center pb-2">
          <Pagination
            length={list.length}
            current={currentPage}
            select={handleSelectPage}
            size={10}
          />
        </div>
        <div className="flex flex-col gap-2 min-h-0 max-h-[65vh] overflow-y-auto">
          {list
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
