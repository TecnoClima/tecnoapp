import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";
import { FormSelector } from "../FormInput";

export default function LocationSelector(props) {
  const { initNames, initIds } = props;
  const { plantList, areaList, lineList, spList } = useSelector(
    (state) => state.plants
  );
  const [limit] = useState(props.limit);
  const [extraClass] = useState(props.extraClass);
  const [requested, setRequested] = useState({
    plant: false,
    area: false,
    line: false,
    servicePoint: false,
  });
  const [selected, setSelected] = useState(
    initIds || {
      plant: "",
      area: "",
      line: "",
      sp: "",
    }
  );
  const [names, setNames] = useState(
    initNames || {
      plant: "",
      area: "",
      line: "",
      sp: "",
    }
  );
  const dispatch = useDispatch();

  const [allLists] = useState([
    { item: "plant", list: plantList, getAction: plantActions.getPlants },
    {
      item: "area",
      list: areaList,
      getAction: plantActions.getAreas,
    },
    {
      item: "line",
      list: lineList,
      getAction: plantActions.getLines,
    },
    {
      item: "servicePoint",
      list: spList,
      getAction: plantActions.getSPs,
    },
  ]);

  useEffect(() => {
    let check = true;
    for (let list of allLists) {
      if (check) {
        if (!requested[list.item] && !list.list[0]) {
          dispatch(list.getAction());
          setRequested({ ...requested, [list.item]: true });
        }
      }
      if (limit === list.item) check = false;
    }
  }, [limit, requested, allLists, dispatch]);

  function setValue(array, field, value) {
    const newSelected = { ...selected };
    const newNames = { ...names };
    let check = true;
    const name = value ? array.find((e) => e._id === value).name : "";
    for (let key of Object.keys(newSelected)) {
      newSelected[key] = key === field ? value : check ? selected[key] : "";
      newNames[key] = key === field ? name : check ? selected[key] : "";
      if (key === field) check = false;
    }
    setSelected(newSelected);
    setNames(newNames);
    props.getId && props.getId(newSelected);
    props.getNames && props.getNames(newNames);
  }

  useEffect(() => {
    if (!initNames && !initIds) return;
    let key = "";
    let value = "";
    if (initNames) {
      setNames(initNames);
      key = "name";
      value = "_id";
    }
    if (initIds) {
      setSelected(initIds);
      key = "_id";
      value = "name";
    }
    if (key) {
      const plant =
        plantList[0] &&
        plantList.find((p) => p[key] === initNames.plant)[value];
      const area =
        areaList[0] && areaList.find((p) => p[key] === initNames.area)[value];
      const line =
        lineList[0] && lineList.find((p) => p[key] === initNames.line)[value];
      const servicePoint =
        spList[0] && spList.find((p) => p[key] === initNames.servicePoint);
      const location = { plant, area, line, servicePoint };
      if (key === "name") {
        setSelected(location);
      } else {
        setNames(location);
      }
    }
  }, [initIds, initNames, plantList, areaList, lineList, spList]);

  function handleSelectPlant(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setValue(plantList, name, value);
  }

  function handleSelectArea(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setValue(areaList, name, value);
  }

  function handleSelectLine(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setValue(lineList, name, value);
  }

  function handleSelectSP(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setValue(spList, name, value);
  }

  return (
    <div className="row">
      <div className={extraClass}>
        <FormSelector
          options={plantList}
          label={"plant"}
          name={"plant"}
          valueField={"_id"}
          captionField={"name"}
          onSelect={handleSelectPlant}
          value={selected.plant}
        />
      </div>
      {limit !== "plant" && (
        <div className={extraClass}>
          <FormSelector
            options={
              areaList?.filter((e) =>
                selected.plant ? e.plant === selected.plant : e
              ) || []
            }
            label={"area"}
            name={"area"}
            valueField={"_id"}
            captionField={"name"}
            disabled={!selected.plant}
            onSelect={handleSelectArea}
            value={selected.area}
          />
        </div>
      )}
      {!["plant", "area"].includes(limit) && (
        <div className={extraClass}>
          <FormSelector
            options={lineList.filter((e) =>
              selected.area ? e.area._id === selected.area : e
            )}
            label={"line"}
            name={"line"}
            valueField={"_id"}
            captionField={"name"}
            disabled={!selected.area}
            onSelect={handleSelectLine}
            value={selected.line}
          />
        </div>
      )}
      {!["plant", "area", "line"].includes(limit) && (
        <div className={extraClass}>
          <FormSelector
            options={spList.filter((e) =>
              selected.line ? e.line === selected.line : e
            )}
            label={"Lugar de Servicio"}
            name={"servicePoint"}
            valueField={"_id"}
            captionField={"name"}
            disabled={!selected.line}
            onSelect={handleSelectSP}
            value={selected.spList}
          />
        </div>
      )}
    </div>
  );
}
