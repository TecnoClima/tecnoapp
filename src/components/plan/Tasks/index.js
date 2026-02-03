import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDeviceStrategy } from "../../../actions/planActions";
import { deviceActions, planActions } from "../../../actions/StoreActions";
import PlanDevice from "../../Cards/PlanDevice";
import DeviceFilters from "../../filters/DeviceFilters/newFilters";
import ErrorMessage from "../../forms/ErrorMessage";
import ProgramForm from "../../forms/ProgramForm";
import Pagination from "../../Paginate/Pagination";

export default function PlanTask() {
  const { year } = useSelector((state) => state.data);
  const { selectedPlant } = useSelector((state) => state.plants);
  const { deviceOptions } = useSelector((state) => state.devices);
  const { devicePlanList, programList } = useSelector((state) => state.plan);
  const [page, setPage] = useState({ first: 0, size: 10 });
  const [selection, setSelection] = useState([]);
  const [programForm, setProgramForm] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [filters, setFilters] = useState({});
  const dispatch = useDispatch();
  const initialFilter = {};

  useEffect(() => {
    if (!(selectedPlant?.name && year)) return;
    dispatch(planActions.getStrategies({ plant: selectedPlant.name, year }));
    dispatch(
      planActions.getPlanDevices({ plantName: selectedPlant.name, year })
    );
    setFilters({});
  }, [dispatch, selectedPlant, year]);

  useEffect(() => {
    setFilteredList(devicePlanList);
  }, [devicePlanList]);

  function handleFilterSubmit(currentFilters) {
    if (!currentFilters || Object.keys(currentFilters).length === 0) {
      setFilteredList(devicePlanList);
      return;
    }

    const filtered = devicePlanList.filter((d) => {
      const {
        line,
        area,
        plant,
        device,
        type,
        powerMin,
        powerMax,
        powerUnit,
        ageMin,
        ageMax,
        recMin,
        recMax,
        refrigerant,
        category,
        environment,
        service,
        status,
      } = currentFilters;

      if (plant && d.plant !== plant) return false;
      if (area && d.area !== area) return false;
      if (line && d.line !== line) return false;

      if (
        device &&
        !d.name.toLowerCase().includes(device.toLowerCase()) &&
        !d.code.toLowerCase().includes(device.toLowerCase())
      )
        return false;

      if (type && d.type !== type) return false;
      if (refrigerant && d.refrigerant !== refrigerant) return false;
      if (category && d.category !== category) return false;
      if (environment && d.environment !== environment) return false;
      if (service && d.service !== service) return false;
      if (status && d.status !== status) return false;

      if (d.power) {
        let power = d.power;
        if (powerUnit === "TR") {
          if (powerMin && power < Number(powerMin) * 3000) return false;
          if (powerMax && power > Number(powerMax) * 3000) return false;
        } else {
          if (powerMin && power < Number(powerMin)) return false;
          if (powerMax && power > Number(powerMax)) return false;
        }
      }

      if (ageMin && d.age < Number(ageMin)) return false;
      if (ageMax && d.age > Number(ageMax)) return false;

      if (recMin && d.reclaims < Number(recMin)) return false;
      if (recMax && d.reclaims > Number(recMax)) return false;

      return true;
    });

    setFilteredList(filtered);
    setPage({ first: 0, size: 10 });
  }

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

  useEffect(() => {
    if (!deviceOptions) dispatch(deviceActions.getOptions());
  }, [deviceOptions, dispatch]);

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex gap-2">
        <DeviceFilters
          onSubmit={handleFilterSubmit}
          filters={filters}
          setFilters={setFilters}
          initialFilter={initialFilter}
          hidePlant={true}
        />
        <button
          className="btn btn-primary btn-sm"
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

      <div className="flex flex-col gap-2 h-20 flex-grow overflow-y-auto min-h-0">
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
          <ErrorMessage>
            No hay elementos para mostrar para esa planta y año
          </ErrorMessage>
        )}
      </div>
      <div className="row py-auto m-0 flex-grow-1">
        <Pagination
          length={filteredList.length}
          current={Math.floor(page.first / page.size) + 1}
          size={page.size}
          setPage={(value) =>
            setPage({ ...page, first: (Number(value) - 1) * page.size })
          }
          setSize={(value) =>
            setPage({ ...page, size: Number(value), first: 0 })
          }
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
