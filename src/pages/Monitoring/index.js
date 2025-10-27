import { useEffect, useMemo, useState } from "react";
import { monitorActions } from "../../actions/monitoringActions";
import FilterInput from "../../components/Monitoring/FilterInput";
import MonitorLine from "../../components/Monitoring/MonitorLine";

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
          paginatedData.map((item) => (
            <MonitorLine key={item.equipo} {...item} />
          ))}
      </div>
    </div>
  );
}
