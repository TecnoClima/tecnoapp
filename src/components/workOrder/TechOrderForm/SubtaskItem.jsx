const RESULT_BUTTONS = [
  { key: "ok", label: "OK", active: "btn-success", inactive: "btn-ghost border-base-300" },
  { key: "fail", label: "FAIL", active: "btn-error", inactive: "btn-ghost border-base-300" },
  { key: "na", label: "N/A", active: "btn-neutral", inactive: "btn-ghost border-base-300" },
];

const BORDER_BY_RESULT = {
  ok: "border-l-success",
  fail: "border-l-error",
  na: "border-l-neutral",
};

export default function SubtaskItem({ subtask, onChange }) {
  const {
    id,
    task,
    selectedOption,
    customValue,
    result,
    comments,
    availableOptions,
    allowCustomValue,
  } = subtask;

  function handleOption(e) {
    onChange(id, { selectedOption: e.target.value, customValue: "" });
  }

  function handleCustomValue(e) {
    onChange(id, { customValue: e.target.value, selectedOption: "" });
  }

  function handleResult(key) {
    onChange(id, { result: result === key ? "" : key });
  }

  function handleComments(e) {
    onChange(id, { comments: e.target.value });
  }

  const borderClass = BORDER_BY_RESULT[result] || "border-l-base-300";

  return (
    <div
      className={`flex flex-col gap-1 p-2 border-l-4 ${borderClass} bg-base-100 rounded-r-md transition-colors`}
    >
      {/* Top row: task name + inputs + result buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex-grow text-sm font-medium min-w-[8rem]">
          {task?.name || task}
        </span>

        {availableOptions?.length > 0 && (
          <select
            className="select select-xs select-bordered w-32"
            value={selectedOption}
            onChange={handleOption}
          >
            <option value="">Opción...</option>
            {availableOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {allowCustomValue && (
          <input
            className="input input-xs input-bordered w-24"
            placeholder="Valor"
            value={customValue}
            onChange={handleCustomValue}
          />
        )}

        <div className="flex gap-1 ml-auto">
          {RESULT_BUTTONS.map(({ key, label, active, inactive }) => (
            <button
              key={key}
              type="button"
              className={`btn btn-xs border ${result === key ? active : inactive}`}
              onClick={() => handleResult(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <input
        className="input input-xs input-bordered w-full"
        placeholder="Comentarios..."
        value={comments}
        onChange={handleComments}
      />
    </div>
  );
}
