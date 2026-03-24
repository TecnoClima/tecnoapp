import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ModalBase from "../../../Modals/ModalBase";
import { techOrdersService } from "../../../services/techOrders";
import TemplateBuilder from "./TemplateBuilder";

const TABS = [
  { id: "search", label: "Buscar / Seleccionar" },
  { id: "create", label: "Crear nuevo" },
];

export default function TemplateModal({ open, onClose, onSelect, onCreated }) {
  const [tab, setTab] = useState("search");
  const [templates, setTemplates] = useState([]);
  const [techTasks, setTechTasks] = useState([]);
  const [groupParts, setGroupParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      techOrdersService.templates.list(),
      techOrdersService.techTasks.list(),
      techOrdersService.groupParts.list(),
    ]).then(([tmpl, tasks, gparts]) => {
      if (Array.isArray(tmpl)) setTemplates(tmpl);
      if (Array.isArray(tasks)) setTechTasks(tasks);
      if (Array.isArray(gparts)) setGroupParts(gparts);
      setLoading(false);
    });
  }, [open]);

  async function handleCreate(data) {
    const result = await techOrdersService.templates.create(data);
    if (result?._id) {
      setTemplates((prev) => [...prev, result]);
      onCreated(result);
      onClose();
    }
  }

  function handleConfirmSelect() {
    if (!selected) return;
    // fetch full template with subtasks before returning
    techOrdersService.templates.get(selected._id).then((full) => {
      onSelect(full?._id ? full : selected);
      onClose();
    });
  }

  return (
    <ModalBase
      open={open}
      title="Gestionar Template"
      onClose={onClose}
      className="sm:max-w-2xl"
    >
      {/* Tabs */}
      <div role="tablist" className="tabs tabs-bordered mb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            className={`tab ${tab === t.id ? "tab-active font-semibold" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-8 text-center opacity-40">Cargando...</div>
      ) : (
        <>
          {/* ── SEARCH TAB ── */}
          {tab === "search" && (
            <div className="flex flex-col gap-2">
              {templates.length === 0 ? (
                <p className="text-sm opacity-40 py-4 text-center">
                  No hay templates creados aún.
                </p>
              ) : (
                <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
                  {templates.map((t) => (
                    <button
                      key={t._id}
                      type="button"
                      className={`flex items-center justify-between p-2 rounded border text-left transition-colors ${
                        selected?._id === t._id
                          ? "border-primary bg-primary/10"
                          : "border-base-300 bg-base-100 hover:bg-base-200"
                      }`}
                      onClick={() => setSelected(t)}
                    >
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        {t.subtasks?.length > 0 && (
                          <p className="text-xs opacity-50">
                            {t.subtasks.length} subtarea(s)
                          </p>
                        )}
                      </div>
                      {selected?._id === t._id && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-primary"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-base-300">
                <button
                  type="button"
                  className="btn btn-xs btn-ghost"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-primary"
                  disabled={!selected}
                  onClick={handleConfirmSelect}
                >
                  Usar este template
                </button>
              </div>
            </div>
          )}

          {/* ── CREATE TAB ── */}
          {tab === "create" && (
            <TemplateBuilder
              techTasks={techTasks}
              groupParts={groupParts}
              onSave={handleCreate}
              onCancel={onClose}
            />
          )}
        </>
      )}
    </ModalBase>
  );
}
