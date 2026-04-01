import {
  faBookOpen,
  faExchange,
  faSearch,
  faSyncAlt,
  faTable,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ModalBase from "../../../Modals/ModalBase";
import {
  deviceActions,
  optionActions,
  workOrderActions,
} from "../../../actions/StoreActions";
import { useGetPlantWorkers } from "../../../hooks/users.hooks";
import DeviceList from "../../Devices/DeviceList";
import { ErrorModal, SuccessModal } from "../../warnings";
import {
  DateField,
  NumberField,
  OrderField,
  TextAreaField,
} from "../OrderFields";
import WorkOrderCard from "../WorkOrderCard";
import AddSubtaskModal from "./AddSubtaskModal";
import SubtasksSection from "./SubtasksSection";
import TemplateModal from "./TemplateModal";
import { mapToFormSubtask, toBackendSubtask } from "./helpers";

// ─── constants ────────────────────────────────────────────────────────────────

const EMPTY_ORDER = {
  // General
  responsible: "",
  description: "",
  supervisor: "",

  registerDate: "",
};

const EMPTY_TECH = {
  generatedBy: "",
  estimatedDuration: "",
};

const EMPTY_PLANNED = {
  // Time / Planning
  plannedDate: "",
  eventDate: "",
  priority: "",
  startDate: "",
  activator: "",
  endDate: "",
  worktime: "",
  requester: "",
  classification: "",
  originDate: "",
  scheduledDate: "",
  approvalDate: "",
};

const EMPTY_DIAGNOSTIC = {
  // Failure / Diagnostics
  failureType: "",
  failureCause: "",
  method: "",
  severity: "",
  damageType: "",
  diagnostics: "",
  finalStatus: "",
  cause: "",
  assetsDowntime: "",
};

// const FINAL_STATUS = [
//   {
//     key: "ok",
//     label: "OK",
//     active: "btn-success",
//     inactive: "btn-ghost border-base-300",
//   },
//   {
//     key: "alert",
//     label: "Alerta",
//     active: "btn-warning",
//     inactive: "btn-ghost border-base-300",
//   },
//   {
//     key: "fail",
//     label: "Falla",
//     active: "btn-error",
//     inactive: "btn-ghost border-base-300",
//   },
// ];

// ─── component ────────────────────────────────────────────────────────────────

export default function TechOrderForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderCode } = useParams();
  const { list: optionList } = useSelector((state) => state.options);
  const { orderDetail, orderResult } = useSelector((s) => s.workOrder);
  const { workersList, supervisors } = useSelector((s) => s.people);
  const { selectedDevice } = useSelector((s) => s.devices);
  const [deviceCode, setDeviceCode] = useState("");

  // const [device, setDevice] = useState(EMPTY_DEVICE);
  const [deviceTable, setDeviceTable] = useState(false);
  const [templateModal, setTemplateModal] = useState(false);
  const [addSubtaskModal, setAddSubtaskModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  // const [form, setForm] = useState(EMPTY_FORM);
  const [order, setOrder] = useState(EMPTY_ORDER);
  const [tech, setTech] = useState(EMPTY_TECH);
  const [planned, setPlanned] = useState(EMPTY_PLANNED);
  const [diagnostic, setDiagnostic] = useState(EMPTY_DIAGNOSTIC);
  const [saving, setSaving] = useState(false);
  useGetPlantWorkers();

  useEffect(() => {
    dispatch(optionActions.getList());
  }, [dispatch]);

  const options = (optionList ?? []).reduce((acc, { type, _id, label }) => {
    (acc[type] ??= []).push({ id: _id, name: label });
    return acc;
  }, {});

  // ── unmount cleanup ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => dispatch(workOrderActions.resetDetail());
  }, [dispatch]);

  // ── load existing order ───────────────────────────────────────────────────
  useEffect(() => {
    if (!orderCode || !!orderDetail._id) return;
    dispatch(workOrderActions.searchWO(orderCode));
  }, [orderCode, orderDetail, dispatch]);

  useEffect(() => {
    if (!orderDetail?.code) return;
    dispatch(deviceActions.getDetail(orderDetail.device.code));
    const {
      tech,
      device: _d,
      responsible,
      registration,
      ...restOrder
    } = orderDetail;
    const registerDate = registration?.date
      ? registration.date.split("T")[0]
      : "";
    const { planned, diagnostics, ...restTech } = tech || {};
    if (planned) {
      const { scheduledDate, startDate, endDate } = planned;
      const scheduled = scheduledDate ? scheduledDate.split("T")[0] : "";
      const start = startDate ? startDate.split("T")[0] : "";
      const end = endDate ? endDate.split("T")[0] : "";
      setPlanned({
        ...planned,
        scheduledDate: scheduled,
        startDate: start,
        endDate: end,
      });
    }
    if (diagnostics) setDiagnostic(diagnostics);
    if (restTech) setTech(restTech);
    setOrder((prev) => ({
      ...prev,
      registerDate,
      ...restOrder,
      responsible: responsible?._id || "",
    }));
    if (tech?.subtasks?.length) {
      setSubtasks(
        orderDetail.tech.subtasks
          .map(({ subtask, ...rest }) => ({ ...rest, ...subtask }))
          .map(mapToFormSubtask),
      );
    }
    if (tech?.templateId) setTemplateId(tech.templateId);
  }, [orderDetail, dispatch]);

  // ── form change handler ───────────────────────────────────────────────────
  function handleDiagnosticChange(e) {
    const { name, value } = e.target || e;
    setDiagnostic((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value),
    }));
  }
  function handleOrderChange(e) {
    const { name, value } = e.target || e;
    setOrder((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value),
    }));
  }
  function handlePlannedChange(e) {
    const { name, value } = e.target || e;
    setPlanned((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value),
    }));
  }
  function handleTechChange(e) {
    const { name, value } = e.target || e;
    setTech((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value),
    }));
  }

  // ── device handlers ───────────────────────────────────────────────────────
  function handleSearch(e) {
    e.preventDefault();
    if (deviceCode) dispatch(deviceActions.getDetail(deviceCode, true));
  }

  function handleResetDevice(e) {
    e.preventDefault();
    dispatch(deviceActions.resetDevice());
  }

  // ── template handlers ─────────────────────────────────────────────────────
  function applyTemplate(template) {
    setTemplateId(template._id);
    setTemplateName(template.name);
    if (template.subtasks?.length) {
      setSubtasks(template.subtasks.map(mapToFormSubtask));
    }
  }

  // ── subtask handler ───────────────────────────────────────────────────────
  function handleAddSubtask(subtask) {
    setSubtasks((prev) => [
      mapToFormSubtask(subtask, 0),
      ...prev.map((s, i) => ({ ...s, order: i + 1 })),
    ]);
  }

  // ── save ──────────────────────────────────────────────────────────────────
  function handleSave(e) {
    e?.preventDefault();
    setSaving(true);
    const { _id, code, ...restOrder } = order;
    const payload = {
      type: "tech",
      device: selectedDevice._id,
      ...restOrder,
      tech: {
        ...tech,
        generatedBy: tech.generatedBy?._id || "",
        planned,
        diagnostics: { ...diagnostic },

        ...(templateId && { templateId }),
        subtasks: subtasks.map(toBackendSubtask),
      },
    };
    if (orderCode) {
      const { generatedBy, ...restTech } = payload.tech;
      payload.tech = restTech;
      dispatch(workOrderActions.updateTechOrder(orderDetail._id, payload));
    } else {
      dispatch(workOrderActions.newWorkOrder(payload));
    }
  }

  function handleSuccess() {
    dispatch(workOrderActions.resetOrderResult());
    navigate("/admin/ordenes-tecnicas");
  }

  useEffect(() => {
    if (orderResult) setSaving(false);
  }, [orderResult]);

  const canSave = !!selectedDevice._id && !saving;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="page-container">
      {orderResult?.error && (
        <ErrorModal
          message={`Error al guardar: ${orderResult.error}`}
          close={() => dispatch(workOrderActions.resetOrderResult())}
        />
      )}
      {orderResult?.success && (
        <SuccessModal
          open={true}
          message={`Orden técnica N° ${orderResult.success} guardada exitosamente.`}
          link={orderCode ? null : `/ordenes-tecnicas/${orderResult.success}`}
          close={handleSuccess}
        />
      )}
      {deviceTable && (
        <ModalBase
          title="Lista de equipos"
          open={true}
          onClose={() => setDeviceTable(false)}
          className="xl:max-w-[90%]"
        >
          <div className="flex flex-col overflow-y-auto h-[90%]">
            <DeviceList close={() => setDeviceTable(false)} hideLinks />
          </div>
        </ModalBase>
      )}
      {addSubtaskModal && (
        <AddSubtaskModal
          open={true}
          onClose={() => setAddSubtaskModal(false)}
          onAdd={handleAddSubtask}
          currentIds={subtasks.map((s) => s._id)}
        />
      )}
      {templateModal && (
        <TemplateModal
          open={true}
          onClose={() => setTemplateModal(false)}
          onSelect={applyTemplate}
          onCreated={applyTemplate}
        />
      )}

      <div className="flex flex-col min-h-0 flex-grow">
        <div className="page-title">
          {orderCode ? `Orden Técnica N° ${orderCode}` : "Nueva Orden Técnica"}
        </div>

        <div className="flex flex-col gap-4 flex-grow md:overflow-y-auto md:min-h-0 mb-4">
          {/* ── 1. EQUIPO ── */}
          <WorkOrderCard title="EQUIPO">
            <div className="w-full flex flex-col md:flex-row md:items-center gap-4">
              <div className="join my-1 flex-grow">
                {!selectedDevice.name ? (
                  <>
                    <input
                      className="flex flex-grow input-sm join-item bg-base-100 border-2 border-info"
                      type="text"
                      placeholder="Código de equipo"
                      value={deviceCode}
                      onChange={(e) => setDeviceCode(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-info join-item"
                      style={{ zIndex: 0 }}
                      onClick={handleSearch}
                      disabled={!deviceCode.trim()}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                    <button
                      className="btn btn-sm btn-primary join-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setDeviceTable(true);
                      }}
                    >
                      LISTA <FontAwesomeIcon icon={faTable} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center flex-grow px-2 join-item bg-base-100 border-2 border-primary rounded-l-md overflow-hidden">
                      <p>
                        <b>[{selectedDevice.code}]</b> {selectedDevice.name}
                      </p>
                    </div>
                    <button
                      className="btn btn-sm btn-error join-item"
                      title="Cambiar equipo"
                      onClick={handleResetDevice}
                    >
                      <FontAwesomeIcon icon={faSyncAlt} />
                    </button>
                  </>
                )}
              </div>
              <OrderField
                field="Centro costo"
                name="costCenter"
                className={selectedDevice.name ? "" : "opacity-0"}
                disabled={!selectedDevice.name}
                value={selectedDevice.costCenter}
                // onInput={handleChange}
                placeholder="CC-XXX"
              />
            </div>
            {selectedDevice.name && (
              <div className="flex flex-col gap-4">
                <div className="text-sm opacity-60 pt-1 space-y-0.5">
                  <p>
                    <b>Ubicación:</b>{" "}
                    {selectedDevice.location ||
                      (selectedDevice.plant &&
                      selectedDevice.area &&
                      selectedDevice.line
                        ? `${selectedDevice.plant} > ${selectedDevice.area} > ${selectedDevice.line}`
                        : "")}
                  </p>
                  <p>
                    <b>Tipo:</b> {selectedDevice.type}
                  </p>
                  <p>
                    <b>Categoría:</b> {selectedDevice.category}
                  </p>
                </div>
              </div>
            )}
          </WorkOrderCard>

          {/* ── 2. INFO GENERAL ── */}
          <WorkOrderCard title="INFO GENERAL">
            <div className="flex flex-col md:grid grid-cols-3 gap-1 mt-1">
              {tech.generatedBy && (
                <OrderField
                  field="Generada por"
                  name="generatedBy"
                  displayEmpty
                  value={tech.generatedBy?.name}
                  readOnly
                />
              )}
              <OrderField
                field="Responsable"
                name="responsible"
                options={
                  workersList?.map((w) => ({ id: w._id, name: w.name })) || []
                }
                displayEmpty
                value={order.responsible}
                onInput={handleOrderChange}
              />
              <OrderField
                field="Supervisor"
                name="supervisor"
                options={
                  supervisors?.map((w) => ({ id: w._id, name: w.name })) || []
                }
                displayEmpty
                value={order.supervisor._id || order.supervisor}
                onInput={handleOrderChange}
              />
              <NumberField
                field="Duración estimada (hs)"
                name="estimatedDuration"
                value={tech.estimatedDuration}
                onInput={handleTechChange}
                placeholder="Horas"
              />
              <DateField
                field="Fecha"
                name="registerDate"
                value={order.registerDate}
                onInput={handleOrderChange}
              />
            </div>
          </WorkOrderCard>

          {/* ── 3. PLANIFICACIÓN ── */}
          <WorkOrderCard title="PLANIFICACIÓN">
            <div className="flex flex-col md:grid grid-cols-3 gap-1 mt-1">
              <TextAreaField
                field="Descripción"
                className="w-full md:col-span-3"
                name="description"
                value={order.description}
                onInput={handleOrderChange}
                placeholder="Descripción del trabajo..."
              />
              <DateField
                field="Fecha evento"
                name="scheduledDate"
                value={planned.scheduledDate}
                onInput={handlePlannedChange}
              />
              <OrderField
                field="Prioridad"
                name="priority"
                value={planned.priority}
                options={options.priority || []}
                displayEmpty
                onInput={handlePlannedChange}
              />
              <OrderField
                field="Activador"
                name="activator"
                value={planned.activator}
                options={options.activator || []}
                displayEmpty
                onInput={handlePlannedChange}
              />
              <OrderField
                field="Clasificación"
                name="classification"
                value={planned.classification}
                options={options.classification || []}
                displayEmpty
                onInput={handlePlannedChange}
                placeholder="Tipo de trabajo..."
              />
              <DateField
                field="Inicio"
                name="startDate"
                value={planned.startDate}
                onInput={handlePlannedChange}
              />
              <DateField
                field="Fin"
                name="endDate"
                value={planned.endDate}
                onInput={handlePlannedChange}
              />
              <NumberField
                field="Tiempo trabajo (h)"
                name="worktime"
                value={planned.worktime}
                min={0}
                onInput={handlePlannedChange}
                placeholder="Horas"
              />
              <NumberField
                field="Tiempo parada (h)"
                name="downtime"
                value={planned.downtime}
                min={0}
                onInput={handlePlannedChange}
                placeholder="Horas"
              />
              <OrderField
                field="Solicitante"
                name="requester"
                value={planned.requester || ""}
                onInput={handlePlannedChange}
                placeholder="Quien solicita..."
              />
            </div>
          </WorkOrderCard>

          {/* ── 4. SUBTAREAS ── */}
          <div className="md:col-span-2">
            <WorkOrderCard
              title={
                templateName ? (
                  <>
                    Tarea: <b>{templateName}</b>
                    <span className="font-normal">
                      {" "}
                      - {subtasks.length} subtarea(s)
                    </span>
                  </>
                ) : (
                  "SUBTAREAS"
                )
              }
              headerButton={
                <div className="flex gap-4 ml-auto">
                  <button
                    type="button"
                    className={`btn btn-sm btn-outline ${templateName ? "btn-primary" : "btn-error"}`}
                    onClick={() => setTemplateModal(true)}
                  >
                    <FontAwesomeIcon
                      icon={templateName ? faExchange : faBookOpen}
                    />{" "}
                    {templateName ? "Cambiar" : "Elegir"} tarea
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm btn-outline ${templateName ? "btn-error" : "btn-primary"}`}
                    onClick={() => setAddSubtaskModal(true)}
                  >
                    <FontAwesomeIcon icon={faTools} /> Agregar subtarea
                  </button>
                </div>
              }
            >
              {subtasks.length === 0 ? (
                <p className="text-sm opacity-40 py-6 text-center">
                  Seleccioná un template o cargá subtareas manualmente.
                </p>
              ) : (
                <div className="mt-2">
                  <SubtasksSection
                    subtasks={subtasks}
                    setSubtasks={setSubtasks}
                  />
                </div>
              )}
            </WorkOrderCard>
          </div>

          {/* ── 5. DIAGNÓSTICO ── */}
          <WorkOrderCard title="DIAGNÓSTICO / RESULTADO">
            <div className="flex flex-col lg:grid grid-cols-2 gap-1 mt-1">
              <TextAreaField
                field="Diagnóstico"
                className="w-full lg:col-span-2"
                name="diagnostics"
                value={diagnostic.diagnostics}
                onInput={handleDiagnosticChange}
                placeholder="Observaciones diagnósticas..."
              />

              <OrderField
                field="Tipo falla"
                name="failureType"
                value={diagnostic.failureType}
                options={options.failureType || []}
                displayEmpty
                onInput={handleDiagnosticChange}
                placeholder="Descripción del fallo..."
              />
              <OrderField
                field="Causa falla"
                name="cause"
                value={diagnostic.cause}
                options={options.cause || []}
                displayEmpty
                onInput={handleDiagnosticChange}
                placeholder="Causa raíz..."
              />
              <OrderField
                field="Detección"
                name="method"
                value={diagnostic.method}
                options={options.detection || []}
                displayEmpty
                onInput={handleDiagnosticChange}
              />
              <OrderField
                field="Severidad"
                name="severity"
                value={diagnostic.severity}
                options={options.severity || []}
                displayEmpty
                onInput={handleDiagnosticChange}
              />
              <OrderField
                field="Daño"
                name="damageType"
                value={diagnostic.damageType}
                options={options.damageType || []}
                displayEmpty
                onInput={handleDiagnosticChange}
                placeholder="Tipo de daño..."
              />
              <NumberField
                field="Interrupción otros activos"
                name="assetsDowntime"
                value={diagnostic.assetsDowntime}
                min={0}
                onInput={handleDiagnosticChange}
                placeholder="Horas"
              />
              {/* Final status quick buttons */}
              {/* <div className="join mt-1">
                <label className="label input-xs md:input-sm md:text-xs bg-neutral w-28 join-item font-bold border border-base-200 flex items-center">
                  Estado final
                </label>
                <div className="join-item flex gap-1 px-2 items-center flex-grow border border-base-200 bg-base-100 rounded-r-md">
                  {FINAL_STATUS.map(({ key, label, active, inactive }) => (
                    <button
                      key={key}
                      type="button"
                      className={`btn btn-xs border ${form.finalStatus === key ? active : inactive}`}
                      onClick={() =>
                        handleChange({
                          target: {
                            name: "finalStatus",
                            value: form.finalStatus === key ? "" : key,
                          },
                        })
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div> */}
            </div>
          </WorkOrderCard>
        </div>

        {/* ── Footer ── */}
        <WorkOrderCard className="mt-auto">
          <div className="flex justify-end gap-2">
            <button
              className="btn btn-sm btn-info"
              onClick={handleSave}
              disabled={!canSave}
            >
              <i className="fas fa-save" /> Guardar
            </button>
          </div>
        </WorkOrderCard>
      </div>
    </div>
  );
}
