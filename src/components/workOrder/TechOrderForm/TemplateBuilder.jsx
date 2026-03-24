import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function emptyRow() {
  return {
    id: crypto.randomUUID(),
    taskId: "",
    optionsText: "", // comma-separated
    allowCustomValue: false,
  };
}

export default function TemplateBuilder({ techTasks, groupParts, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [rows, setRows] = useState([emptyRow()]);
  const [saving, setSaving] = useState(false);

  function updateRow(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function getTaskInfo(taskId) {
    return techTasks.find((t) => t._id === taskId) || null;
  }

  async function handleSave() {
    if (!name.trim() || !rows.some((r) => r.taskId)) return;
    setSaving(true);
    const subtasks = rows
      .filter((r) => r.taskId)
      .map((r) => {
        const task = getTaskInfo(r.taskId);
        return {
          groupPart: task?.groupPart?._id || task?.groupPart,
          task: r.taskId,
          availableOptions: r.optionsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          allowCustomValue: r.allowCustomValue,
        };
      });
    await onSave({ name: name.trim(), subtasks });
    setSaving(false);
  }

  const canSave = name.trim() && rows.some((r) => r.taskId);

  return (
    <div className="flex flex-col gap-3">
      {/* Template name */}
      <div className="join w-full">
        <label className="label input-xs bg-neutral w-28 join-item font-bold border border-base-200 flex items-center text-xs">
          Nombre
        </label>
        <input
          className="input input-xs input-bordered join-item flex-grow"
          placeholder="Nombre del template..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Subtask rows */}
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-[1fr,1fr,5rem,2rem] gap-1 text-xs font-bold opacity-60 px-1">
          <span>Tarea</span>
          <span>Opciones (separadas por coma)</span>
          <span className="text-center">Val. libre</span>
          <span />
        </div>

        {rows.map((row) => {
          const task = getTaskInfo(row.taskId);
          const groupLabel = task?.groupPart?.name || task?.groupPart || "";
          return (
            <div key={row.id} className="flex flex-col gap-0.5">
              {groupLabel && (
                <span className="text-xs opacity-40 pl-1">{groupLabel}</span>
              )}
              <div className="grid grid-cols-[1fr,1fr,5rem,2rem] gap-1 items-center">
                <select
                  className="select select-xs select-bordered w-full"
                  value={row.taskId}
                  onChange={(e) => updateRow(row.id, { taskId: e.target.value })}
                >
                  <option value="">Seleccionar tarea...</option>
                  {techTasks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>

                <input
                  className="input input-xs input-bordered w-full"
                  placeholder="Ej: Ok, Falla, N/A"
                  value={row.optionsText}
                  onChange={(e) =>
                    updateRow(row.id, { optionsText: e.target.value })
                  }
                />

                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs checkbox-primary"
                    checked={row.allowCustomValue}
                    onChange={(e) =>
                      updateRow(row.id, { allowCustomValue: e.target.checked })
                    }
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-xs btn-ghost btn-error"
                  onClick={() => removeRow(row.id)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add row */}
      <button
        type="button"
        className="btn btn-xs btn-ghost btn-outline w-full"
        onClick={() => setRows((prev) => [...prev, emptyRow()])}
      >
        <FontAwesomeIcon icon={faPlus} /> Agregar subtarea
      </button>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1 border-t border-base-300">
        <button
          type="button"
          className="btn btn-xs btn-ghost"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-xs btn-success"
          disabled={!canSave || saving}
          onClick={handleSave}
        >
          {saving ? "Guardando..." : "Crear Template"}
        </button>
      </div>
    </div>
  );
}
