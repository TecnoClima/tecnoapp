import {
  faChevronRight,
  faExclamationTriangle,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { monitorActions } from "../../actions/monitoringActions";
import ternium from "../../assets/icons/ternium.jpg";
import FilterInput from "../../components/Monitoring/FilterInput";

export default function Monitoring() {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    monitorActions.list((arg) => setData(arg));
  }, []);

  // Filtrar datos basado en el texto ingresado
  const filteredData = useMemo(() => {
    if (!filterText.trim()) {
      return data;
    }

    return data.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.equipo?.toLowerCase().includes(searchText) ||
        item.nombre?.toLowerCase().includes(searchText)
      );
    });
  }, [data, filterText]);

  // Calcular datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Resetear página cuando cambie el filtro o itemsPerPage
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, itemsPerPage]);

  // Handlers para paginación
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
  };

  return (
    <div className="page-container">
      <div className="page-title">Monitoreo de equipos</div>
      <FilterInput
        value={filterText}
        onChange={setFilterText}
        placeholder="Buscar por equipo o nombre..."
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        currentPage={currentPage}
        totalItems={filteredData.length}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
      <div className="flex w-full flex-col gap-2 pb-4">
        {paginatedData[0] &&
          paginatedData.map(
            ({
              imagen,
              area,
              sector,
              nombre,
              servicio,
              sensores,
              alertaEquipo,
              empresa,
              equipo,
            }) => (
              <div
                className="flex flex-wrap items-center border border-base-content/20 hover:border-base-content/50 rounded-box w-full p-4 gap-4 "
                key={equipo}
              >
                <div className="flex flex-col gap-2 w-80 flex-grow">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-2xl text-warning"
                      />
                    </button>
                    <img
                      src={ternium}
                      alt={imagen.split(".")[0]}
                      className="w-32 h-fit"
                    />
                  </div>
                  <div className="flex flex-wrap w-full gap-y-1 gap-x-2 max-w-xl">
                    <div className="w-60 flex-grow bg-base-content/10 p-1 rounded-md">
                      <div className="flex gap-2 items-center text-xs">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <div>{area.toUpperCase()}</div>
                        <FontAwesomeIcon icon={faChevronRight} />
                        <div>{sector.toUpperCase()}</div>
                      </div>
                      <div className="font-bold px-2 text-lg">{equipo}</div>
                    </div>
                    <div className="w-60 flex-grow bg-base-content/10 p-1 rounded-md">
                      <div className="flex gap-2 items-center text-xs">
                        Servicio
                      </div>
                      {nombre}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] w-80 flex-grow gap-2">
                  {sensores.map(
                    ({
                      color,
                      nombre,
                      registrador,
                      relacion,
                      sensor_id,
                      tipo,
                      valorTemp,
                    }) => (
                      <button
                        className="join w-full flex-grow text-sm"
                        key={nombre}
                      >
                        <div className="flex bg-primary/20 w-3/5 join-item text-sm px-2 items-center">
                          {nombre}
                        </div>
                        <div className="flex items-center bg-base-content/20 w-2/5 join-item text-sm px-2 h-6">
                          {valorTemp}
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
}
