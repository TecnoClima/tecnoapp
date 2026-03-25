import SubtaskItem from "./SubtaskItem";

function getGroupKey(subtask) {
  return subtask.groupPart?._id || subtask.groupPart || "__no_group__";
}

function getGroupLabel(subtask) {
  return subtask.groupPart?.name || subtask.groupPart || "Sin grupo";
}

export default function SubtasksSection({ subtasks, onChange }) {
  // Collect ordered unique groups (preserving insertion order)
  const groups = [];
  const seen = new Set();
  for (const st of subtasks) {
    const key = getGroupKey(st);
    if (!seen.has(key)) {
      seen.add(key);
      groups.push({ key, label: getGroupLabel(st) });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map(({ key, label }) => (
        <div key={key}>
          <div className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1 px-1 border-b border-base-300 pb-0.5">
            {label}
          </div>
          <div className="flex flex-col gap-1">
            {subtasks
              .filter((st) => getGroupKey(st) === key)
              .map((st) => (
                <SubtaskItem key={st.id} subtask={st} onChange={onChange} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
