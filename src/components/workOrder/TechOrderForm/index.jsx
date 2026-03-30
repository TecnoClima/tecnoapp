import {
  faBookOpen,
  faExchange,
  faSearch,
  faSyncAlt,
  faTable,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
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

const testJson = {
  type: "tech",
  device: "AH1-001",
  generatedBy: "Fulano",
  responsible: "Mengano",
  priority: "Media",
  classification: "Preventivo",
  description: "Descripción  genérica",
  requestedBy: "Sultano",
  costCenter: "",
  plannedDate: "2026-03-20",
  eventDate: "",
  startDate: "",
  endDate: "",
  estimatedDuration: "2",
  downtime: "",
  failureType: "",
  failureCause: "",
  detectionMethod: "",
  severity: "",
  damageType: "",
  diagnostics: "",
  finalStatus: "",
  registerDate: "2026-03-20",
  activator: "Plan",
  tech: {
    templateId: "69c93a3a57e3196f7d245bb9",
    subtasks: [
      {
        _id: "69c4022a88e20bb2f295418d",
        devicePart: {
          _id: "69c1d8ceaddf9ecb81ca1eca",
          value: "equipo_completo",
          label: "Equipo completo",
          targetCollection: "subTask",
          type: "devicePart",
          active: true,
          order: 3,
          createdAt: "2026-03-24T00:20:30.641Z",
          updatedAt: "2026-03-24T00:20:30.641Z",
          __v: 0,
        },
        procedure: "Ajuste de correas de ventilador",
        resultType: "boolean",
        active: true,
        options: ["Sí", "No", "N/A"],
        createdAt: "2026-03-25T15:41:30.683Z",
        updatedAt: "2026-03-25T15:41:30.683Z",
        __v: 0,
        value: "",
        order: 1,
        comments: "",
      },
      {
        _id: "69c4022a88e20bb2f2954195",
        devicePart: {
          _id: "69c1d8ceaddf9ecb81ca1ec8",
          value: "unidad_interior",
          label: "Unidad interior",
          targetCollection: "subTask",
          type: "devicePart",
          active: true,
          order: 1,
          createdAt: "2026-03-24T00:20:30.641Z",
          updatedAt: "2026-03-24T00:20:30.641Z",
          __v: 0,
        },
        procedure: "Medir consumo eléctrico Motor Ventilador Evaporador [Amp]",
        resultType: "number",
        active: true,
        options: [],
        createdAt: "2026-03-25T15:41:30.683Z",
        updatedAt: "2026-03-25T15:41:30.683Z",
        __v: 0,
        value: "",
        order: 2,
        comments: "",
      },
    ],
  },
};

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

export default function TechOrderForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderCode } = useParams();
  const { optionsList } = useSelector((s) => s.options);
  const { orderDetail, orderResult } = useSelector((s) => s.workOrder);
  const { workersList } = useSelector((s) => s.people);
  const { selectedDevice } = useSelector((s) => s.devices);

  const [device, setDevice] = useState(EMPTY_DEVICE);
  const [deviceTable, setDeviceTable] = useState(false);
  const [templateModal, setTemplateModal] = useState(false);
  const [addSubtaskModal, setAddSubtaskModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  // const [form, setForm] = useState(EMPTY_FORM);
  const [form, setForm] = useState(testJson);
  const [saving, setSaving] = useState(false);
  useGetPlantWorkers();
  useEffect(() => {
    dispatch(optionActions.getList());
  }, [dispatch]);

  useEffect(() => {
    console.log("orderDetail", orderDetail);
  }, [orderDetail]);

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
    const { tech, device: _d, responsible, ...rest } = orderDetail;

    setForm((prev) => ({
      ...prev,
      ...rest,
      responsible: responsible?._id || "",
    }));
    if (tech?.subtasks?.length) {
      setSubtasks(
        orderDetail.tech.subtasks
          .map(({ subtask, rest }) => ({ ...rest, ...subtask }))
          .map(mapToFormSubtask),
      );
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
  useEffect(() => {
    setDevice(selectedDevice);
  }, [selectedDevice]);

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
                    <b>Ubicación:</b>{" "}
                    {device.location ||
                      (device.plant && device.area && device.line
                        ? `${device.plant} > ${device.area} > ${device.line}`
                        : "")}
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
            <div className="flex flex-col md:grid grid-cols-3 gap-1 mt-1">
              <OrderField
                field="Responsable"
                name="responsible"
                options={
                  workersList?.map((w) => ({ id: w._id, name: w.name })) || []
                }
                displayEmpty
                value={form.responsible}
                onInput={handleFormChange}
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
            <div className="flex flex-col md:grid grid-cols-3 gap-1 mt-1">
              <TextAreaField
                field="Descripción"
                className="w-full md:col-span-3"
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
