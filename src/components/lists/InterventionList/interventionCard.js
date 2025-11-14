import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import {
  faCalendarCheck,
  faPencilAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ActionButtons({ setEdit, handleDelete, permissions, index, item }) {
  return (
    <>
      <button
        className="btn btn-xs btn-square btn-ghost text-info text-base"
        title="Editar"
        onClick={() => setEdit(item)}
      >
        <FontAwesomeIcon icon={faPencilAlt} />
      </button>
      {(!item?.id || permissions?.admin) && (
        <button
          className="btn btn-xs btn-square btn-ghost text-error text-base"
          title="Eliminar"
          onClick={(e) => handleDelete(e, index)}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      )}
    </>
  );
}

export default function InterventionCard({
  permissions,
  index,
  handleDelete,
  setEdit,
  item,
}) {
  const { date, time, endDate, endTime, workers, task, refrigerant } = item;
  const initialDate = time ? `${date.split(" ")[0]}T${time}` : `${date}`;
  const finishDate = endTime
    ? `${endDate.split(" ")[0]}T${endTime}`
    : `${endDate}`;
  function getDate(dateInput) {
    const givenDate = new Date(dateInput);
    if (isNaN(givenDate.getTime())) return ["", ""];
    const date = givenDate.toISOString().split("T")[0];
    const argDate = date.split("-").reverse().join("/");
    let hours = givenDate.getHours();
    let minutes = givenDate.getMinutes();
    const time = `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;
    return [argDate, time];
  }

  return (
    <div className="flex flex-col w-full xl:flex-row xl:text-sm gap-1 text-xs bg-base-content/5 xl:p-2 rounded-md">
      <div className="flex">
        <div className="flex xl:flex-col xl:items-start xl:gap-2 flex-wrap items-center gap-x-1 xl:gap-x-4 w-full lg:w-fit">
          <div className="join flex-grow xl:flex-grow-0 max-w-40">
            <div
              className="xl:flex xl:items-center join-item bg-base-100 text-center font-semibold px-1 xl:px-2"
              title="Fecha Inicio"
            >
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div className="join-item bg-base-content/10 px-1 xl:px-2">
              {getDate(initialDate).join(" ")}
            </div>
          </div>
          <div
            className={`join flex-grow xl:flex-grow-0 max-w-40 ${
              !endDate ? "border border-error text-error" : ""
            }`}
          >
            <div
              className="xl:flex xl:items-center join-item bg-base-100 text-center font-semibold px-1 xl:px-2"
              title="Fecha Fin"
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
            <div className="join-item bg-base-content/10 px-1 xl:px-2 whitespace-nowrap flex-grow ">
              {endDate ? getDate(finishDate).join(" ") : "-"}
            </div>
          </div>
        </div>
        <div className="flex xl:hidden">
          <ActionButtons
            setEdit={setEdit}
            handleDelete={handleDelete}
            permissions={permissions}
            item={item}
            index={index}
          />
        </div>
      </div>
      <div className="flex-grow">
        <div className="px-2 pb-1">
          <b>{workers.map((e) => e.name).join(", ")}</b>
        </div>
        <div className="px-2">{task}</div>
      </div>
      <div className="join xl:join-vertical w-full xl:w-fit">
        <div
          className="join-item bg-base-100 text-center font-semibold px-1 xl:px-2"
          title="Fecha Fin"
        >
          Gas
        </div>
        <div className="join-item  bg-base-content/10">
          {/* {refrigerant} kg. */}
          <div className="flex xl:flex-col xl:gap-1 xl:py-1 xl:text-end">
            {refrigerant.map((cyl, index) => (
              <div
                className={` px-1 xl:px-2 ${
                  index !== 0
                    ? "border-l border-base-content/10 xl:border-none whitespace-nowrap xl:w-24"
                    : ""
                }`}
                key={cyl.code || index}
              >
                <p>
                  <b>
                    {cyl.code ? `${cyl.code}: ` : index !== 0 ? "Total: " : ""}
                  </b>
                  {cyl.total}kg.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden xl:flex flex-col gap-2">
        <ActionButtons
          setEdit={setEdit}
          handleDelete={handleDelete}
          permissions={permissions}
          index={index}
        />
      </div>
    </div>
  );
}
