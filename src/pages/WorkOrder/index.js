import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions, workOrderActions } from "../../actions/StoreActions";
import { appConfig } from "../../config";
import DeviceList from "../../components/lists/DeviceList";
import AddTextForm from "../../components/forms/AddText";
import InterventionList from "../../components/lists/InterventionList";
import AddIntervention from "../../components/forms/InterventionForm";
import WOProgress from "../../components/progress/WOProgresBar";
import { ErrorModal, SuccessModal } from "../../components/warnings";
import WarningErrors from "../../components/warnings/WarningErrors";
import ForPlan from "./ForPlan";
import { useNavigate, useParams } from "react-router-dom";

const { headersRef } = appConfig;

const emptyDevice = {
  code: "",
  location: "",
  name: "",
  type: "",
  category: "",
  service: "",
  environment: "",
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
  const { plan } = useSelector((s) => s.plan);
  const { deviceFullList, selectedDevice } = useSelector((s) => s.devices);
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

  useEffect(() => {
    if (!orderCode && plan.find((p) => p.code === device.code))
      setForPlan(undefined);
  }, [plan, device, orderCode]);

  useEffect(
    () =>
      setPermissions({
        author:
          order.completed < 99 && (!order.code || order.userId === userData.id),
        admin: userData.access === "Admin",
        supervisor:
          order.completed <= 99 &&
          userData.access === "Supervisor" &&
          userData.id === order.supervisor,
        worker: order.completed < 99 && userData.access === "Worker",
      }),
    [userData, order]
  );

  useEffect(() => {
    if (!orderCode) return;
    dispatch(workOrderActions.searchWO(orderCode));
  }, [orderCode, dispatch]);

  useEffect(() => {
    if (!(orderDetail.code && deviceFullList[0])) return;
    const editOrder = { ...orderDetail };
    const device = deviceFullList.find(
      (d) => d.code === orderDetail.device.code
    );
    dispatch(deviceActions.setDevice(device));
    delete editOrder.device;
    setInterventions(orderDetail.interventions);
    delete editOrder.interventions;
    setForPlan(!!editOrder.taskDate);
    setMinProgress(orderDetail.completed);
    setOrder(editOrder);
  }, [orderDetail, dispatch, deviceFullList]);

  useEffect(() => {
    let check = true;
    if (!device.name) check = false;
    for (let key of ["supervisor", "class", "issue", "solicitor"]) {
      if (!order[key]) check = false;
    }
    if (!order.description && !interventions[0]) check = false;
    setAllowSaving(check);
  }, [interventions, device, order]);

  useEffect(() => {
    if (requested) return;
    if (!deviceFullList[0]) dispatch(deviceActions.getFullList(userData.plant));
    if (Object.keys(workOrderOptions).length === 0)
      dispatch(workOrderActions.getWOOptions(userData.plant));
    setRequested(true);
  }, [requested, workOrderOptions, deviceFullList, dispatch, userData]);

  const selectDevice = useCallback(
    (d) => {
      let newDevice = {};
      if (d.name) {
        newDevice = { ...device };
        const { plant, area, line } = d;
        const { type, power, refrigerant } = d;
        for (let key of Object.keys(device).filter(
          (k) => !["location", "type"].includes(k)
        )) {
          newDevice[key] = d[key];
        }
        newDevice.location = plant + "> " + area + "> " + line;
        newDevice.type =
          type +
          " " +
          (power >= 9000 ? Math.floor(power / 3000) + "TR" : power + " fg") +
          " - " +
          refrigerant;
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
  }, [selectDevice, selectedDevice, device]);

  function handleInputCode(e) {
    const { value } = e.target;
    setDevice({ ...device, code: value });
  }

  function handleSearch(e) {
    e.preventDefault();
    const newDevice = deviceFullList.find((d) => d.code === device.code);
    dispatch(deviceActions.setDevice(newDevice || device));
  }
  function handleDeleteCode(e) {
    e.preventDefault();
    dispatch(deviceActions.setDevice(emptyDevice));
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
    setOrder({ ...order, taskDate: taskDate && taskDate.id });
  }

  function handleSuccess() {
    if (!orderCode) {
      let emptyOrder = { ...order };
      for (let key of Object.keys(emptyOrder)) emptyOrder[key] = "";
      setOrder(emptyOrder);
      setForPlan(false);
      setDevice(emptyDevice);
      dispatch(deviceActions.setDevice({}));
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

  // useEffect(() => console.log("saving", saving), [saving]);
  // useEffect(() => console.log("forPlan", forPlan), [forPlan]);

  return (
    <div className="w-100">
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
      {orderResult.success && (
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

      <div className="container d-flex flex-column align-items h-100">
        <div className="row pt-2">
          <div>
            {orderCode ? (
              <div className="row pt-2 align-items-end">
                <div className="col-md-auto">
                  <div className="d-flex gap-2">
                    <h5>{"Orden de trabajo N° " + orderCode}</h5>{" "}
                    <h5
                      className={
                        order.status === "Cerrada"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      [{order.status}]
                    </h5>
                  </div>
                </div>
                <div className="col-md-auto">
                  <h6>
                    {"Creada por " +
                      order.user +
                      " el " +
                      new Date(order.regDate).toLocaleDateString()}
                  </h6>{" "}
                </div>
              </div>
            ) : (
              <div className="col-md-auto">
                <h5>"Nueva Orden de Trabajo"</h5>
              </div>
            )}
          </div>
        </div>
        <div className="row py-2">
          {device.name && (
            <ForPlan
              device={device}
              select={handleForPlan}
              current={{ forPlan, task: order.taskDate }}
            />
          )}
        </div>
        <div className="row py-2">
          {/* device data */}
          <div className="col-lg-4">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item border-0">
                <button
                  className="btn btn-secondary w-100"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Información del Equipo
                </button>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body p-0">
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon3">
                        Código
                      </span>
                      <input
                        type="text"
                        value={device.code}
                        className="form-control"
                        id="basic-url"
                        aria-describedby="basic-addon3"
                        onChange={handleInputCode}
                        readOnly={
                          !(
                            permissions.author ||
                            permissions.admin ||
                            permissions.supervisor
                          )
                        }
                      />
                      {!device.name && (
                        <button
                          className="btn btn-info col-2"
                          style={{ zIndex: 0 }}
                          onClick={handleSearch}
                          disabled={!device.code}
                        >
                          <i className="fas fa-search" />
                        </button>
                      )}
                      {device.name && (
                        <button
                          className="btn btn-danger col-4"
                          style={{ zIndex: 0 }}
                          onClick={handleDeleteCode}
                          disabled={!device.name}
                        >
                          <i className="fas fa-backspace pe-1" />
                        </button>
                      )}
                      {!device.name && (
                        <button
                          className="btn btn-outline-info col-3 px-1 flex-shrink-1"
                          style={{ zIndex: 0 }}
                          onClick={handleOpenList}
                          disabled={device.name}
                        >
                          LISTA
                          <i className="fas fa-table ms-1" />
                        </button>
                      )}
                    </div>
                    {Object.keys(device)
                      .filter((k) => k !== "code")
                      .map((k, i) => (
                        <div className="input-group" key={i}>
                          <span className="input-group-text" id="basic-addon3">
                            {k === "location" ? (
                              <i className="fas fa-map-marker-alt" />
                            ) : (
                              <div>{headersRef[k]}</div>
                            )}
                          </span>
                          <input
                            className={`form-control ${
                              device.name ? "bg-white" : ""
                            }`}
                            id={"device-" + k}
                            type="text"
                            value={device[k]}
                            aria-describedby="basic-addon3"
                            readOnly
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* order data */}
          <div className="col-lg-4">
            <div className="btn btn-secondary w-100">
              Detalle de la orden de trabajo
            </div>
            {[
              "supervisor",
              "clientWO",
              "class",
              "issue",
              "solicitor",
              "phone",
              "servicePoint",
            ].map((k, i) => {
              const options =
                k === "servicePoint"
                  ? selectedDevice.servicePoints || []
                  : workOrderOptions[k] || [];
              return (
                <div className="input-group" key={i}>
                  <span className="input-group-text" id="basic-addon3">
                    {headersRef[k]}
                  </span>
                  {["supervisor", "class", "issue", "servicePoint"].includes(
                    k
                  ) ? (
                    <select
                      className="form-control"
                      id={"order-" + k}
                      name={k}
                      value={order[k]}
                      onChange={handleInputOrderData}
                      disabled={!device.name}
                    >
                      <option value="">Sin Especificar</option>
                      {options
                        .filter((item) =>
                          item.plant
                            ? device.location.startsWith(item.plant)
                            : true
                        )
                        .map((s, i) => (
                          <option key={i} value={s.id || s}>
                            {s.name || s}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={k}
                      value={order[k]}
                      className="form-control"
                      id={"order-" + k}
                      aria-describedby="basic-addon3"
                      disabled={!device.name}
                      onChange={handleInputOrderData}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {/* order description & comments */}
          <div className="col-lg-4 d-flex flex-column">
            <div className="btn btn-secondary w-100">Observaciones</div>
            <textarea
              className="form-control bg-light flex-grow-1"
              style={{ minHeight: "15vh" }}
              value={order.description}
              readOnly
            />
            <button className="btn btn-info" onClick={() => setEditDesc(true)}>
              <i className="fas fa-comment-dots me-1" />
              Agregar comentario
            </button>
            {editDesc && (
              <AddTextForm
                user={userData.user}
                select={(text) =>
                  setOrder({
                    ...order,
                    description: order.description
                      ? "-" + [order.description, text].join("\n-")
                      : text,
                  })
                }
                close={() => setEditDesc(false)}
              />
            )}
          </div>
        </div>
        {/* Interventions */}
        <div className="row py-2 flex-grow-1">
          <div className="col">
            <div className="btn btn-secondary w-100">Intervenciones</div>
            <InterventionList
              interventions={interventions}
              permissions={permissions}
              onDelete={(id) => {
                permissions.admin && interventions[id].id
                  ? alert(
                      "No pueden eliminarse las intervenciones grabadas. Funcionalidad en desarrollo."
                    )
                  : setInterventions(
                      interventions.filter((i, index) => index !== id)
                    );
              }}
              openAdd={() => setInterventionForm(true)}
            />
            {interventionForm && (
              <AddIntervention
                select={handleNewIntervention}
                close={() => setInterventionForm(false)}
              />
            )}
          </div>
        </div>
        {/* work order progress */}
        <div className="row py-2 h-25">
          <div className="col-sm-6">
            <div className="btn btn-secondary w-100"> Avance de OT</div>
            <div className="py-4">
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
          </div>
          <div className="col-sm-6 flex align-items-start flex-wrap gap-1">
            {Object.values(permissions).includes(true) && (
              <button
                className="btn btn-info flex-grow-1"
                onClick={handleCheck}
                disabled={!allowSaving || saving}
              >
                <i className="fas fa-save" /> Guardar
              </button>
            )}
            {(permissions.author || permissions.worker) && (
              <button
                className="btn btn-success  flex-grow-1"
                disabled={!allowSaving || saving}
                onClick={handleAskToClose}
              >
                <i className="fas fa-lock" /> Solicitar Cierre
              </button>
            )}
            {(permissions.admin || permissions.supervisor) && (
              <button
                className="btn btn-success  flex-grow-1"
                disabled={!allowSaving || saving}
                onClick={handleCloseOrder}
              >
                <i className="fas fa-lock" /> CERRAR OT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
