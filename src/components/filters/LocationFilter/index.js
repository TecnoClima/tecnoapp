import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";
import { FilterInput, FilterSelect } from "../DeviceFilters/newFilters";

export default function LocationFilter(props) {
  const { userData } = useSelector((state) => state.people);
  const {
    plantList = [],
    areaList = [],
    lineList = [],
    spList = [],
  } = useSelector((state) => state.plants);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(
    userData.plant ? { plant: userData.plant } : {}
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const newFilters = {};
    if (plantList.length === 1) {
      newFilters.plant = plantList[0].name;
      if (areaList.length === 1) {
        newFilters.area = areaList[0].name;
        if (lineList.length === 1) newFilters.line = lineList[0].name;
      }
    }
    setFilters(newFilters);
  }, [plantList, areaList, lineList]);

  useEffect(() => console.log());

  /**
   *    This function gets missing data if any list is not there.
   */
  useEffect(() => {
    if (plantList[0] && areaList[0] && lineList[0] && spList[0])
      setLoading(false);
    if (loading) return;
    if (!plantList[0]) {
      dispatch(plantActions.getPlants());
      setLoading(true);
    }
    if (!areaList[0]) {
      dispatch(plantActions.getAreas());
      setLoading(true);
    }
    if (!lineList[0]) {
      dispatch(plantActions.getLines());
      setLoading(true);
    }
    if (!spList[0]) {
      dispatch(plantActions.getSPs());
      setLoading(true);
    }
  }, [plantList, areaList, lineList, spList, loading, dispatch]);

  function setFilter(e) {
    e.preventDefault();
    console.log("input");
    const f = { ...filters };
    const { name, value } = e.target;
    console.log({ name, value });
    if (value) {
      f[name] = value;
    } else {
      delete f[name];
      if (["plant", "area", "line"].includes(name)) f.servicePoint = "";
      if (["plant", "area"].includes(name)) f.line = "";
      if (name === "plant") f.area = "";
    }
    setFilters(f);
    props.select && props.select(f);
  }

  // Obtener áreas filtradas por planta seleccionada
  const filteredAreas = areaList.filter((area) => {
    if (!filters.plant) return false;
    const selectedPlant = plantList.find((p) => p.name === filters.plant);
    return selectedPlant && area.plant === selectedPlant._id;
  });

  // Obtener líneas filtradas por área seleccionada
  const filteredLines = lineList.filter((line) => {
    if (!filters.area) return false;
    const selectedArea = areaList.find((a) => a.name === filters.area);
    return selectedArea && line.area._id === selectedArea._id;
  });

  return (
    <div className="sm:join text-sm bg-base-content/10 w-full">
      <label htmlFor="location" className="plan-filter-label">
        Ubicación
      </label>
      <div className="flex flex-grow">
        <FilterSelect
          id="plant"
          value={filters.plant}
          options={plantList.map((p) => p.name)}
          onSelect={setFilter}
          noLabel
          placeholder="Planta"
        />
        <FilterSelect
          id="area"
          value={filters.area}
          disabled={!filters.plant}
          options={filteredAreas.map((a) => a.name)}
          onSelect={setFilter}
          noLabel
          placeholder="Area"
        />
        <FilterSelect
          id="line"
          value={filters.line}
          disabled={!filters.area}
          options={filteredLines.map((l) => l.name)}
          onSelect={setFilter}
          noLabel
          placeholder="Línea"
        />
      </div>
      <div className="flex flex-grow">
        <FilterInput
          placeholder="Lugar de Servicio"
          id="servicePoint"
          value={filters.servicePoint || ""}
          disabled={!filters.plant}
          onChange={setFilter}
          noLabel
        />
        <FilterInput
          placeholder="Equipo"
          id="device"
          value={filters.device || ""}
          disabled={!filters.plant}
          onChange={setFilter}
          noLabel
        />
      </div>
    </div>
  );
}
