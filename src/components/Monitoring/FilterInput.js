import {
  faChevronLeft,
  faChevronRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FilterInput({
  value,
  onChange,
  placeholder = "Buscar por equipo o nombre...",
  itemsPerPage,
  onItemsPerPageChange,
  currentPage,
  totalItems,
  onPageChange,
  totalPages,
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex sm:flex-row items-center w-full gap-x-4 gap-y-2 mb-4 text-sm flex-wrap">
      {/* Input de búsqueda */}
      <div className="w-full sm:w-60 flex-grow">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-base-content/20 rounded-lg bg-base-100 text-base-content placeholder-base-content/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
          />
        </div>
      </div>

      {/* Selector de items por página y paginador */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-80 flex-grow">
        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-base-content/70 min-w-fit">
            Elementos por página:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            className="px-2 py-1 border border-base-content/20 rounded-md bg-base-100 text-base-content focus:outline-none focus:border-primary"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Paginador */}
        <div className="flex flex-col sm:flex-row items-center gap-x-4">
          {/* Información de elementos mostrados */}
          <span className="text-sm text-base-content/70 min-w-fit">
            {startItem} - {endItem} de {totalItems}
          </span>

          {/* Botones de navegación */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-xs sm:btn-sm px-2 rounded-md border border-base-content/20 bg-base-100 text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-base-100"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-xs sm:btn-sm px-2 rounded-md border border-base-content/20 bg-base-100 text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-base-100"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
