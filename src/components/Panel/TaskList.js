import TaskItem from "./TaskItem";

export default function TaskList({ pendant, current, next, loading }) {
  return (
    <div className="flex flex-col h-full">
      <div className="page-title">Pendientes del plan</div>
      <div className="flex flex-col gap-2 flex-grow overflow-y-auto">
        <div className="collapse collapse-arrow bg-error/50">
          <input type="radio" name="my-accordion-2" className="h-12 min-h-0" />
          <div className="collapse-title text-base sm:text-lg font-medium p-2 h-fit min-h-0">
            {loading
              ? "Cargando pendientes..."
              : `${
                  pendant[0] ? pendant.length + " P" : "No hay p"
                }endientes hasta la semana pasada`}
          </div>
          <div className="collapse-content px-2 min-h-0 overflow-y-auto">
            <div className="flex flex-col gap-2 min-h-0 max-h-[65vh] overflow-y-auto">
              {pendant.map((task, index) => (
                <TaskItem key={index} task={task} className="pendant" />
              ))}
            </div>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-warning/50">
          <input
            type="radio"
            name="my-accordion-2"
            className="h-12 min-h-0"
            defaultChecked
          />
          <div className="collapse-title text-base sm:text-lg font-medium p-2 h-fit min-h-0">
            {loading
              ? "Cargando pendientes..."
              : `${
                  loading
                    ? "Cargando p"
                    : current[0]
                    ? current.length + " P"
                    : "No hay p"
                }endientes de esta semana`}
          </div>
          <div className="collapse-content px-2">
            <div className="flex flex-col gap-2 min-h-0 max-h-[65vh] overflow-y-auto">
              {current.map((task, index) => (
                <TaskItem key={index} task={task} className="current" />
              ))}
            </div>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-info/50">
          <input type="radio" name="my-accordion-2" className="h-12 min-h-0" />
          <div className="collapse-title text-base sm:text-lg font-medium py-2 h-fit min-h-0 py-auto">
            {loading ? "Cargando taras" : `Tareas de la próxima semana`}
          </div>
          <div className="collapse-content">
            <div className="flex flex-col gap-2 min-h-0 max-h-[65vh] overflow-y-auto">
              {next.map((task, index) => (
                <TaskItem key={index} task={task} className="next" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
