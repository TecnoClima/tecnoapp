import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { techOrdersService } from "../../../services/techOrders";

// ─── Generic CRUD row ─────────────────────────────────────────────────────────

function ItemRow({ item, fields, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-base-100 border border-base-200 rounded text-sm">
      <div className="flex-grow flex gap-4 flex-wrap">
        {fields.map(({ key, label }) => (
          <span key={key}>
            {label && <b className="opacity-50 mr-1">{label}:</b>}
            {typeof item[key] === "boolean"
              ? item[key] ? "Sí" : "No"
              : item[key]?.name || item[key] || "—"}
          </span>
        ))}
      </div>
      <div className="flex gap-1 flex-none">
        <button
          className="btn btn-xs btn-ghost"
          title="Editar"
          onClick={() => onEdit(item)}
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          className="btn btn-xs btn-ghost text-error"
          title="Eliminar"
          onClick={() => onDelete(item._id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

// ─── GroupParts section ───────────────────────────────────────────────────────

function GroupPartsSection() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null); // null | item

  useEffect(() => {
    techOrdersService.groupParts.list().then((data) => {
      if (Array.isArray(data)) setItems(data);
    });
  }, []);

  function startEdit(item) {
    setEditing(item);
    setForm({ name: item.name });
  }

  function resetForm() {
    setEditing(null);
    setForm({ name: "" });
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    if (editing) {
      const result = await techOrdersService.groupParts.update(editing._id, form);
      if (result?._id) setItems((prev) => prev.map((i) => (i._id === result._id ? result : i)));
    } else {
      const result = await techOrdersService.groupParts.create(form);
      if (result?._id) setItems((prev) => [...prev, result]);
    }
    resetForm();
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este grupo/parte?")) return;
    await techOrdersService.groupParts.delete(id);
    setItems((prev) => prev.filter((i) => i._id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Inline form */}
      <div className="flex gap-2 items-center">
        <input
          className="input input-sm input-bordered flex-grow"
          placeholder="Nombre del grupo/parte..."
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button className="btn btn-sm btn-success" onClick={handleSave} disabled={!form.name.trim()}>
          <FontAwesomeIcon icon={editing ? faEdit : faPlus} />
          {editing ? "Actualizar" : "Crear"}
        </button>
        {editing && (
          <button className="btn btn-sm btn-ghost" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col gap-1 overflow-y-auto max-h-96">
        {items.length === 0 ? (
          <p className="text-sm opacity-40 text-center py-4">Sin grupos aún.</p>
        ) : (
          items.map((item) => (
            <ItemRow
              key={item._id}
              item={item}
              fields={[{ key: "name" }]}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── TechTasks section ────────────────────────────────────────────────────────

function TechTasksSection() {
  const [items, setItems] = useState([]);
  const [groupParts, setGroupParts] = useState([]);
  const [form, setForm] = useState({ name: "", groupPart: "", allowCustomValue: false });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    techOrdersService.techTasks.list().then((data) => {
      if (Array.isArray(data)) setItems(data);
    });
    techOrdersService.groupParts.list().then((data) => {
      if (Array.isArray(data)) setGroupParts(data);
    });
  }, []);

  function startEdit(item) {
    setEditing(item);
    setForm({
      name: item.name,
      groupPart: item.groupPart?._id || item.groupPart || "",
      allowCustomValue: !!item.allowCustomValue,
    });
  }

  function resetForm() {
    setEditing(null);
    setForm({ name: "", groupPart: "", allowCustomValue: false });
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    if (editing) {
      const result = await techOrdersService.techTasks.update(editing._id, form);
      if (result?._id) setItems((prev) => prev.map((i) => (i._id === result._id ? result : i)));
    } else {
      const result = await techOrdersService.techTasks.create(form);
      if (result?._id) setItems((prev) => [...prev, result]);
    }
    resetForm();
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta tarea técnica?")) return;
    await techOrdersService.techTasks.delete(id);
    setItems((prev) => prev.filter((i) => i._id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Inline form */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="input input-sm input-bordered flex-grow min-w-[12rem]"
          placeholder="Nombre de la tarea..."
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
        <select
          className="select select-sm select-bordered w-44"
          value={form.groupPart}
          onChange={(e) => setForm((p) => ({ ...p, groupPart: e.target.value }))}
        >
          <option value="">Sin grupo</option>
          {groupParts.map((gp) => (
            <option key={gp._id} value={gp._id}>{gp.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            className="checkbox checkbox-xs checkbox-primary"
            checked={form.allowCustomValue}
            onChange={(e) => setForm((p) => ({ ...p, allowCustomValue: e.target.checked }))}
          />
          Val. libre
        </label>
        <button className="btn btn-sm btn-success" onClick={handleSave} disabled={!form.name.trim()}>
          <FontAwesomeIcon icon={editing ? faEdit : faPlus} />
          {editing ? "Actualizar" : "Crear"}
        </button>
        {editing && (
          <button className="btn btn-sm btn-ghost" onClick={resetForm}>Cancelar</button>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col gap-1 overflow-y-auto max-h-96">
        {items.length === 0 ? (
          <p className="text-sm opacity-40 text-center py-4">Sin tareas técnicas aún.</p>
        ) : (
          items.map((item) => (
            <ItemRow
              key={item._id}
              item={item}
              fields={[
                { key: "name" },
                { key: "groupPart", label: "Grupo" },
                { key: "allowCustomValue", label: "Val. libre" },
              ]}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── TaskOptions section ──────────────────────────────────────────────────────

function TaskOptionsSection() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ label: "", value: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    techOrdersService.taskOptions.list().then((data) => {
      if (Array.isArray(data)) setItems(data);
    });
  }, []);

  function startEdit(item) {
    setEditing(item);
    setForm({ label: item.label, value: item.value || "" });
  }

  function resetForm() {
    setEditing(null);
    setForm({ label: "", value: "" });
  }

  async function handleSave() {
    if (!form.label.trim()) return;
    if (editing) {
      const result = await techOrdersService.taskOptions.update(editing._id, form);
      if (result?._id) setItems((prev) => prev.map((i) => (i._id === result._id ? result : i)));
    } else {
      const result = await techOrdersService.taskOptions.create(form);
      if (result?._id) setItems((prev) => [...prev, result]);
    }
    resetForm();
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta opción?")) return;
    await techOrdersService.taskOptions.delete(id);
    setItems((prev) => prev.filter((i) => i._id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Inline form */}
      <div className="flex gap-2 items-center flex-wrap">
        <input
          className="input input-sm input-bordered flex-grow min-w-[10rem]"
          placeholder="Etiqueta (ej: OK, Falló, N/A)..."
          value={form.label}
          onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
        />
        <input
          className="input input-sm input-bordered w-32"
          placeholder="Valor (opcional)"
          value={form.value}
          onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
        />
        <button className="btn btn-sm btn-success" onClick={handleSave} disabled={!form.label.trim()}>
          <FontAwesomeIcon icon={editing ? faEdit : faPlus} />
          {editing ? "Actualizar" : "Crear"}
        </button>
        {editing && (
          <button className="btn btn-sm btn-ghost" onClick={resetForm}>Cancelar</button>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col gap-1 overflow-y-auto max-h-96">
        {items.length === 0 ? (
          <p className="text-sm opacity-40 text-center py-4">Sin opciones aún.</p>
        ) : (
          items.map((item) => (
            <ItemRow
              key={item._id}
              item={item}
              fields={[
                { key: "label", label: "Etiqueta" },
                { key: "value", label: "Valor" },
              ]}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "groupparts", label: "Grupos / Partes", Component: GroupPartsSection },
  { id: "techtasks", label: "Tareas Técnicas", Component: TechTasksSection },
  { id: "taskoptions", label: "Opciones de Tarea", Component: TaskOptionsSection },
];

export default function TechConfig() {
  const [tab, setTab] = useState("groupparts");
  const ActiveSection = TABS.find((t) => t.id === tab)?.Component;

  return (
    <div className="page-container">
      <div className="page-title">Configuración de Órdenes Técnicas</div>

      {/* Tab nav */}
      <div role="tablist" className="tabs tabs-bordered mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            className={`tab ${tab === t.id ? "tab-active font-semibold" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active section */}
      <div className="card bg-base-content/10 p-4 flex-grow overflow-y-auto">
        {ActiveSection && <ActiveSection />}
      </div>
    </div>
  );
}
