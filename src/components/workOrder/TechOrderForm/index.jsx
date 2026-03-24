import {
  faBookOpen,
  faSearch,
  faSyncAlt,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deviceActions, workOrderActions } from "../../../actions/StoreActions";
import DeviceList from "../../Devices/DeviceList";
import ModalBase from "../../../Modals/ModalBase";
import { ErrorModal, SuccessModal } from "../../warnings";
import {
  OrderField,
  DateField,
  NumberField,
  TextAreaField,
} from "../OrderFields";
import WorkOrderCard from "../WorkOrderCard";
import SubtasksSection from "./SubtasksSection";
import TemplateModal from "./TemplateModal";
import { mapToFormSubtask, toBackendSubtask } from "./helpers";

// ─── constants ────────────────────────────────────────────────────────────────

const EMPTY_DEVICE = {
  code: "",
  name: "",
  location: "",
  type: "",
  category: "",
};

const EMPTY_FORM = {
  // General
  generatedBy: "",
  responsible: "",
  priority: "",
  classification: "",
  description: "",
  requestedBy: "",
  costCenter: "",
  // Time / Planning
  plannedDate: "",
  eventDate: "",
  startDate: "",
  endDate: "",
  estimatedDuration: "",
  downtime: "",
  // Failure / Diagnostics
  failureType: "",
  failureCause: "",
  detectionMethod: "",
  severity: "",
  damageType: "",
  diagnostics: "",
  finalStatus: "",
};

const PRIORITY_OPTIONS = ["Alta", "Media", "Baja"];
const SEVERITY_OPTIONS = ["Crítica", "Alta", "Media", "Baja"];
const DETECTION_OPTIONS = ["Preventivo", "Predictivo", "Correctivo", "Reclamo"];
const FINAL_STATUS = [
  {
    key: "ok",
    label: "OK",
    active: "btn-success",
    inactive: "btn-ghost border-base-300",
  },
  {
    key: "alert",
    label: "Alerta",
    active: "btn-warning",
    inactive: "btn-ghost border-base-300",
  },
  {
    key: "fail",
    label: "Falla",
    active: "btn-error",
    inactive: "btn-ghost border-base-300",
  },
];

// ─── component ────────────────────────────────────────────────────────────────

