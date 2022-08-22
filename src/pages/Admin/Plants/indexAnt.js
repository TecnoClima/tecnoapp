import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlantList } from "../../../actions/addPlantsActions.js";

import PlantList from "./PlantsList/PlantList.js";
import AreasList from "./AreasList/AreasList.js";
import LinesList from "./LinesList/LinesList.js";
import SPList from "./SPList/SPList.js";

export default function AdminPlants() {
  const dispatch = useDispatch();
  const { plants, areas, lines, servicePoints } = useSelector(
    (state) => state.addPlants
  );

  let [selectedData, setSelectedData] = useState({
    plantName: "",
    areaName: "",
    linesName: "",
    spName: "",
  });

  useEffect(() => dispatch(getPlantList()), [dispatch]);

  return (
    <div className="adminOptionSelected">
      <div className="container-fluid px-0 mx-4">
        <div className="row my-4">
          <h4>Administración de plantas</h4>
        </div>

        <div className="row">
          <div className="col-3">
            <PlantList
              plants={plants}
              setSelectedData={setSelectedData}
              selectedData={selectedData}
            />
          </div>
          <div className="col-3">
            <AreasList
              areas={areas}
              plantName={selectedData.plantName}
              setSelectedData={setSelectedData}
              selectedData={selectedData}
            />
          </div>
          <div className="col-3">
            <LinesList
              lines={lines}
              plantName={selectedData.plantName}
              areaName={selectedData.areaName}
              setSelectedData={setSelectedData}
              selectedData={selectedData}
            />
          </div>
          <div className="col-3">
            <SPList
              servicePoints={servicePoints}
              plantName={selectedData.plantName}
              areaName={selectedData.areaName}
              lineName={selectedData.linesName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
