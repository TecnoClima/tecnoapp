import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";

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
    userData.plant
      ? { plant: plantList.find((p) => p.name === userData.plant) }
      : {}
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
    const f = { ...filters };
    const { name, value } = e.target;
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

  return (
    <div className="container mb-2 col-lg-9">
      <div className="row">
        <div className="col">
          <div className="input-group">
            <span className="input-group-text py-0 px-1 fw-bold">
              UBICACION
            </span>
            <select
              name="plant"
              className="form-control p-0 pe-3 w-auto"
              value={filters.plant}
              onChange={setFilter}
              disabled={userData.plant}
            >
              <option value="">PLANTA</option>
              {plantList.map((item, i) => (
                <option key={i} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              name="area"
              disabled={!filters.plant || areaList.length === 1}
              className="form-control p-0 pe-3 w-auto"
              value={filters.area}
              onChange={setFilter}
            >
              <option value="">Area</option>
              {areaList
                ?.filter((a) => {
                  return filters.plant
                    ? a.plant ===
                        plantList.find((p) => p.name === filters.plant)._id
                    : a;
                })
                .map((item, i) => (
                  <option key={i} value={item.name}>
                    {item.name}
                  </option>
                )) || []}
            </select>
            <select
              name="line"
              className="form-control p-0 pe-3 w-auto"
              disabled={!filters.area || lineList.length === 1}
              value={filters.line}
              onChange={setFilter}
            >
              <option value="">Línea</option>
              {lineList
                .filter((item) =>
                  filters.area
                    ? item.area._id ===
                      areaList.find((a) => a.name === filters.area)._id
                    : item
                )
                .map((item, i) => (
                  <option key={i} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
            <input
              className="form-control p-0 pe-3 w-auto"
              placeholder="Lugar de Servicio"
              name="servicePoint"
              value={filters.servicePoint || ""}
              disabled={!filters.plant}
              onChange={setFilter}
            />
            <input
              className="form-control p-0 pe-3 w-auto"
              placeholder="Equipo"
              name="device"
              value={filters.device || ""}
              disabled={!filters.plant}
              onChange={setFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
