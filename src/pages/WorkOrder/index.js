import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deviceActions, planActions } from "../../actions/StoreActions";
import {
  getWOOptions,
  newIntervention,
  newWorkOrder,
  resetOrderResult,
  searchWO,
  updateOrder,
} from "../../actions/workOrderActions";

import InterventionList from "../../components/lists/InterventionList";
import WOProgress from "../../components/progress/WOProgresBar";
import { ErrorModal, SuccessModal } from "../../components/warnings";
import WarningErrors from "../../components/warnings/WarningErrors";
import AddTextForm from "../../components/forms/AddText";
import { FormInput, FormSelector } from "../../components/forms/FormInput";
import AddIntervention from "../../components/forms/InterventionForm";
import DeviceList from "../../components/lists/DeviceList";

function buildDevice(device) {
  //order detail
  if (!device) return {};
  if (device.power) {
    device.powerAndType = `${device.type} (${
      device.power + " " + device.unit
    }) ${device.refrigerant}`;
  }
  return device;
}

export default function WorkOrder() {
  //global variables
  const { otCode } = useParams();
  const { userData } = useSelector((state) => state.people);
  const { selectedDevice, deviceResult } = useSelector(
    (state) => state.devices
  );
  const { plan, selectedTask } = useSelector((state) => state.plan);
  const { workOrderOptions, orderDetail, orderResult } = useSelector(
    (state) => state.workOrder
  );

  //openers
  const [selectDate, setSelectDate] = useState(false);
  const [pickDevice, setPickDevice] = useState(false);
  const [intForm, setIntForm] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [errors, setErrors] = useState(false);
  const [warnings, setWarnings] = useState(false);
  const [toClose, setClose] = useState(false);
  const [closeOrder, setCloseOrder] = useState("");

  //local data states
  const [planDates, setPlanDates] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [device, setDevice] = useState({});
  const [deviceCode, setDeviceCode] = useState("");
  const [order, setOrder] = useState({});
  const [update, setUpdate] = useState({});
  const [supervisor, setSupervisor] = useState(undefined);

  const [permissions, setPermissions] = useState({
    create: true,
    edit: true,
    admin: false,
  });
  const dispatch = useDispatch();

  useEffect(
    () =>
      order.taskDate &&
      planDates[0] &&
      dispatch(
        planActions.selectTask(
          planDates.find((date) => date.id === order.taskDate)
        )
      ),
    [order, planDates, dispatch]
  );

  useEffect(
    () =>
      setPlanDates(
        plan
          .filter((task) => {
            const today = new Date();
            return (
              task.code === device.code &&
              new Date(task.date) <= today.setDate(today.getDate() + 7)
            );
          })
          .map((task) => ({
            ...task,
            localDate: new Date(task.date).toLocaleDateString(),
          }))
      ),
    [plan, device]
  );

  useEffect(() => {
    if (!order.code) return;
    setPermissions({
      create: !order.code || userData.access === "Admin",
      edit:
        !order.code ||
        (order.code &&
          (!order.completed || order.completed < 100) &&
          (userData.id === order.userId || supervisor === userData.id)) ||
        userData.access === "Admin",
      admin: userData.access === "Admin",
    });
  }, [order, userData, supervisor]);

  useEffect(() => {
    if (!selectedTask) return;
    setSelectDate(!!selectedTask.date);
    if (!supervisor) setSupervisor(selectedTask.supervisor);
  }, [selectedTask, supervisor]);

  useEffect(() => otCode && dispatch(searchWO(otCode)), [otCode, dispatch]);

  useEffect(() => {
    setOrder(orderDetail);
    if (!orderDetail.code) return;
    const { device } = orderDetail;
    setDevice(device ? buildDevice(device) : {});
    setDeviceCode(device.code);
    setSupervisor(orderDetail.supervisor);
    // dispatch(planActions.selectTask(plan.find(date=>date.id === orderDetail.taskDate)))
    setOrder(orderDetail);
    setInterventions(orderDetail.interventions);
  }, [orderDetail, dispatch, plan]);

  useEffect(() => {
    if (!selectedDevice.code) return;
    if (
      !otCode &&
      selectedDevice.servicePoints &&
      selectedDevice.servicePoints.length === 1
    ) {
      setOrder({ servicePoint: selectedDevice.servicePoints[0] });
    }
    setDeviceCode(selectedDevice.code || "");
    setDevice(buildDevice(selectedDevice));
  }, [selectedDevice, dispatch, otCode]);

  useEffect(() => dispatch(getWOOptions()), [dispatch]);

  function searchCode(e) {
    e.preventDefault();
    dispatch(deviceActions.getDetail(deviceCode));
  }

  function handleDevCode(e) {
    e.preventDefault();
    const { value } = e.target;
    value && setDeviceCode(value);
    setDevice({});
    // if(!value)dispatch(deviceActions.resetDevice())
  }

  function handleValue(e, item) {
    e.preventDefault();
    let object = otCode ? { ...update } : { ...order };
    const { value } = e.target;
    if (!value) {
      otCode ? (object[item] = null) : delete object[item];
    } else {
      object[item] = value;
    }
    otCode ? setUpdate(object) : setOrder(object);
  }

  function checkErrors() {
    const errors = [];
    const warnings = [];
    // if (!supervisor && selectedTask) setSupervisor(selectedTask.supervisor)

    if (!deviceCode) errors.push("Debe seleccionar un equipo");
    if (!supervisor) errors.push("Debe seleccionar un supervisor");
    if (!order.clientWO)
      warnings.push("¿Seguro que desea guardar la orden sin una OT Cliente?");
    if (!order.class) errors.push("Debe indicar la clase de la orden");
    if (!order.issue) errors.push("Debe indicar el problema");
    if (!order.cause) errors.push("Debe indicar la causa");
    if (!order.solicitor) errors.push("Debe indicar quién solicitó la orden");
    if (!order.phone)
      warnings.push(
        "¿Seguro que desea guardar la orden sin un teléfono asociado?"
      );
    if (!order.servicePoint)
      warnings.push(
        "¿Seguro que desea guardar la orden sin un lugar de servicio asociado?"
      );
    if (!order.description) errors.push("Debe asignar una descripción");
    if (!interventions || !interventions[0])
      warnings.push("¿Seguro que desea guardar la orden sin intervenciones?");

    if (
      (!orderDetail && (!order.completed || order.completed === 0)) ||
      (!!orderDetail &&
        (!update.completed || orderDetail.completed === update.completed))
    )
      warnings.push(
        "¿Seguro que desea guardar la orden sin modificar el avance?"
      );

    if (errors[0]) {
      setErrors(errors);
    } else {
      setErrors(false);
      if (warnings[0]) {
        setWarnings(warnings);
      } else {
        handleSave();
      }
    }
  }

  function handleAdvancedSearch(e) {
    e.preventDefault();
    setPickDevice(true);
  }

  function askClose(e) {
    if (e) e.preventDefault();
    setClose(100);
    checkErrors();
  }
  function handleClose(e) {
    e && e.preventDefault && e.preventDefault();
    setClose(true);
    if (!!closeOrder) setCloseOrder(true);
    const newOrder = { ...order, completed: 100 };
    if (closeOrder) newOrder.status = "Cerrada";
    setOrder(newOrder);
    checkErrors();
  }
  function adminCloseOrder(e) {
    if (e) {
      e.preventDefault();
    }
    setCloseOrder(100);
  }

  function handleSave(e) {
    //dipatch update taskDate if otCode, add or remove if not
    if (e) e.preventDefault();
    if (otCode) {
      dispatch(
        updateOrder(otCode, {
          ...update,
          supervisor,
          completed:
            userData.access === "Admin"
              ? update.completed || order.completed
              : toClose || closeOrder
              ? 100
              : order.completed,
          status: closeOrder ? "Cerrada" : order.status || "Abierta",
          userId: userData.id,
        })
      );
      dispatch(planActions.dateOrder({ order: otCode, date: update.taskDate }));
    } else {
      const sendOrder = {
        ...order,
        user: userData.user,
        interventions,
        device: deviceCode,
        supervisor,
        completed: toClose ? 100 : order.completed,
        userId: userData.id,
      };
      dispatch(newWorkOrder(sendOrder));
    }
  }

  function selectTaskDate(e) {
    e.preventDefault();
    const id = e.target.value;
    otCode
      ? setUpdate({ ...update, taskDate: id })
      : setOrder({ ...order, taskDate: id });
  }

  function createIntervention(data) {
    otCode
      ? dispatch(newIntervention(otCode, data))
      : setInterventions([...interventions, data]);
  }

  function getDate(date) {
    const newDate = new Date(date);
    return `${newDate.toLocaleDateString()} ${newDate.getHours()}:${newDate.getMinutes()}`;
  }

  function closeSuccess() {
    setEditDesc(false);
    setInterventions([]);
    setOrder({});
    dispatch(resetOrderResult());
  }

  return (
    <div className="container-fluid h-100 d-flex flex-column justify-content-between">
      {warnings && (
        <WarningErrors
          warnings={warnings}
          close={() => setWarnings(false)}
          proceed={() => handleSave()}
        />
      )}
      <div className="row m-1">
        {otCode && (
          <div className="col-sm-6 rounded-3 flex">
            <FormInput label="N° OT" defaultValue={otCode} readOnly={true} />
            <FormInput
              label="Estado"
              defaultValue={orderDetail.status}
              readOnly={true}
            />
          </div>
        )}

        {(planDates[0] || order.taskDate) && (
          <div
            className={`col-sm-6 ${
              selectDate || order.taskDate ? "bg-nav" : "bg-grey"
            } flex align-items-center p-1`}
          >
            <div className="col-1 ps-0 pe-0 flex align-items-center">
              <input
                className="form-check"
                type="checkBox"
                style={{ margin: ".5rem", transform: "scale(1.5)" }}
                defaultChecked={
                  (selectedTask && selectedTask.date) || order.taskDate
                }
                onChange={(e) => setSelectDate(e.target.checked)}
                disabled={!permissions.edit}
              />
            </div>
            <div className="col-5 ps-0 pe-0 text-light flex align-items-center">
              <label>{`${
                selectDate ? "TAREA DE PLAN" : "¿TAREA DE PLAN?"
              }`}</label>
            </div>
            {(selectDate || selectedTask.id) && (
              <div className="col-6  ps-0 pe-0">
                <FormSelector
                  key={selectedTask}
                  label="Fecha Plan"
                  defaultValue={selectedTask.id ? selectedTask.id : undefined}
                  options={planDates}
                  valueField="id"
                  captionField="localDate"
                  disabled={!permissions.edit}
                  onBlur={selectTaskDate}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="row">
        <div className="col-md-4">
          <section className="container-fluid p-0 mt-1 mb-1">
            {pickDevice && (
              <div className="modal">
                <div
                  className="container bg-light m-2"
                  style={{ height: "90%", overflowY: "auto" }}
                >
                  <div className="row">
                    <div className="col d-flex justify-content-end">
                      <button
                        className="btn btn-close"
                        onClick={() => setPickDevice(false)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <DeviceList close={() => setPickDevice(false)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <button
                  className="btn btn-secondary w-100"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <b>
                    {device.code
                      ? `[${device.code}] ${device.name}`
                      : "Datos del Equipo"}
                  </b>
                </button>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="container p-0">
                    <form className="row" onSubmit={searchCode}>
                      <div className="col d-flex">
                        <FormInput
                          label="Cod.Eq."
                          defaultValue={deviceCode}
                          placeholder={"código completo"}
                          readOnly={!permissions.create}
                          changeInput={handleDevCode}
                        />
                        {!device.code && (
                          <button
                            type="submit"
                            className="btn btn-info"
                            disabled={!deviceCode && !permissions.create}
                          >
                            <i className="fas fa-search" />
                          </button>
                        )}
                        {!device.code && (
                          <button
                            className="btn btn-outline-info"
                            style={{ minWidth: "fit-content" }}
                            disabled={!deviceCode && !permissions.create}
                            onClick={handleAdvancedSearch}
                          >
                            ABRIR LISTA
                          </button>
                        )}
                        {device.code && (
                          <button
                            className="btn btn-danger"
                            disabled={!permissions.create}
                            onClick={handleDevCode}
                          >
                            <i className="fas fa-backspace" />
                          </button>
                        )}
                        {deviceResult.error && (
                          <ErrorModal
                            message={`Equipo código '${deviceCode}' no encontrado`}
                            close={() => dispatch(deviceActions.resetResult())}
                          />
                        )}
                      </div>
                    </form>
                    <FormInput
                      label="Equipo"
                      defaultValue={device.name}
                      readOnly={true}
                    />
                    <div className="section">
                      <FormInput
                        label="Planta"
                        defaultValue={device.plant}
                        readOnly={true}
                      />
                      <FormInput
                        label="Area"
                        defaultValue={device.area}
                        readOnly={true}
                      />
                    </div>
                    <FormInput
                      label="Linea"
                      defaultValue={device.line}
                      readOnly={true}
                    />
                    <FormInput
                      label="Tipo"
                      defaultValue={device.powerAndType}
                      readOnly={true}
                    />
                    <div className="section">
                      <FormInput
                        label="Categoría"
                        defaultValue={device.category}
                        readOnly={true}
                      />
                      <FormInput
                        label="Servicio"
                        defaultValue={device.service}
                        readOnly={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="col-md-4 h-auto d-flex m-0">
          <section className="container h-auto d-flex flex-column justify-content-between p-0">
            <div className="row d-grid gap-2 m-0">
              <button className="btn btn-secondary mt-1">
                Detalle de la orden de trabajo
              </button>
            </div>
            {(workOrderOptions.supervisor || order.supervisor) && (
              <FormSelector
                key={supervisor}
                label="Supervisor"
                defaultValue={supervisor}
                options={workOrderOptions.supervisor}
                valueField="id"
                captionField="name"
                onBlur={(e) => setSupervisor(e.target.value)}
                disabled={!permissions.edit}
              />
            )}
            <FormInput
              label="OT Cliente"
              defaultValue={order.clientWO}
              disabled={!permissions.edit}
              changeInput={(e) => handleValue(e, "clientWO")}
            />
            {workOrderOptions &&
              Object.keys(workOrderOptions).map(
                (option, index) =>
                  option !== "supervisor" && (
                    <FormSelector
                      key={order[option] || index}
                      label={option}
                      defaultValue={order[option]}
                      options={workOrderOptions[option].sort((a, b) =>
                        a > b ? 1 : -1
                      )}
                      onBlur={(e) => handleValue(e, option)}
                      disabled={!permissions.edit}
                    />
                  )
              )}
            <FormInput
              label="Solicitó"
              defaultValue={order.solicitor}
              readOnly={
                !!permissions.edit &&
                !order.cause &&
                !order.issue &&
                !order.class
              }
              changeInput={(e) => handleValue(e, "solicitor")}
            />
            <FormInput
              label="Teléfono"
              defaultValue={order.phone}
              readOnly={
                !permissions.edit &&
                !order.cause &&
                !order.issue &&
                !order.class
              }
              changeInput={(e) => handleValue(e, "phone")}
            />
            {!!otCode && (
              <FormInput
                label="Creación"
                key={order.user}
                defaultValue={`${getDate(order.regDate)} por ${order.user}`}
                readOnly={!permissions.edit}
              />
            )}

            <FormSelector
              key={device.servicePoints}
              label="L. Servicio"
              defaultValue={order.servicePoint}
              options={device.servicePoints}
              onSelect={(e) => handleValue(e, "servicePoint")}
              disabled={!permissions.edit}
            />
          </section>
        </div>

        <div className="col-md-4 d-flex h-auto p-0">
          <section className="container h-auto d-flex flex-column justify-content-between p-0">
            <div className="row d-grid gap-2 m-0">
              <button className="btn btn-secondary">Observaciones</button>
            </div>
            <textarea
              className="d-flex h-100"
              style={{ minHeight: "10rem" }}
              onChange={(e) => handleValue(e, "description")}
              readOnly={!permissions.create}
              defaultValue={order.description}
            />
            {permissions.edit && (
              <button
                className="btn btn-info"
                onClick={() => setEditDesc(true)}
              >
                <i className="fas fa-comment-dots me-1" />
                Agregar comentario
              </button>
            )}
            {editDesc && (
              <AddTextForm
                user={userData.user}
                select={(text) =>
                  setOrder({
                    ...order,
                    description: order.description + " || " + text,
                  })
                }
                close={() => setEditDesc(false)}
              />
            )}
          </section>
        </div>
      </div>

      <section className="row">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <b>Intervenciones</b>
              <InterventionList
                interventions={
                  update.interventions
                    ? [...interventions, ...update.interventions]
                    : interventions
                }
                permissions={permissions}
                onDelete={() => {}}
                openAdd={() => setIntForm(true)}
              />
              {intForm && (
                <AddIntervention
                  select={(data) => createIntervention(data)}
                  close={() => setIntForm(false)}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="row mt-3 mb-3 me-0 ms-0 p-0">
        <div className="col-sm-2 bg-secondary text-light text-center rounded">
          Avance OT
        </div>
        <div className="col-sm-10 p-0">
          <WOProgress
            key={`${order.completed}` || 1}
            errorCond={order.interventions && order.interventions.length > 0}
            defaultValue={`${order.completed || 0}`}
            min={(orderDetail && orderDetail.completed) || 0}
            max="99"
            disabled={!permissions.edit}
            select={(e) => handleValue(e, "completed")}
          />
        </div>
      </section>

      {errors && (
        <section className="row">
          <div className="col">
            <div className="alert alert-danger" role="alert">
              <b>Ooops! Ocurrieron errores:</b>
              <ul>
                {errors.map((e, index) => (
                  <li key={index}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {!permissions.woData && (
        <section className="row">
          <div className="col d-flex justify-content-center">
            {(!order.completed || order.completed < 100 || permissions.admin) &&
              (permissions.edit || permissions.admin) && (
                <button
                  className="btn btn-info m-1 pe-0 ps-0"
                  style={{ width: "10rem" }}
                  onClick={checkErrors}
                >
                  <i className="fas fa-save" /> Guardar
                </button>
              )}
            {(!order.completed || order.completed < 100) &&
              permissions.edit &&
              !permissions.admin && (
                <button
                  className="btn btn-success m-1 pe-0 ps-0"
                  style={{ width: "10rem" }}
                  onClick={askClose}
                >
                  <i className="fas fa-lock" /> Solicitar Cierre
                </button>
              )}
            {permissions.admin && order.status !== "Cerrada" && (
              <button
                className="btn btn-success m-1 pe-0 ps-0"
                style={{ width: "10rem" }}
                onClick={adminCloseOrder}
              >
                <i className="fas fa-lock" /> Cerrar OT
              </button>
            )}
            {toClose === 100 && (
              <WarningErrors
                warnings={["¿Llevar avance al 100% y solicitar cierre?"]}
                proceed={handleClose}
                close={() => setClose(false)}
              />
            )}
            {closeOrder === 100 && (
              <WarningErrors
                warnings={["¿Confirma que desea cerrar la Orden de Trabajo?"]}
                proceed={() => handleClose(true)}
                close={() => setCloseOrder(false)}
              />
            )}
            {order.closed && !permissions.admin && (
              <div>Orden de trabajo cerrada, no puede modificarse.</div>
            )}
          </div>
        </section>
      )}
      {orderResult.error && (
        <ErrorModal
          message={`La orden de trabajo no se pudo guardar. Error: ${orderResult.error}`}
          close={() => dispatch(resetOrderResult())}
        />
      )}
      {orderResult.success && (
        <SuccessModal
          message={`La orden de trabajo N° ${orderResult.success} fue guardada exitosamente.`}
          link={`/ots/detail/${orderResult.success}`}
          close={closeSuccess}
        />
      )}
    </div>
  );
}
