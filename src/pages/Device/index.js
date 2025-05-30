import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { deviceActions } from "../../actions/StoreActions";
import DeviceList from "../../components/Devices/DeviceList";
import { Chart } from "../../components/Chart";
import FollowDevice from "../../components/DevicePage/FollowDevice";
import SetFrequency from "../../components/DevicePage/Frequency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCalendarAlt,
  faExclamationTriangle,
  faFan,
  faGlobe,
  faMapMarkerAlt,
  faStar,
  faTable,
  faToolbox,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import WorkOrderCard from "../../components/workOrder/WorkOrderCard";
import DeviceItem from "../../components/DevicePage/DeviceItem";
import { faSnowflake } from "@fortawesome/free-regular-svg-icons";
import Loading from "../../components/Loading";

export default function Device() {
  const { userData } = useSelector((state) => state.people);
  const { selectedDevice, deviceHistory, deviceResult } = useSelector(
    (state) => state.devices
  );
  const { year } = useSelector((state) => state.data);
  const { code } = useParams();
  const [device, setDevice] = useState({});
  const [enableLinks, setEnableLinks] = useState(false);
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

  useEffect(() => {
    console.log("deviceResult", deviceResult);
  }, [deviceResult]);

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

  useEffect(() => {
    const token = localStorage.getItem("tecnoToken");
    setEnableLinks(!!token);
  }, []);

  return (
    <>
      {!code ? (
        <DeviceList plant={userData.plant} />
      ) : (
        <div className="page-container mx-2">
          {deviceResult.error ? (
            <div className="page-title text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              El código proporcionado no corresponde a un equipo registrado en
              la base de datos
            </div>
          ) : deviceResult.success ? (
            <>
              <div className="page-title">{`[${device.code}] ${device.name}`}</div>
              <div className="flex w-full justify-between flex-wrap-reverse gap-2 -mt-3">
                <SetFrequency />

                <div className="flex gap-2 sm:ml-auto">
                  {device && <FollowDevice device={device} />}
                  <Link
                    to="/ots/new"
                    onClick={(e) => dispatch(deviceActions.getDetail(code))}
                    className="btn btn-sm btn-success"
                  >
                    <FontAwesomeIcon icon={faToolbox} />
                    Nueva Orden
                  </Link>
                </div>
              </div>
              <div className="flex w-full flex-wrap gap-2">
                <WorkOrderCard className="w-full flex flex-col gap-1 mt-2 md:w-80 md:flex-grow">
                  <DeviceItem
                    value={`${device.plant} > ${device.area} > ${device.line}`}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </DeviceItem>
                  <DeviceItem value={device.type}>
                    <FontAwesomeIcon icon={faFan} />
                  </DeviceItem>
                  <DeviceItem
                    value={
                      device.power >= 9000
                        ? `${Math.floor(device.power / 3000)} TnRef`
                        : `${device.power} Frigorías`
                    }
                  >
                    <FontAwesomeIcon icon={faBolt} />
                  </DeviceItem>

                  <DeviceItem
                    value={`${device.refrigerant} ${
                      device.gasAmount ? `(${device.gasAmount}g)` : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faSnowflake} />
                  </DeviceItem>
                  <DeviceItem value={device.service}>
                    <FontAwesomeIcon icon={faTools} />
                  </DeviceItem>

                  <DeviceItem value={device.category}>
                    <FontAwesomeIcon icon={faTable} />
                  </DeviceItem>
                  <DeviceItem value={device.environment}>
                    <FontAwesomeIcon icon={faGlobe} />
                  </DeviceItem>
                  <DeviceItem value={`${device.age} años`}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </DeviceItem>
                  <DeviceItem value={device.status}>
                    <FontAwesomeIcon icon={faStar} />
                  </DeviceItem>
                </WorkOrderCard>
                <WorkOrderCard
                  title="Historial de Reclamos"
                  className="w-full flex flex-col gap-1 mt-2 md:w-80 md:flex-grow"
                >
                  <div className="flex gap-2">
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
                  <Chart values={chartValues} labels={labels} />
                </WorkOrderCard>
              </div>
              <div className="mt-4">
                <div className="card-title my-4">
                  Historial de intervenciones
                </div>
                <table className="table no-padding" style={{ fontSize: "80%" }}>
                  <thead>
                    <tr>
                      <th scope="col">Fecha</th>
                      <th scope="col">Intervinientes</th>
                      <th scope="col">Descripción</th>
                      <th scope="col" className="text-center min-w-16">
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
                            <th className="min-w-20">
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
                              <div className="flex w-full justify-center items-center">
                                {enableLinks ? (
                                  <Link
                                    title="Ver OT"
                                    className="btn btn-sm btn-secondary btn-outline "
                                    to={`/ots/detail/${intervention.order}`}
                                  >
                                    {intervention.order}
                                  </Link>
                                ) : (
                                  <b>{intervention.order}</b>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="page-title text-center pt-10">
              <Loading className="mr-2" />
              Buscando...
            </div>
          )}
        </div>
      )}
    </>
  );
}
