// Importa el hook useState de React para manejar estados locales
import { useState } from "react";

// Configuración de los filtros disponibles
const filterData = [
  { label: "N° OT", name: "code", path: "code", type: "text" },
  {
    label: "Equipo",
    name: "device",
    paths: ["device.name", "device.code"], // Permite buscar tanto por nombre como por código del equipo
    type: "text",
  },
  { label: "Clase", name: "class", path: "class", type: "text" },
  {
    label: "Área",
    name: "area",
    path: "device.line.area.name", // Accede al nombre del área dentro de la línea del equipo
    type: "text",
  },
  {
    label: "Ordenar por",
    name: "sort",
    type: "buttons", // Este tipo mostrará botones en vez de input de texto
    data: [
      { caption: "Fecha", value: "registration.date" },
      { caption: "N° OT", value: "code" },
      { caption: "Equipo", value: "device.name" },
    ],
  },
];

// Función auxiliar que permite acceder a un valor anidado en un objeto mediante una ruta en string
function getValueByPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

// Componente principal de filtros
export default function Filters({ list = [], setList }) {
  // Estado para saber por qué campo se está ordenando
  const [orderBy, setOrderBy] = useState("");
  // Estado para saber si se ordena de forma ascendente o descendente
  const [ascending, setAscending] = useState(true);
  // Estado que guarda los valores ingresados en los filtros
  const [filters, setFilters] = useState({});

  // Maneja cambios en los inputs de texto
  function handleChange(e) {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters, orderBy, ascending); // Aplica los filtros cada vez que se cambia algo
  }

  // Maneja el clic en los botones de ordenamiento
  function handleSort(field) {
    const newAscending = orderBy === field ? !ascending : true; // Alterna entre asc y desc si se vuelve a hacer clic en el mismo campo
    setOrderBy(field);
    setAscending(newAscending);
    applyFilters(filters, field, newAscending); // Aplica filtros incluyendo el nuevo ordenamiento
  }

  // Aplica los filtros de búsqueda y ordenamiento sobre la lista original
  function applyFilters(filters, sortField, isAscending) {
    let filtered = [...list]; // Copia la lista original para trabajar sobre ella

    // Recorre cada filtro aplicado
    Object.entries(filters).forEach(([key, value]) => {
      const filterConf = filterData.find((f) => f.name === key);
      if (value) {
        // Usa los paths configurados para filtrar
        const paths = filterConf.paths || [filterConf.path];
        filtered = filtered.filter((item) =>
          paths.some(
            (p) =>
              `${getValueByPath(item, p) ?? ""}` // Convierte a string por seguridad
                .toLowerCase()
                .includes(value.toLowerCase()) // Filtro sin sensibilidad a mayúsculas
          )
        );
      }
    });

    // Ordena si hay un campo seleccionado
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = getValueByPath(a, sortField);
        const bValue = getValueByPath(b, sortField);

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === "number" && typeof bValue === "number") {
          // Si son números, resta directamente
          return isAscending ? aValue - bValue : bValue - aValue;
        }

        // Si no son números, los convierte a string y los compara alfabéticamente
        return isAscending
          ? `${aValue}`.localeCompare(`${bValue}`)
          : `${bValue}`.localeCompare(`${aValue}`);
      });
    }

    setList(filtered); // Actualiza la lista mostrada
  }

  return (
    <div className="flex flex-wrap gap-2 bg-base-200 p-2">
      {/* Renderiza dinámicamente cada filtro definido en filterData */}
      {filterData.map(({ label, name, type, data }) => {
        // Si el filtro es de tipo texto
        if (type === "text") {
          return (
            <div key={name} className="join">
              <label className="label input-xs md:input-sm bg-base-content/10 w-28 join-item border border-base-content/20 min-w-fit">
                {label}
              </label>
              <input
                type="text"
                name={name}
                onChange={handleChange}
                className="input input-xs md:input-sm input-bordered join-item flex-grow"
              />
            </div>
          );
        }

        // Si el filtro es de tipo botones (para ordenar)
        if (type === "buttons") {
          return (
            <div key={name} className="join">
              <label className="label input-xs md:input-sm bg-base-content/10 w-28 join-item border border-base-content/20 min-w-fit">
                {label}
              </label>
              {/* Botón por cada opción de ordenamiento */}
              {data.map(({ caption, value }) => (
                <button
                  key={value}
                  type="button"
                  className={`btn btn-sm btn-outline join-item ${
                    orderBy === value ? "btn-active" : ""
                  }`}
                  onClick={() => handleSort(value)}
                >
                  <div>
                    {caption}{" "}
                    {orderBy === value && (
                      <i
                        className={
                          ascending ? "fas fa-caret-up" : "fas fa-caret-down"
                        }
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          );
        }

        return null; // Si el tipo no es reconocido, no renderiza nada
      })}
    </div>
  );
}
