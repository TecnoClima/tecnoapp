import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { deviceActions } from "../../actions/StoreActions";
import { FormInput } from "../../components/forms/FormInput";
import DeviceList from "../../components/lists/DeviceList";
import { Chart } from "../../components/Chart";
import "./index.css";

export default function Device() {
  const { userData } = useSelector((state) => state.people);
  const { selectedDevice, deviceHistory } = useSelector(
    (state) => state.devices
  );
  const { year } = useSelector((state) => state.data);
  const { code } = useParams();
  const [device, setDevice] = useState({});
  const dispatch = useDispatch();

  const labels = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const [reclaims, setReclaims] = useState([]);
  const [years, setYears] = useState([year]);
  const [colors] = useState(["darkred", "navy", "purple", "green", "grey"]);
  const [chartValues, setValues] = useState([]);

  // Device data
  useEffect(
    () => code && !device.code && dispatch(deviceActions.getDetail(code)),
    [dispatch, device, code]
  );
  useEffect(
    () => code && dispatch(deviceActions.getHistory(code)),
    [dispatch, code]
  );
  useEffect(() => {
    if (selectedDevice.code) {
      setDevice(selectedDevice);
    }
  }, [selectedDevice]);

  // Chart data
  useEffect(() => {
    const { orders, history } = deviceHistory;
    if (!orders) return;
    setReclaims(
      orders
        .filter((order) => order.class === "Reclamo")
        .map((order) => ({ ...order, date: new Date(order.date) }))
    );
    setInterventions(
      history
        .map((task) => ({ ...task, date: new Date(task.date) }))
        .sort((a, b) => (a.date > b.date ? -1 : 1))
    );
  }, [deviceHistory]);
  useEffect(() => {
    const monthReclaims = [];
    for (let i = 0; i <= 11; i++)
      monthReclaims[i] = reclaims.filter(
        (reclaim) =>
          reclaim.date.getFullYear() === year && reclaim.date.getMonth() === i
      ).length;
    setValues([
      {
        label: year,
        data: monthReclaims,
        backgroundColor: colors[0],
      },
    ]);
  }, [reclaims, colors, year]);

  useEffect(() => {
    const years = [];
    for (let i = year - 4; i <= year; i++) years.push(i);
    setYears(years.sort((a, b) => (a < b ? 1 : -1)));
  }, [year]);

  function newValues(year, index) {
    let values = [...chartValues];
    if (values.find((value) => value.label === year)) {
      values = values.filter((value) => value.label !== year);
    } else {
      const monthReclaims = [];
      for (let i = 0; i <= 11; i++)
        monthReclaims[i] = reclaims.filter(
          (reclaim) =>
            reclaim.date.getFullYear() === year && reclaim.date.getMonth() === i
        ).length;
      values.push({
        label: year,
        data: monthReclaims,
        backgroundColor: colors[index],
      });
    }
    setValues(values.sort((a, b) => (a.label > b.label ? 1 : -1)));
  }

  function handleClickYear(e) {
    e.preventDefault();
    const year = Number(e.target.value);
    const index = Number(e.target.id);
    newValues(year, index);
  }

  //table data
  const [interventions, setInterventions] = useState([]);

  return (
    <div className="pageBackground">
      {!code ? (
        <DeviceList plant={userData.plant} />
      ) : (
        <div className="container">
          <div className="row text-center py-3">
            <h4>{`[${device.code}] ${device.name}`}</h4>
          </div>
          <div className="row mb-3">
            <div className="col">
              {device.code && (
                <div className="container">
                  <div className="row">
                    <h5>DATOS DEL EQUIPO</h5>
                  </div>
                  <FormInput
                    key={device.plant}
                    label={
                      <div>
                        <i className="fas fa-map-marker-alt" />
                      </div>
                    }
                    value={`${device.plant} > ${device.area} > ${device.line}`}
                    readOnly={true}
                  />
                  <FormInput label="Tipo" value={device.type} readOnly={true} />
                  <FormInput
                    key={device.power}
                    label="Potencia"
                    defaultValue={
                      device.power >= 9000
                        ? `${Math.floor(device.power / 3000)} TnRef`
                        : `${device.power} Frigorías`
                    }
                    readOnly={true}
                  />
                  <FormInput
                    label="Gas"
                    value={device.refrigerant}
                    readOnly={true}
                  />
                  <FormInput
                    label="Servicio"
                    value={device.service}
                    readOnly={true}
                  />
                  <FormInput
                    label="Categoría"
                    value={device.category}
                    readOnly={true}
                  />
                  <FormInput
                    label="Ambiente"
                    value={device.environment}
                    readOnly={true}
                  />
                  <FormInput
                    key={device.age}
                    label="Antigüedad"
                    value={`${device.age ? `${device.age} años ` : ""} ${
                      device.regDate ? `(${device.regDate.split("T")[0]})` : ""
                    }`}
                    readOnly={true}
                  />
                  <FormInput
                    label="Estado"
                    value={device.status}
                    readOnly={true}
                  />
                </div>
              )}
            </div>
            <div className="col col-md-6">
              <div className="container">
                <h5>HISTORIAL DE RECLAMOS</h5>
                <div className="flex">
                  {years.map((year, index) => (
                    <button
                      key={chartValues + index}
                      className={`yearBox ${
                        chartValues.find((value) => value.label === year)
                          ? "activeYearBox"
                          : ""
                      }`}
                      style={{ "--main-color": colors[index] }}
                      onClick={handleClickYear}
                      id={index}
                      value={year}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                <div className="row">
                  <Chart values={chartValues} labels={labels} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <h5>HISTORIAL DE INTERVENCIONES</h5>
            <table className="table table-hover" style={{ fontSize: "80%" }}>
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Intervinientes</th>
                  <th scope="col">Descripción</th>
                  <th
                    scope="col"
                    style={{ minWidth: "4rem" }}
                    className="text-center"
                  >
                    Uso de gas
                  </th>
                  <th scope="col" className="text-center">
                    Orden de Trabajo
                  </th>
                </tr>
              </thead>
              <tbody>
                {interventions[0] &&
                  interventions.map((intervention, index) => {
                    return (
                      <tr key={index}>
                        <th style={{ minWidth: "5rem" }}>
                          {intervention.date.toLocaleDateString()}
                        </th>
                        <td>
                          {intervention.workers
                            .map((worker) => worker.name)
                            .join(", ")}
                        </td>
                        <td>{intervention.tasks}</td>
                        <td>
                          {intervention.gas.map(
                            (usage) =>
                              `garrafa ${usage.cylinder}: ${usage.consumption} kg`
                          )}
                        </td>
                        <td>
                          <Link
                            title="ver OT"
                            className="btn btn-outline-primary"
                            to={`/ots/detail/${intervention.order}`}
                          >
                            {intervention.order}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
