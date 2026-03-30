export function mapToFormSubtask(subtask, index) {
  return {
    ...subtask,
    value: subtask.value ?? "",
    order: subtask.order ?? index + 1,
    comments: subtask.comments ?? "",
  };
}

export function toBackendSubtask(subtask) {
  return {
    subtask: subtask._id,
    value: subtask.value,
    comments: subtask.comments,
    order: subtask.order,
  };
}

export function reorderSubtasks(list, fromIndex, toIndex) {
  const updated = [...list];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);

  // Normalizar order (1...n)
  return updated.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}
