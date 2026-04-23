import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";
import ElementSection from "./ElementSection.js";

export default function AdminPlants() {
  const { userData } = useSelector((state) => state.people);
  const { plantList, areaList, lineList, spList } = useSelector(
    (state) => state.plants,
  );
  const userPlant = userData?.plant
    ? plantList.find(({ name }) => name === userData.plant)
    : undefined;
  const [data, setData] = useState({});

  useEffect(() => {
    if (userPlant) setData({ plant: userPlant });
  }, [userPlant]);

  function handleSetData(prop, value) {
    let newData = { ...data, ...(userPlant ? { plant: userPlant } : {}) };
    if (newData[prop] === value) {
      delete newData[prop];
    } else {
      newData[prop] = value;
    }
    if (["area", "plant"].includes(prop)) delete newData.line;
    if (prop === "plant") delete newData.area;
    setData(newData);
  }

  return (
    <div className="page-container">
      <div className="flex w-full items-center justify-between flex-wrap gap-2">
        <div className="page-title">Administración de plantas</div>
      </div>
      <div className="flex flex-col gap-2">
        <ElementSection
          item="plant"
          array={plantList}
          data={data}
          setData={handleSetData}
          create={plantActions.createPlant}
          update={plantActions.updatePlant}
          deleteAction={plantActions.deletePlant}
          getAction={plantActions.getPlants}
          enableCreation={true}
          disabled={!!userData?.plant}
        />

        <ElementSection
          item="area"
          array={areaList.filter((a) =>
            data.plant ? a.plant === data.plant._id : a,
          )}
          data={data}
          setData={handleSetData}
          create={plantActions.createArea}
          update={plantActions.updateArea}
          deleteAction={plantActions.deleteArea}
          getAction={plantActions.getAreas}
          enableCreation={!!data.plant}
        />

        <ElementSection
          item="line"
          array={lineList.filter((a) =>
            data.area ? a.area._id === data.area._id : a,
          )}
          data={data}
          setData={handleSetData}
          create={plantActions.createLine}
          update={plantActions.updateLine}
          deleteAction={plantActions.deleteLine}
          getAction={plantActions.getLines}
          enableCreation={!!data.area}
        />

        <ElementSection
          item="servicePoint"
          array={spList.filter((i) =>
            data.line
              ? i.lineId === data.line._id || i.line === data.line._id
              : i,
          )}
          data={data}
          setData={handleSetData}
          create={plantActions.createSP}
          update={plantActions.updateSP}
          deleteAction={plantActions.deleteSP}
          getAction={plantActions.getSPs}
          enableCreation={!!data.line}
        />
      </div>
    </div>
  );
}
