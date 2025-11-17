import { useNavigate, useSearchParams } from "react-router-dom";

export default function TableFilters() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hideNoReclaims = searchParams.get("hideNoReclaims") === "true";
  const hidePendingClose = searchParams.get("hidePendingClose") === "true";

  function handleClick(e) {
    e.preventDefault();
    const { name, value } = e.currentTarget;
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === "false") {
      newParams.delete(name);
    } else {
      newParams.set(name, value);
    }

    navigate(`/reportes?${new URLSearchParams(newParams).toString()}`);
  }

  return (
    <div className="flex w-full gap-4 pt-2">
      <button
        className={`btn btn-sm ${
          hideNoReclaims ? "btn-primary" : "btn-outline"
        }`}
        value={hideNoReclaims ? "false" : "true"}
        name="hideNoReclaims"
        onClick={handleClick}
      >
        {`${hideNoReclaims ? "Mostrar" : "Ocultar"} equipos sin Reclamos`}
      </button>
      <button
        className={`btn btn-sm ${
          hidePendingClose ? "btn-primary" : "btn-outline"
        }`}
        value={hidePendingClose ? "false" : "true"}
        name="hidePendingClose"
        onClick={handleClick}
      >
        {`${
          hidePendingClose ? "Mostrar" : "Ocultar"
        } equipos con cierres pendientes`}
      </button>
    </div>
  );
}
