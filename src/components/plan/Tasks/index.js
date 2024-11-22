import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDeviceStrategy,
  // updatePlan
} from "../../../actions/planActions";
import DeviceFilters from "../../filters/DeviceFilters";
import Paginate from "../../Paginate";
import PlanDevice from "../../Cards/PlanDevice";
import "./index.css";
import ProgramForm from "../../forms/ProgramForm";
import { planActions } from "../../../actions/StoreActions";

export default function PlanTask() {
  const { year } = useSelector((state) => state.data);
  const { selectedPlant } = useSelector((state) => state.plants);

  const { devicePlanList, programList } = useSelector((state) => state.plan);
  const [page, setPage] = useState({ first: 0, size: 10 });
  const [selection, setSelection] = useState([]);
  const [programForm, setProgramForm] = useState(false);
  const [filteredList, setFilteredList] = useState(devicePlanList);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!(selectedPlant.name && year)) return;
    dispatch(planActions.getStrategies({ plant: selectedPlant.name, year }));
    // dispatch(cylinderActions.getGases());
    dispatch(
      planActions.getPlanDevices({ plantName: selectedPlant.name, year })
    );
  }, [dispatch, selectedPlant, year]);

  useEffect(() => {
    setFilteredList(devicePlanList);
  }, [devicePlanList]);

  async function handleSave(json) {
    dispatch(setDeviceStrategy(json));
  }

  function handleCheck(e) {
    let check = e.target.checked;
    const code = e.target.id;
    let list = [...selection];
    if (check) {
      list.push(devicePlanList.find((e) => e.code === code));
    } else {
      list = list.filter((e) => e.code !== code);
    }
    setSelection(list);
  }

  function handleSelectAll() {
    let codeList = filteredList.slice(page.first, page.first + page.size);
    let check = selection.length === codeList.length;
    setSelection(check ? [] : codeList);
    for (let code of codeList.map((e) => e.code))
      document.getElementById(code).checked = !check;
  }

  return (
    <div className="container-fluid m-0 pt-1 p-0 bg-light h-full d-flex flex-column">
      <div className="row m-0 px-1">
        <div className="col-sm-6 p-0">
          <DeviceFilters
            hiddenFields={["plant"]}
            select={setFilteredList}
            list={devicePlanList}
          />
          <button
            className="btn btn-primary btn-sm mx-1"
            onClick={() => handleSelectAll()}
          >
            Todos
          </button>
          {selection[0] && (
            <button
              className="btn btn-info btn-sm"
              onClick={() => setProgramForm(!programForm)}
            >
              Asignar Programa
            </button>
          )}
        </div>
      </div>
      <div className="row-auto m-0 py-1">
        <div className="col" style={{ height: "70vh", overflowY: "auto" }}>
          {filteredList[0] &&
            filteredList
              .slice(page.first, page.first + page.size)
              .map((device, index) => {
                const key =
                  device.code +
                  (device.strategy
                    ? Object.keys(device.strategy)
                        .map((key) => JSON.stringify(device.strategy[key])[1])
                        .join("")
                    : "");

                return (
                  <PlanDevice
                    key={key}
                    year={year}
                    plant={selectedPlant.name}
                    device={device}
                    programs={programList}
                    checked={selection.includes(device.code)}
                    onCheck={(e) => handleCheck(e)}
                    onSave={(json) => handleSave(json)}
                  />
                );
              })}
          {!filteredList[0] && (
            <div className="errorMessage">
              No hay elementos para mostrar para esa planta y año
            </div>
          )}
        </div>
      </div>
      <div className="row py-auto m-0 flex-grow-1">
        <Paginate
          pages={Math.ceil(filteredList.length / page.size)}
          length="8"
          min="10"
          step="10"
          select={(value) =>
            setPage({ ...page, first: (Number(value) - 1) * page.size })
          }
          size={(value) => setPage({ ...page, size: Number(value) })}
        />

        {programForm && selection && (
          <ProgramForm
            selection={selection}
            save={(json) => handleSave(json)}
            onClose={() => setProgramForm(!programForm)}
          />
        )}
      </div>
    </div>
  );
}