export default function TechOrderForm({ orderCode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetail, orderResult } = useSelector((s) => s.workOrder);
  const { selectedDevice } = useSelector((s) => s.devices);

  const [device, setDevice] = useState(EMPTY_DEVICE);
  const [deviceTable, setDeviceTable] = useState(false);
  const [templateModal, setTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // ── unmount cleanup ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => dispatch(workOrderActions.resetDetail());
  }, [dispatch]);

  // ── load existing order ───────────────────────────────────────────────────
  useEffect(() => {
    if (!orderCode) return;
    dispatch(workOrderActions.searchWO(orderCode));
  }, [orderCode, dispatch]);

  useEffect(() => {
    if (!orderDetail?.code) return;
    dispatch(deviceActions.setDevice(orderDetail.device));
    const { tech, device: _d, ...rest } = orderDetail;
    setForm((prev) => ({ ...prev, ...rest }));
    if (tech?.subtasks?.length) {
      setSubtasks(tech.subtasks.map((st) => mapToFormSubtask(st)));
    }
    if (tech?.templateId) setTemplateId(tech.templateId);
  }, [orderDetail, dispatch]);

  // ── sync device from Redux ────────────────────────────────────────────────
  const applyDevice = useCallback((d) => {
    if (!d?.name) {
      setDevice(EMPTY_DEVICE);
      return;
    }
    setDevice({
      code: d.code,
      name: d.name,
      location: [d.plant, d.area, d.line].filter(Boolean).join(" > "),
      type: d.type || "",
      category: d.category || "",
    });
  }, []);

  useEffect(() => {
    if (!selectedDevice?.name || selectedDevice.name === device.name) return;
    applyDevice(selectedDevice);
  }, [selectedDevice, applyDevice, device.name]);

  // ── form change handler ───────────────────────────────────────────────────
  function handleFormChange(e) {
    const { name, value } = e.target || e;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ── device handlers ───────────────────────────────────────────────────────
  function handleSearch(e) {
    e.preventDefault();
    if (device.code) dispatch(deviceActions.getDetail(device.code, true));
  }

  function handleResetDevice(e) {
    e.preventDefault();
    dispatch(deviceActions.resetDevice());
    setDevice(EMPTY_DEVICE);
  }

  // ── template handlers ─────────────────────────────────────────────────────
  function applyTemplate(template) {
    setTemplateId(template._id);
    setTemplateName(template.name);
    if (template.subtasks?.length) {
      setSubtasks(template.subtasks.map((st) => mapToFormSubtask(st, true)));
    }
  }

  // ── subtask handler ───────────────────────────────────────────────────────
  function handleChangeSubtask(id, patch) {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, ...patch } : st)),
    );
  }

  // ── save ──────────────────────────────────────────────────────────────────
  function handleSave(e) {
    e?.preventDefault();
    setSaving(true);
    const payload = {
      type: "tech",
      device: device.code,
      ...form,
      tech: {
        ...(templateId && { templateId }),
        subtasks: subtasks.map(toBackendSubtask),
      },
    };
    if (orderCode) {
      dispatch(workOrderActions.updateOrder(orderCode, payload));
    } else {
      dispatch(workOrderActions.newWorkOrder(payload));
    }
  }

  function handleSuccess() {
    dispatch(workOrderActions.resetOrderResult());
    navigate("/ots");
  }

  useEffect(() => {
    if (orderResult) setSaving(false);
  }, [orderResult]);

  const canSave = !!device.name && !saving;

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
          link={orderCode ? null : `/ots/detail/${orderResult.success}`}
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
            <DeviceList close={() => setDeviceTable(false)} />
          </div>
        </ModalBase>
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
                {!device.name ? (
                  <>
                    <input
                      className="flex flex-grow input-sm join-item bg-base-100 border-2 border-info"
                      type="text"
                      placeholder="Código de equipo"
                      value={device.code}
                      onChange={(e) =>
                        setDevice({ ...device, code: e.target.value })
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
                        <b>[{device.code}]</b> {device.name}
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
                className={device.name ? "" : "opacity-0"}
                disabled={!device.name}
                value={form.costCenter}
                onInput={handleFormChange}
                placeholder="CC-XXX"
              />
            </div>
            {device.name && (
              <div className="flex flex-col gap-4">
                <div className="text-sm opacity-60 pt-1 space-y-0.5">
                  <p>
                    <b>Ubicación:</b> {device.location}
                  </p>
                  <p>
                    <b>Tipo:</b> {device.type}
                  </p>
                  <p>
                    <b>Categoría:</b> {device.category}
                  </p>
                </div>
              </div>
            )}
          </WorkOrderCard>

          {/* ── 2. INFO GENERAL ── */}
          <WorkOrderCard title="INFO GENERAL">
            <div className="flex flex-col lg:grid grid-cols-2 gap-1 mt-1">
              <OrderField
                field="Generado por"
                name="generatedBy"
                value={form.generatedBy}
                onInput={handleFormChange}
                placeholder="Nombre..."
              />
              <OrderField
                field="Responsable"
                name="responsible"
                value={form.responsible}
                onInput={handleFormChange}
                placeholder="Nombre..."
              />
              <NumberField
                field="Duración estimada (hs)"
                name="estimatedDuration"
                value={form.estimatedDuration}
                onInput={handleFormChange}
                placeholder="Horas"
              />
              <DateField
                field="Fecha"
                name="registerDate"
                value={form.registerDate}
                onInput={handleFormChange}
              />
            </div>
          </WorkOrderCard>

          {/* ── 3. PLANIFICACIÓN ── */}
          <WorkOrderCard title="PLANIFICACIÓN">
            <div className="flex flex-col lg:grid grid-cols-2 gap-1 mt-1">
              <TextAreaField
                field="Descripción"
                className="w-full lg:col-span-2"
                name="description"
                value={form.description}
                onInput={handleFormChange}
                placeholder="Descripción del trabajo..."
              />
              <DateField
                field="Fecha evento"
                name="plannedDate"
                value={form.plannedDate}
                onInput={handleFormChange}
              />
              <OrderField
                field="Prioridad"
                name="priority"
                value={form.priority}
                options={PRIORITY_OPTIONS}
                displayEmpty
                onInput={handleFormChange}
              />
              <OrderField
                field="Activador"
                name="activator"
                value={form.activator}
                onInput={handleFormChange}
                placeholder="Plan/Reclamo"
              />
              <OrderField
                field="Clasificación"
                name="classification"
                value={form.classification}
                onInput={handleFormChange}
                placeholder="Tipo de trabajo..."
              />
              <DateField
                field="Fecha evento"
                name="eventDate"
                value={form.eventDate}
                onInput={handleFormChange}
              />
              <DateField
                field="Inicio"
                name="startDate"
                value={form.startDate}
                onInput={handleFormChange}
              />
              <DateField
                field="Fin"
                name="endDate"
                value={form.endDate}
                onInput={handleFormChange}
              />
              <NumberField
                field="Tiempo trabajo (h)"
                name="worktime"
                value={form.downtime}
                onInput={handleFormChange}
                placeholder="Horas"
              />
              <NumberField
                field="Tiempo parada (h)"
                name="downtime"
                value={form.downtime}
                onInput={handleFormChange}
                placeholder="Horas"
              />
              <OrderField
                field="Solicitante"
                name="requestedBy"
                value={form.requestedBy}
                onInput={handleFormChange}
                placeholder="Quien solicita..."
              />
            </div>
          </WorkOrderCard>

          {/* ── 4. SUBTAREAS ── */}
          <div className="md:col-span-2">
            <WorkOrderCard
              title="SUBTAREAS"
              headerButton={
                <button
                  type="button"
                  className="btn btn-xs btn-outline btn-primary"
                  onClick={() => setTemplateModal(true)}
                >
                  <FontAwesomeIcon icon={faBookOpen} /> Gestionar Template
                </button>
              }
            >
              {templateName && (
                <p className="text-xs opacity-50 mb-1">
                  Template activo: <b>{templateName}</b> — {subtasks.length}{" "}
                  subtarea(s)
                </p>
              )}
              {subtasks.length === 0 ? (
                <p className="text-sm opacity-40 py-6 text-center">
                  Seleccioná un template o cargá subtareas manualmente.
                </p>
              ) : (
                <div className="mt-2">
                  <SubtasksSection
                    subtasks={subtasks}
                    onChange={handleChangeSubtask}
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
                value={form.diagnostics}
                onInput={handleFormChange}
                placeholder="Observaciones diagnósticas..."
              />

              <OrderField
                field="Tipo falla"
                name="failureType"
                value={form.failureType}
                onInput={handleFormChange}
                placeholder="Descripción del fallo..."
              />
              <OrderField
                field="Causa falla"
                name="failureCause"
                value={form.failureCause}
                onInput={handleFormChange}
                placeholder="Causa raíz..."
              />
              <OrderField
                field="Detección"
                name="detectionMethod"
                value={form.detectionMethod}
                options={DETECTION_OPTIONS}
                displayEmpty
                onInput={handleFormChange}
              />
              <OrderField
                field="Severidad"
                name="severity"
                value={form.severity}
                options={SEVERITY_OPTIONS}
                displayEmpty
                onInput={handleFormChange}
              />
              <OrderField
                field="Daño"
                name="damageType"
                value={form.damageType}
                onInput={handleFormChange}
                placeholder="Tipo de daño..."
              />
              <NumberField
                field="Interrupción otros activos"
                name="assetsInterruptions"
                value={form.damageType}
                onInput={handleFormChange}
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
                        handleFormChange({
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
