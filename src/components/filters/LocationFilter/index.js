import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";

export default function LocationFilter(props) {
  const { plantList, areaList, lineList, spList } = useSelector(
    (state) => state.plants
  );
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [filteredSP, setFilteredSP] = useState([]);
  const dispatch = useDispatch();

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
      if (["plant", "area", "line"].includes(name)) delete f.servicePoint;
      if (["plant", "area"].includes(name)) delete f.line;
      if (name === "plant") delete f.area;
    }
    setFilters(f);
    props.select && props.select(f);
  }

  useEffect(() => {
    if (!filters.plant) return;
    let { plant } = filters;
    let areas = filters.area
      ? [filters.area]
      : areaList.filter((a) => a.plant === plant).map((item) => item._id);
    let lines = filters.line
      ? [filters.line]
      : lineList.filter((l) => areas.includes(l.area)).map((item) => item._id);
    setFilteredSP(spList.filter((sp) => lines.includes(sp.line)));
  }, [filters, areaList, lineList, spList]);

  useEffect(() => console.log("filters", filters), [filters]);

  return (
    <div className="container mb-2 col-md-9">
      <div className="row">
        <div className="col">
          <div className="input-group">
            <span class="input-group-text py-0 px-1">UBICACION</span>
            <select
              name="plant"
              className="form-control p-0 pe-3 w-auto"
              value={filters.plant}
              onChange={setFilter}
            >
              <option value="">PLANTA</option>
              {plantList.map((item, i) => (
                <option key={i} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              name="area"
              disabled={!filters.plant}
              className="form-control p-0 pe-3 w-auto"
              value={filters.area}
              onChange={setFilter}
            >
              <option value="">Area</option>
              {areaList
                .filter((a) => a.plant === filters.plant)
                .map((item, i) => (
                  <option key={i} value={item._id}>
                    {item.name}
                  </option>
                ))}
            </select>
            <select
              name="line"
              className="form-control p-0 pe-3 w-auto"
              disabled={!filters.area}
              value={filters.line}
              onChange={setFilter}
            >
              <option value="">Línea</option>
              {lineList
                .filter((item) => item.area === filters.area)
                .map((item, i) => (
                  <option key={i} value={item._id}>
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

            {/* <input
              placeholder="Lugar de Servicio"
              type="search"
              list="servicePointList"
              disabled={!filters.plant}
              onChange={setFilter}
            /> */}
            {/* <datalist id="servicePointList">
              {filteredSP.map((sp, i) => (
                <option key={i} value={sp.name} />
              ))}
            </datalist> */}
          </div>
        </div>
      </div>
    </div>
  );
}
