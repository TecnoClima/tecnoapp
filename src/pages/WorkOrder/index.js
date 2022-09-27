import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deviceActions,
  planActions,
  workOrderActions,
} from "../../actions/StoreActions";
import { appConfig } from "../../config";
import DeviceList from "../../components/lists/DeviceList";
import AddTextForm from "../../components/forms/AddText";
import InterventionList from "../../components/lists/InterventionList";
import AddIntervention from "../../components/forms/InterventionForm";
import WOProgress from "../../components/progress/WOProgresBar";
import { ErrorModal, SuccessModal } from "../../components/warnings";
import WarningErrors from "../../components/warnings/WarningErrors";
import ForPlan from "./ForPlan";
import { useParams } from "react-router-dom";

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
  const [order, setOrder] = useState({
    supervisor: "",
    clientWO: "",
    class: "",
    issue: "",
    solicitor: "",
    phone: "",
    servicePoint: "",
  });
  const { workOrderOptions, orderDetail, orderResult } = useSelector(
    (state) => state.workOrder
  );
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
  const dispatch = useDispatch();
  //openers//
  const [deviceTable, setDeviceTable] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [interventionForm, setInterventionForm] = useState(false);

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
          order.completed < 99 &&
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
    console.log("Grabamos", { ...order, device, interventions });
    // handleSuccess();
    const orderToSave = manualOrder || order;
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

  // useEffect(() => console.log("order", order), [order]);
  // useEffect(() => console.log("device", device), [device]);
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
          link={orderCode ? undefined : `/ots/detail/${orderResult.success}`}
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
                      {options.map((s, i) => (
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
            <button
              className="btn btn-info flex-grow-1"
              onClick={handleCheck}
              disabled={!allowSaving}
            >
              <i className="fas fa-save" /> Guardar
            </button>
            {!permissions.admin && (
              <button
                className="btn btn-success  flex-grow-1"
                disabled={!allowSaving}
                onClick={handleAskToClose}
              >
                <i className="fas fa-lock" /> Solicitar Cierre
              </button>
            )}
            {permissions.admin && (
              <button
                className="btn btn-success  flex-grow-1"
                disabled={!allowSaving}
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

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { deviceActions, planActions } from "../../actions/StoreActions";
// import {
//   getWOOptions,
//   newIntervention,
//   newWorkOrder,
//   resetOrderResult,
//   searchWO,
//   updateOrder,
// } from "../../actions/workOrderActions";

// import InterventionList from "../../components/lists/InterventionList";
// import WOProgress from "../../components/progress/WOProgresBar";
// import { ErrorModal, SuccessModal } from "../../components/warnings";
// import WarningErrors from "../../components/warnings/WarningErrors";
// import AddTextForm from "../../components/forms/AddText";
// import { FormInput, FormSelector } from "../../components/forms/FormInput";
// import AddIntervention from "../../components/forms/InterventionForm";
// import DeviceList from "../../components/lists/DeviceList";

// function buildDevice(device) {
//   //order detail
//   if (!device) return {};
//   if (device.power) {
//     device.powerAndType = `${device.type} (${
//       device.power + " " + device.unit
//     }) ${device.refrigerant}`;
//   }
//   return device;
// }

// export default function WorkOrder() {

//   //global variables
//   const { otCode } = useParams();
//   const { userData } = useSelector((state) => state.people);
//   const { selectedDevice, deviceResult } = useSelector(
//     (state) => state.devices
//   );
//   const { plan, selectedTask } = useSelector((state) => state.plan);
//   const { workOrderOptions, orderDetail, orderResult } = useSelector(
//     (state) => state.workOrder
//   );

//   //openers
//   const [selectDate, setSelectDate] = useState(false);
//   const [pickDevice, setPickDevice] = useState(false);
//   const [intForm, setIntForm] = useState(false);
//   const [editDesc, setEditDesc] = useState(false);
//   const [errors, setErrors] = useState(false);
//   const [warnings, setWarnings] = useState(false);
//   const [toClose, setClose] = useState(false);
//   const [closeOrder, setCloseOrder] = useState("");

//   //local data states
//   const [planDates, setPlanDates] = useState([]);
//   const [interventions, setInterventions] = useState([]);
//   const [device, setDevice] = useState({});
//   const [deviceCode, setDeviceCode] = useState("");
//   const [order, setOrder] = useState({});
//   const [update, setUpdate] = useState({});
//   const [supervisor, setSupervisor] = useState(undefined);

//   const [permissions, setPermissions] = useState({
//     create: true,
//     edit: true,
//     admin: false,
//   });
//   const dispatch = useDispatch();

//   useEffect(
//     () =>
//       order.taskDate &&
//       planDates[0] &&
//       dispatch(
//         planActions.selectTask(
//           planDates.find((date) => date.id === order.taskDate)
//         )
//       ),
//     [order, planDates, dispatch]
//   );

//   useEffect(
//     () =>
//       setPlanDates(
//         plan
//           .filter((task) => {
//             const today = new Date();
//             return (
//               task.code === device.code &&
//               new Date(task.date) <= today.setDate(today.getDate() + 7)
//             );
//           })
//           .map((task) => ({
//             ...task,
//             localDate: new Date(task.date).toLocaleDateString(),
//           }))
//       ),
//     [plan, device]
//   );

//   useEffect(() => {
//     if (!order.code) return;
//     setPermissions({
//       create: !order.code || userData.access === "Admin",
//       edit:
//         !order.code ||
//         (order.code &&
//           (!order.completed || order.completed < 100) &&
//           (userData.id === order.userId || supervisor === userData.id)) ||
//         userData.access === "Admin",
//       admin: userData.access === "Admin",
//     });
//   }, [order, userData, supervisor]);

//   useEffect(() => {
//     if (!selectedTask) return;
//     setSelectDate(!!selectedTask.date);
//     if (!supervisor) setSupervisor(selectedTask.supervisor);
//   }, [selectedTask, supervisor]);

//   useEffect(() => otCode && dispatch(searchWO(otCode)), [otCode, dispatch]);

//   useEffect(() => {
//     setOrder(orderDetail);
//     if (!orderDetail.code) return;
//     const { device } = orderDetail;
//     setDevice(device ? buildDevice(device) : {});
//     setDeviceCode(device.code);
//     setSupervisor(orderDetail.supervisor);
//     // dispatch(planActions.selectTask(plan.find(date=>date.id === orderDetail.taskDate)))
//     setOrder(orderDetail);
//     setInterventions(orderDetail.interventions);
//   }, [orderDetail, dispatch, plan]);

//   useEffect(() => {
//     if (!selectedDevice.code) return;
//     if (
//       !otCode &&
//       selectedDevice.servicePoints &&
//       selectedDevice.servicePoints.length === 1
//     ) {
//       setOrder({ servicePoint: selectedDevice.servicePoints[0] });
//     }
//     setDeviceCode(selectedDevice.code || "");
//     setDevice(buildDevice(selectedDevice));
//   }, [selectedDevice, dispatch, otCode]);

//   useEffect(() => dispatch(getWOOptions()), [dispatch]);

//   function searchCode(e) {
//     e.preventDefault();
//     dispatch(deviceActions.getDetail(deviceCode));
//   }

//   function handleDevCode(e) {
//     e.preventDefault();
//     const { value } = e.target;
//     value && setDeviceCode(value);
//     setDevice({});
//     // if(!value)dispatch(deviceActions.resetDevice())
//   }

//   function handleValue(e, item) {
//     e.preventDefault();
//     let object = otCode ? { ...update } : { ...order };
//     const { value } = e.target;
//     if (!value) {
//       otCode ? (object[item] = null) : delete object[item];
//     } else {
//       object[item] = value;
//     }
//     otCode ? setUpdate(object) : setOrder(object);
//   }

//   function checkErrors() {
//     const errors = [];
//     const warnings = [];
//     // if (!supervisor && selectedTask) setSupervisor(selectedTask.supervisor)

//     if (!deviceCode) errors.push("Debe seleccionar un equipo");
//     if (!supervisor) errors.push("Debe seleccionar un supervisor");
//     if (!order.clientWO)
//       warnings.push("¿Seguro que desea guardar la orden sin una OT Cliente?");
//     if (!order.class) errors.push("Debe indicar la clase de la orden");
//     if (!order.issue) errors.push("Debe indicar el problema");
//     if (!order.cause) errors.push("Debe indicar la causa");
//     if (!order.solicitor) errors.push("Debe indicar quién solicitó la orden");
//     if (!order.phone)
//       warnings.push(
//         "¿Seguro que desea guardar la orden sin un teléfono asociado?"
//       );
//     if (!order.servicePoint)
//       warnings.push(
//         "¿Seguro que desea guardar la orden sin un lugar de servicio asociado?"
//       );
//     if (!order.description) errors.push("Debe asignar una descripción");
//     if (!interventions || !interventions[0])
//       warnings.push("¿Seguro que desea guardar la orden sin intervenciones?");

//     if (
//       (!orderDetail && (!order.completed || order.completed === 0)) ||
//       (!!orderDetail &&
//         (!update.completed || orderDetail.completed === update.completed))
//     )
//       warnings.push(
//         "¿Seguro que desea guardar la orden sin modificar el avance?"
//       );

//     if (errors[0]) {
//       setErrors(errors);
//     } else {
//       setErrors(false);
//       if (warnings[0]) {
//         setWarnings(warnings);
//       } else {
//         handleSave();
//       }
//     }
//   }

//   function handleAdvancedSearch(e) {
//     e.preventDefault();
//     setPickDevice(true);
//   }

//   function askClose(e) {
//     if (e) e.preventDefault();
//     setClose(100);
//     checkErrors();
//   }
//   function handleClose(e) {
//     e && e.preventDefault && e.preventDefault();
//     setClose(true);
//     if (!!closeOrder) setCloseOrder(true);
//     const newOrder = { ...order, completed: 100 };
//     if (closeOrder) newOrder.status = "Cerrada";
//     setOrder(newOrder);
//     checkErrors();
//   }
//   function adminCloseOrder(e) {
//     if (e) {
//       e.preventDefault();
//     }
//     setCloseOrder(100);
//   }

//   function handleSave(e) {
//     //dipatch update taskDate if otCode, add or remove if not
//     if (e) e.preventDefault();
//     if (otCode) {
//       dispatch(
//         updateOrder(otCode, {
//           ...update,
//           supervisor,
//           completed:
//             userData.access === "Admin"
//               ? update.completed || order.completed
//               : toClose || closeOrder
//               ? 100
//               : order.completed,
//           status: closeOrder ? "Cerrada" : order.status || "Abierta",
//           userId: userData.id,
//         })
//       );
//       dispatch(planActions.dateOrder({ order: otCode, date: update.taskDate }));
//     } else {
//       const sendOrder = {
//         ...order,
//         user: userData.user,
//         interventions,
//         device: deviceCode,
//         supervisor,
//         completed: toClose ? 100 : order.completed,
//         userId: userData.id,
//       };
//       dispatch(newWorkOrder(sendOrder));
//     }
//   }

//   function selectTaskDate(e) {
//     e.preventDefault();
//     const id = e.target.value;
//     otCode
//       ? setUpdate({ ...update, taskDate: id })
//       : setOrder({ ...order, taskDate: id });
//   }

//   function createIntervention(data) {
//     otCode
//       ? dispatch(newIntervention(otCode, data))
//       : setInterventions([...interventions, data]);
//   }

//   function getDate(date) {
//     const newDate = new Date(date);
//     return `${newDate.toLocaleDateString()} ${newDate.getHours()}:${newDate.getMinutes()}`;
//   }

//   function closeSuccess() {
//     setEditDesc(false);
//     setInterventions([]);
//     setOrder({});
//     dispatch(resetOrderResult());
//   }

//   return (
//     <div className="container-fluid h-100 d-flex flex-column justify-content-between">
//       {warnings && (
//         <WarningErrors
//           warnings={warnings}
//           close={() => setWarnings(false)}
//           proceed={() => handleSave()}
//         />
//       )}
//       <div className="row m-1">
//         {otCode && (
//           <div className="col-sm-6 rounded-3 flex">
//             <FormInput label="N° OT" defaultValue={otCode} readOnly={true} />
//             <FormInput
//               label="Estado"
//               defaultValue={orderDetail.status}
//               readOnly={true}
//             />
//           </div>
//         )}

//         {(planDates[0] || order.taskDate) && (
//           <div
//             className={`col-sm-6 ${
//               selectDate || order.taskDate ? "bg-nav" : "bg-grey"
//             } flex align-items-center p-1`}
//           >
//             <div className="col-1 ps-0 pe-0 flex align-items-center">
//               <input
//                 className="form-check"
//                 type="checkBox"
//                 style={{ margin: ".5rem", transform: "scale(1.5)" }}
//                 defaultChecked={
//                   (selectedTask && selectedTask.date) || order.taskDate
//                 }
//                 onChange={(e) => setSelectDate(e.target.checked)}
//                 disabled={!permissions.edit}
//               />
//             </div>
//             <div className="col-5 ps-0 pe-0 text-light flex align-items-center">
//               <label>{`${
//                 selectDate ? "TAREA DE PLAN" : "¿TAREA DE PLAN?"
//               }`}</label>
//             </div>
//             {(selectDate || selectedTask.id) && (
//               <div className="col-6  ps-0 pe-0">
//                 <FormSelector
//                   key={selectedTask}
//                   label="Fecha Plan"
//                   defaultValue={selectedTask.id ? selectedTask.id : undefined}
//                   options={planDates}
//                   valueField="id"
//                   captionField="localDate"
//                   disabled={!permissions.edit}
//                   onBlur={selectTaskDate}
//                 />
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       <div className="row">
//         <div className="col-md-4">
//           <section className="container-fluid p-0 mt-1 mb-1">
//             {pickDevice && (
//               <div className="modal">
//                 <div
//                   className="container bg-light m-2"
//                   style={{ height: "90%", overflowY: "auto" }}
//                 >
//                   <div className="row">
//                     <div className="col d-flex justify-content-end">
//                       <button
//                         className="btn btn-close"
//                         onClick={() => setPickDevice(false)}
//                       />
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col">
//                       <DeviceList close={() => setPickDevice(false)} />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="accordion" id="accordionExample">
//               <div className="accordion-item">
//                 <button
//                   className="btn btn-secondary w-100"
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#collapseOne"
//                   aria-expanded="true"
//                   aria-controls="collapseOne"
//                 >
//                   <b>
//                     {device.code
//                       ? `[${device.code}] ${device.name}`
//                       : "Datos del Equipo"}
//                   </b>
//                 </button>
//                 <div
//                   id="collapseOne"
//                   className="accordion-collapse collapse show"
//                   aria-labelledby="headingOne"
//                   data-bs-parent="#accordionExample"
//                 >
//                   <div className="container p-0">
//                     <form className="row" onSubmit={searchCode}>
//                       <div className="col d-flex">
//                         <FormInput
//                           label="Cod.Eq."
//                           defaultValue={deviceCode}
//                           placeholder={"código completo"}
//                           readOnly={!permissions.create}
//                           changeInput={handleDevCode}
//                         />
//                         {!device.code && (
//                           <button
//                             type="submit"
//                             className="btn btn-info"
//                             disabled={!deviceCode && !permissions.create}
//                           >
//                             <i className="fas fa-search" />
//                           </button>
//                         )}
//                         {!device.code && (
//                           <button
//                             className="btn btn-outline-info"
//                             style={{ minWidth: "fit-content" }}
//                             disabled={!deviceCode && !permissions.create}
//                             onClick={handleAdvancedSearch}
//                           >
//                             ABRIR LISTA
//                           </button>
//                         )}
//                         {device.code && (
//                           <button
//                             className="btn btn-danger"
//                             disabled={!permissions.create}
//                             onClick={handleDevCode}
//                           >
//                             <i className="fas fa-backspace" />
//                           </button>
//                         )}
//                         {deviceResult.error && (
//                           <ErrorModal
//                             message={`Equipo código '${deviceCode}' no encontrado`}
//                             close={() => dispatch(deviceActions.resetResult())}
//                           />
//                         )}
//                       </div>
//                     </form>
//                     <FormInput
//                       label="Equipo"
//                       defaultValue={device.name}
//                       readOnly={true}
//                     />
//                     <div className="section">
//                       <FormInput
//                         label="Planta"
//                         defaultValue={device.plant}
//                         readOnly={true}
//                       />
//                       <FormInput
//                         label="Area"
//                         defaultValue={device.area}
//                         readOnly={true}
//                       />
//                     </div>
//                     <FormInput
//                       label="Linea"
//                       defaultValue={device.line}
//                       readOnly={true}
//                     />
//                     <FormInput
//                       label="Tipo"
//                       defaultValue={device.powerAndType}
//                       readOnly={true}
//                     />
//                     <div className="section">
//                       <FormInput
//                         label="Categoría"
//                         defaultValue={device.category}
//                         readOnly={true}
//                       />
//                       <FormInput
//                         label="Servicio"
//                         defaultValue={device.service}
//                         readOnly={true}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>

//         <div className="col-md-4 h-auto d-flex m-0">
//           <section className="container h-auto d-flex flex-column justify-content-between p-0">
//             <div className="row d-grid gap-2 m-0">
//               <button className="btn btn-secondary mt-1">
//                 Detalle de la orden de trabajo
//               </button>
//             </div>
//             {(workOrderOptions.supervisor || order.supervisor) && (
//               <FormSelector
//                 key={supervisor}
//                 label="Supervisor"
//                 defaultValue={supervisor}
//                 options={workOrderOptions.supervisor}
//                 valueField="id"
//                 captionField="name"
//                 onBlur={(e) => setSupervisor(e.target.value)}
//                 disabled={!permissions.edit}
//               />
//             )}
//             <FormInput
//               label="OT Cliente"
//               defaultValue={order.clientWO}
//               disabled={!permissions.edit}
//               changeInput={(e) => handleValue(e, "clientWO")}
//             />
//             {workOrderOptions &&
//               Object.keys(workOrderOptions).map(
//                 (option, index) =>
//                   option !== "supervisor" && (
//                     <FormSelector
//                       key={order[option] || index}
//                       label={option}
//                       defaultValue={order[option]}
//                       options={workOrderOptions[option].sort((a, b) =>
//                         a > b ? 1 : -1
//                       )}
//                       onBlur={(e) => handleValue(e, option)}
//                       disabled={!permissions.edit}
//                     />
//                   )
//               )}
//             <FormInput
//               label="Solicitó"
//               defaultValue={order.solicitor}
//               readOnly={
//                 !!permissions.edit &&
//                 !order.cause &&
//                 !order.issue &&
//                 !order.class
//               }
//               changeInput={(e) => handleValue(e, "solicitor")}
//             />
//             <FormInput
//               label="Teléfono"
//               defaultValue={order.phone}
//               readOnly={
//                 !permissions.edit &&
//                 !order.cause &&
//                 !order.issue &&
//                 !order.class
//               }
//               changeInput={(e) => handleValue(e, "phone")}
//             />
//             {!!otCode && (
//               <FormInput
//                 label="Creación"
//                 key={order.user}
//                 defaultValue={`${getDate(order.regDate)} por ${order.user}`}
//                 readOnly={!permissions.edit}
//               />
//             )}

//             <FormSelector
//               key={device.servicePoints}
//               label="L. Servicio"
//               defaultValue={order.servicePoint}
//               options={device.servicePoints}
//               onSelect={(e) => handleValue(e, "servicePoint")}
//               disabled={!permissions.edit}
//             />
//           </section>
//         </div>

//         <div className="col-md-4 d-flex h-auto p-0">
//           <section className="container h-auto d-flex flex-column justify-content-between p-0">
//             <div className="row d-grid gap-2 m-0">
//               <button className="btn btn-secondary">Observaciones</button>
//             </div>
//             <textarea
//               className="d-flex h-100"
//               style={{ minHeight: "10rem" }}
//               onChange={(e) => handleValue(e, "description")}
//               readOnly={!permissions.create}
//               defaultValue={order.description}
//             />
//             {permissions.edit && (
//               <button
//                 className="btn btn-info"
//                 onClick={() => setEditDesc(true)}
//               >
//                 <i className="fas fa-comment-dots me-1" />
//                 Agregar comentario
//               </button>
//             )}
//             {editDesc && (
//               <AddTextForm
//                 user={userData.user}
//                 select={(text) =>
//                   setOrder({
//                     ...order,
//                     description: order.description + " || " + text,
//                   })
//                 }
//                 close={() => setEditDesc(false)}
//               />
//             )}
//           </section>
//         </div>
//       </div>

//       <section className="row">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col">
//               <b>Intervenciones</b>
//               <InterventionList
//                 interventions={
//                   update.interventions
//                     ? [...interventions, ...update.interventions]
//                     : interventions
//                 }
//                 permissions={permissions}
//                 onDelete={() => {}}
//                 openAdd={() => setIntForm(true)}
//               />
//               {intForm && (
//                 <AddIntervention
//                   select={(data) => createIntervention(data)}
//                   close={() => setIntForm(false)}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="row mt-3 mb-3 me-0 ms-0 p-0">
//         <div className="col-sm-2 bg-secondary text-light text-center rounded">
//           Avance OT
//         </div>
//         <div className="col-sm-10 p-0">
//           <WOProgress
//             key={`${order.completed}` || 1}
//             errorCond={order.interventions && order.interventions.length > 0}
//             defaultValue={`${order.completed || 0}`}
//             min={(orderDetail && orderDetail.completed) || 0}
//             max="99"
//             disabled={!permissions.edit}
//             select={(e) => handleValue(e, "completed")}
//           />
//         </div>
//       </section>

//       {errors && (
//         <section className="row">
//           <div className="col">
//             <div className="alert alert-danger" role="alert">
//               <b>Ooops! Ocurrieron errores:</b>
//               <ul>
//                 {errors.map((e, index) => (
//                   <li key={index}>{e}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </section>
//       )}

//       {!permissions.woData && (
//         <section className="row">
//           <div className="col d-flex justify-content-center">
//             {(!order.completed || order.completed < 100 || permissions.admin) &&
//               (permissions.edit || permissions.admin) && (
//                 <button
//                   className="btn btn-info m-1 pe-0 ps-0"
//                   style={{ width: "10rem" }}
//                   onClick={checkErrors}
//                 >
//                   <i className="fas fa-save" /> Guardar
//                 </button>
//               )}
//             {(!order.completed || order.completed < 100) &&
//               permissions.edit &&
//               !permissions.admin && (
//                 <button
//                   className="btn btn-success m-1 pe-0 ps-0"
//                   style={{ width: "10rem" }}
//                   onClick={askClose}
//                 >
//                   <i className="fas fa-lock" /> Solicitar Cierre
//                 </button>
//               )}
//             {permissions.admin && order.status !== "Cerrada" && (
//               <button
//                 className="btn btn-success m-1 pe-0 ps-0"
//                 style={{ width: "10rem" }}
//                 onClick={adminCloseOrder}
//               >
//                 <i className="fas fa-lock" /> Cerrar OT
//               </button>
//             )}
//             {toClose === 100 && (
//               <WarningErrors
//                 warnings={["¿Llevar avance al 100% y solicitar cierre?"]}
//                 proceed={handleClose}
//                 close={() => setClose(false)}
//               />
//             )}
//             {closeOrder === 100 && (
//               <WarningErrors
//                 warnings={["¿Confirma que desea cerrar la Orden de Trabajo?"]}
//                 proceed={() => handleClose(true)}
//                 close={() => setCloseOrder(false)}
//               />
//             )}
//             {order.closed && !permissions.admin && (
//               <div>Orden de trabajo cerrada, no puede modificarse.</div>
//             )}
//           </div>
//         </section>
//       )}
//       {orderResult.error && (
//         <ErrorModal
//           message={`La orden de trabajo no se pudo guardar. Error: ${orderResult.error}`}
//           close={() => dispatch(resetOrderResult())}
//         />
//       )}
//       {orderResult.success && (
//         <SuccessModal
//           message={`La orden de trabajo N° ${orderResult.success} fue guardada exitosamente.`}
//           link={`/ots/detail/${orderResult.success}`}
//           close={closeSuccess}
//         />
//       )}
//     </div>
//   );
// }
