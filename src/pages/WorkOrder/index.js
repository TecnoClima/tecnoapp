import {
  faMapMarkerAlt,
  faSearch,
  faSyncAlt,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deviceActions, workOrderActions } from "../../actions/StoreActions";
import FollowDevice from "../../components/DevicePage/FollowDevice";
import DeviceList from "../../components/Devices/DeviceList";
import AddIntervention from "../../components/forms/InterventionForm";
import InterventionList from "../../components/lists/InterventionList";
import WOProgress from "../../components/progress/WOProgresBar";
import { ErrorModal, SuccessModal } from "../../components/warnings";
import WarningErrors from "../../components/warnings/WarningErrors";
import ForPlan from "../../components/workOrder/ForPlan";
import OrderField from "../../components/workOrder/OrderFields";
import LoadOrdersFromExcel from "../../components/workOrder/UploadFromExcel";
import WorkerSelector from "../../components/workOrder/WorkerSelector";
import WorkOrderCard from "../../components/workOrder/WorkOrderCard";
import WorkOrderObservations from "../../components/workOrder/WorkOrderObservations";
import { appConfig } from "../../config";

const { headersRef } = appConfig;

const emptyDevice = {
  code: "",
  location: "",
  name: "",
  type: "",
  category: "",
  service: "",
  environment: "",
  gasAmount: "",
};

