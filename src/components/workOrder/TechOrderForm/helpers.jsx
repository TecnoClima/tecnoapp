export function mapToFormSubtask(subtask, fromTemplate = false) {
  return {
    id: subtask._id || crypto.randomUUID(),
    groupPart: subtask.groupPart,
    task: subtask.task,
    selectedOption: subtask.selectedOption || "",
    customValue: subtask.customValue || "",
    result: subtask.result || "",
    comments: subtask.comments || "",
    availableOptions: subtask.availableOptions || [],
    allowCustomValue: !!subtask.allowCustomValue,
    fromTemplate,
  };
}

export function toBackendSubtask({ id, fromTemplate, ...rest }) {
  return rest;
}