export default function WorkOrder() {
  const { userData } = useSelector((s) => s.people);
  const { orderCode } = useParams();
  const { workOrderOptions, orderDetail, orderResult } = useSelector(
    (state) => state.workOrder
  );
  const [order, setOrder] = useState({
    supervisor: "",
    clientWO: "",
    class: orderDetail.class || "",
    issue: "",
    solicitor: "",
    phone: "",
    servicePoint: "",
  });
  const { selectedDevice } = useSelector((s) => s.devices);
  const [requested, setRequested] = useState(false);
  const [device, setDevice] = useState(emptyDevice);
  const [interventions, setInterventions] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [allowSaving, setAllowSaving] = useState(false);
  const [forPlan, setForPlan] = useState(false);
  const [permissions, setPermissions] = useState({
    author: false,
    worker: false,
    supervisor: false,
    admin: false,
  });
  const [errors, setErrors] = useState([]);
  const [minProgress, setMinProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();
  //openers//
  const [deviceTable, setDeviceTable] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [interventionForm, setInterventionForm] = useState(false);
  const navigate = useNavigate();

  // if workorder does not have taskdates, setForPlan undefined
  useEffect(() => {
    if (!orderDetail?.taskDates?.[0]) {
      setForPlan(undefined);
    }
  }, [orderDetail]);

  // set Permissions
  useEffect(
    () =>
      setPermissions({
        author:
          order.completed < 99 && (!order.code || order.userId === userData.id),
        admin: userData.access === "Admin",
        supervisor:
          userData.access === "Supervisor" &&
          (!order.code ||
            (order.completed <= 99 && userData.id === order.supervisor)),
        worker: order.completed < 99 && userData.access === "Worker",
      }),
    [userData, order]
  );

  // reset detail on unmount
  useEffect(() => {
    return () => {
      dispatch(workOrderActions.resetDetail());
    };
  }, []);

  // if orderCode, get order detail
  useEffect(() => {
    if (!orderCode) return;
    dispatch(workOrderActions.searchWO(orderCode));
  }, [orderCode, dispatch]);

  // if orderDetail, fill order with detail
  useEffect(() => {
    if (!orderDetail.code) return;
    const editOrder = { ...orderDetail };
    const device = orderDetail.device;
    dispatch(deviceActions.setDevice(device));
    delete editOrder.device;
    setInterventions(orderDetail.interventions);
    delete editOrder.interventions;
    setMinProgress(orderDetail.completed);
    setForPlan(!!editOrder.taskDate);
    setOrder(editOrder);
  }, [orderDetail, dispatch, order.taskDate]);

  // Allow Saving
  useEffect(() => {
    let check = true;
    if (!device.name) check = false;
    for (let key of ["supervisor", "class", "issue", "solicitor"]) {
      if (!order[key]) check = false;
    }
    if (!order.description && !interventions[0]) check = false;
    setAllowSaving(check);
  }, [interventions, device, order]);

  // getWOOptions
  useEffect(() => {
    if (requested) return;
    if (Object.keys(workOrderOptions).length === 0)
      dispatch(workOrderActions.getWOOptions(userData.plant));
    setRequested(true);
  }, [requested, workOrderOptions, dispatch, userData]);

  const selectDevice = useCallback(
    (d) => {
      let newDevice = {};
      if (d.name) {
        newDevice = { ...device };
        const { plant, area, line } = d;
        const { type, power, refrigerant, gasAmount } = d;
        for (let key of Object.keys(device).filter(
          (k) => !["location", "type", "gasAmount"].includes(k)
        )) {
          newDevice[key] = d[key];
        }
        newDevice.location = plant + "> " + area + "> " + line;
        newDevice.type = `${type} ${
          power >= 9000 ? Math.floor(power / 3000) + "TR" : power + " fg"
        } - ${refrigerant}${gasAmount ? ` (${gasAmount}g)` : ""}`;
      } else {
        newDevice = emptyDevice;
      }
      setDevice(newDevice);
    },
    [device]
  );

  useEffect(() => {
    if (!selectedDevice.name || selectedDevice.name === device.name) return;
    selectedDevice.name && selectDevice(selectedDevice);
    // sets plan false if there is no taskDates
    if (!selectedDevice?.taskDates?.length) {
      handleForPlan({ value: false, taskDate: undefined });
    } else {
      handleForPlan({});
    }
  }, [selectDevice, selectedDevice, device]);

  function handleInputCode(e) {
    const { value } = e.target;
    setDevice({ ...device, code: value });
  }

  function handleSearch(e) {
    e.preventDefault();
    // const newDevice = deviceFullList.find((d) => d.code === device.code);
    if (device?.code) dispatch(deviceActions.getDetail(device.code, true));
  }

  function handleDeleteCode(e) {
    e.preventDefault();
    dispatch(deviceActions.resetDevice());
    setDevice(emptyDevice);
  }
  function handleOpenList(e) {
    e.preventDefault();
    setDeviceTable(true);
  }
  function handleInputOrderData(e) {
    const { name, value } = e.target || e;
    const newOrder = { ...order, [name]: value };
    setOrder(newOrder);
  }
  function handleNewIntervention(data) {
    setInterventions([...interventions, data]);
  }

  function handleCheck(e) {
    e.preventDefault();
    let w = [];
    let errorsFound = [];
    if (forPlan === undefined)
      errorsFound.push("Debe indicar si la orden es de plan o no");
    if (forPlan && !order.taskDate)
      errorsFound.push("Debe indicar la fecha del plan que cubre la orden");
    for (let key of ["supervisor", "class", "issue", "solicitor"]) {
      if (!order[key]) errorsFound.push(["Debe indicar " + headersRef[key]]);
    }
    if (errorsFound[0]) {
      setErrors(errorsFound);
      return;
    }
    for (let key of ["clientWO", "servicePoint"]) {
      if (!order[key])
        w.push("¿Desea guardar sin indicar " + headersRef[key] + "?");
    }
    if (!order.completed || !order.completed === 0)
      w.push("¿desea guardar sin indicar avance?");
    w[0] ? setWarnings(w) : handleSave();
  }

  function handleSave(manualOrder) {
    // handleSuccess();
    const orderToSave = manualOrder || order;
    setSaving(true);
    if (orderCode) {
      dispatch(
        workOrderActions.updateOrder(orderCode, {
          ...orderToSave,
          device: device.code,
          interventions,
        })
      );
    } else {
      dispatch(
        workOrderActions.newWorkOrder({
          ...orderToSave,
          device: device.code,
          user: userData.user,
          interventions,
        })
      );
    }
  }

  function handleForPlan(json) {
    const { value, taskDate } = json;
    setForPlan(value);
    setOrder({ ...order, taskDate: taskDate?.id });
  }

  function handleSuccess() {
    if (!orderCode) {
      let emptyOrder = { ...order };
      for (let key of Object.keys(emptyOrder)) emptyOrder[key] = "";
      setOrder(emptyOrder);
      setForPlan(false);
      setDevice(emptyDevice);
      dispatch(deviceActions.resetDevice());
    }
    dispatch(workOrderActions.resetOrderResult());
    navigate("/ots");
  }

  function handleCloseOrder(e) {
    e.preventDefault();
    let newOrder = { ...order, status: "Cerrada" };
    setOrder(newOrder);
    handleSave(newOrder);
  }
  function handleAskToClose(e) {
    e.preventDefault();
    let newOrder = { ...order, completed: "99" };
    setOrder(newOrder);
    handleSave(newOrder);
  }
  useEffect(() => orderResult && setSaving(false), [orderResult]);

  // useEffect(
  //   () => console.log("selectedDevice", selectedDevice),
  //   [selectedDevice]
  // );

  const isClosed = order.status === "Cerrada";

  return (
    <div className="page-container">
      {warnings[0] && (
        <WarningErrors
          warnings={warnings}
          close={() => setWarnings(false)}
          proceed={() => handleSave()}
        />
      )}
      {errors[0] && (
        <div className="modal">
          <div className="alert alert-danger d-flex flex-column">
            <b>Algo no salió bien...</b>
            <ul>
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
            <button
              className="btn btn-danger align-self-center w-auto"
              onClick={(e) => {
                e.preventDefault();
                setErrors([]);
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
      {orderResult.error && (
        <ErrorModal
          message={`La orden de trabajo no se pudo guardar. Error: ${orderResult.error}`}
          close={() => dispatch(workOrderActions.resetOrderResult())}
        />
      )}
      {orderResult.success && orderCode && (
        <SuccessModal
          message={`La orden de trabajo N° ${orderResult.success} fue guardada exitosamente.`}
          link={orderCode ? null : `/ots/detail/${orderResult.success}`}
          close={handleSuccess}
        />
      )}
      {deviceTable && (
        <div className="modal">
          <div
            className="container bg-light m-2"
            style={{ height: "90%", overflowY: "auto" }}
          >
            <div className="row">
              <div className="col d-flex justify-content-end">
                <button
                  className="btn btn-close"
                  onClick={() => setDeviceTable(false)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <DeviceList close={() => setDeviceTable(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col min-h-0 pb-4 flex-grow">
        <div className="page-title ">
          {orderCode ? (
            <div>
              <div className="flex gap-6 items-center">
                {"Orden de trabajo N° " + orderCode}
                <div
                  className={`badge ${
                    isClosed ? "badge-success" : "badge-error"
                  }`}
                >
                  {order.status}
                </div>
              </div>
              <div className="text-sm font-normal">
                {"Creada por " +
                  order.user +
                  " el " +
                  new Date(order.regDate).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <div>Nueva Orden de Trabajo</div>
              {(permissions.admin || permissions.supervisor) && (
                <LoadOrdersFromExcel />
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between sm:items-end gap-4 -mt-3 mb-1">
          <WorkerSelector
            key={order.code}
            label={"Responsable"}
            defaultValue={order.responsible}
            permissions={permissions}
            action={(value) =>
              handleInputOrderData({ name: "responsible", value })
            }
          />

          <div className="flex sm:w-1/3 flex-grow">
            {(!!selectedDevice?.taskDates?.length ||
              !!orderDetail?.taskDates?.length) && (
              <ForPlan select={handleForPlan} order={orderDetail || order} />
            )}
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 2xl:grid-cols-3 flex-grow gap-4 mb-4 md:min-h-0">
          <WorkOrderCard title="DATOS DEL EQUIPO">
            <div className="join my-1md:my-2">
              {!device.name && (
                <>
                  <input
                    className="flex flex-grow input-sm join-item bg-base-100 border-2 border-info"
                    type="text"
                    value={device.code}
                    onChange={handleInputCode}
                    readOnly={
                      !(
                        permissions.author ||
                        permissions.admin ||
                        permissions.supervisor
                      )
                    }
                  />
                  <button
                    className="btn btn-sm btn-info join-item"
                    style={{ zIndex: 0 }}
                    onClick={handleSearch}
                    disabled={!device.code}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                  <button
                    className="btn btn-sm btn-primary join-item"
                    onClick={handleOpenList}
                    disabled={device.name}
                  >
                    LISTA
                    <FontAwesomeIcon icon={faTable} />
                  </button>
                </>
              )}
              {device.name && (
                <>
                  <div className="flex items-center flex-grow px-1 join-item cursor-default  bg-base-100 border-2 border-primary text-ellipsis overflow-hidden rounded-l-md">
                    <p>
                      <b>[{device.code}]</b> {device.name}
                    </p>
                  </div>

                  <button
                    className="btn btn-sm h-full btn-error join-item"
                    title="cambiar Equipo"
                    onClick={handleDeleteCode}
                  >
                    <FontAwesomeIcon icon={faSyncAlt} />
                  </button>
                </>
              )}
            </div>
            <div
              className={`flex-grow flex flex-col justify-between pt-2 ${
                device.name ? "" : "opacity-50"
              }`}
            >
              <p>
                <b>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {device.location}
                </b>
              </p>
              <p>
                <b>Tipo:</b> {device.type}{" "}
                {device.gasAmount && `(${device.gasAmount})`}
              </p>
              <p>
                <b>Categoría:</b> {device.category}
              </p>
              <p>
                <b>Servicio:</b> {device.service}
              </p>
              <p>
                <b>Ambiente:</b> {device.environment}
              </p>
            </div>
          </WorkOrderCard>

          <WorkOrderCard title="DETALLES DE LA ORDEN">
            {order && (
              <>
                <OrderField
                  field="Supervisor"
                  name="supervisor"
                  options={workOrderOptions.supervisor || []}
                  value={order.supervisor}
                  onInput={handleInputOrderData}
                />
                <OrderField
                  field="OT Planta"
                  name="clientWO"
                  value={order.clientWO}
                  onInput={handleInputOrderData}
                />
                <OrderField
                  field="Clase"
                  value={order.class}
                  name="class"
                  options={workOrderOptions.class}
                  onInput={handleInputOrderData}
                />
                <OrderField
                  field="Problema"
                  options={workOrderOptions.issue}
                  value={order.issue}
                  name="issue"
                  onInput={handleInputOrderData}
                />
                <OrderField
                  field="Solicitante"
                  value={order.solicitor}
                  name="solicitor"
                  onInput={handleInputOrderData}
                />
                <OrderField
                  field="Teléfono"
                  value={order.phone}
                  name="phone"
                  onInput={handleInputOrderData}
                />
                <OrderField
                  field="Lugar Servicio"
                  name="servicePoint"
                  value={order.servicePoint}
                  options={selectedDevice.servicePoints}
                  onInput={handleInputOrderData}
                />
              </>
            )}
          </WorkOrderCard>

          <WorkOrderObservations
            user={userData.user}
            onSubmit={(text) =>
              setOrder({
                ...order,
                description: order.description
                  ? [order.description, text].join("\n- ")
                  : text,
              })
            }
            value={order.description}
          />
          <div className="flex xl:col-span-3 min-h-0 overflow-y-auto">
            <InterventionList
              interventions={interventions}
              permissions={permissions}
              openAdd={() => setInterventionForm(true)}
              onDelete={(id) => {
                permissions.admin && interventions[id].id
                  ? alert(
                      "No pueden eliminarse las intervenciones grabadas. Funcionalidad en desarrollo."
                    )
                  : setInterventions(
                      interventions.filter((i, index) => index !== id)
                    );
              }}
            />
          </div>
        </div>
        <div className="mt-auto">
          <WorkOrderCard className="w-full">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2 flex-grow">
                <div className="card-title"> Avance</div>
                <WOProgress
                  errorCond={
                    order.interventions && order.interventions.length > 0
                  }
                  value={order.completed || 0}
                  min={minProgress}
                  max="99"
                  disabled={false}
                  select={handleInputOrderData}
                />
              </div>
              <div className="flex gap-2 md:gap-4 flex-wrap-reverse">
                {Object.values(permissions).includes(true) && (
                  <button
                    className="btn btn-sm btn-info flex-grow md:flex-grow-0"
                    onClick={handleCheck}
                    disabled={!allowSaving || saving}
                  >
                    <i className="fas fa-save" /> Guardar
                  </button>
                )}
                {(permissions.author || permissions.worker) && (
                  <button
                    className="btn btn-sm btn-success flex-grow  md:flex-grow-0"
                    disabled={!allowSaving || saving}
                    onClick={handleAskToClose}
                  >
                    <i className="fas fa-lock" /> Solicitar Cierre
                  </button>
                )}
                {(permissions.admin || permissions.supervisor) && (
                  <>
                    <button
                      className="btn btn-sm btn-success flex-grow  md:flex-grow-0"
                      disabled={!allowSaving || saving}
                      onClick={handleCloseOrder}
                    >
                      <i className="fas fa-lock" /> CERRAR OT
                    </button>
                    {device.name && <FollowDevice />}
                  </>
                )}
              </div>
            </div>
          </WorkOrderCard>
          {interventionForm && (
            <AddIntervention
              select={handleNewIntervention}
              close={() => setInterventionForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
