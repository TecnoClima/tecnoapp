export function setPermissions(userData, order) {
  const isNewOrder = !order?.code;

  const isAdmin = userData.access?.toLowerCase() === "admin";
  const isSupervisor =
    userData.access?.toLowerCase() === "supervisor" &&
    order?.supervisor?.idNumber === userData.id;

  const isAuthor = order?.generatedBy?._id === userData._id;
  const isResponsible = order?.responsible?._id === userData._id;

  const hasSubTasks = !!order?.tech?.subtasks?.length;

  // 🔹 Agrupaciones clave
  const canEditBase = isNewOrder || isAuthor || isAdmin || isSupervisor;
  const canEditWithResponsible = canEditBase || isResponsible;

  const canAdminOrSupervisor = isAdmin || isSupervisor;

  return {
    changeBaseData: canEditBase,
    changeDevice: canEditBase,
    changeSupervisor: isAdmin,
    changeResponsible: isNewOrder || canAdminOrSupervisor,
    changePlan: canEditBase,
    changeDiagnostic: canEditWithResponsible,
    changeTask:
      isNewOrder || (isAuthor && !hasSubTasks) || canAdminOrSupervisor,
    addSubtasks: canEditWithResponsible,
    deleteSubtasks: isNewOrder || canAdminOrSupervisor,
    updateSubtasks: canEditWithResponsible,
    deleteOrder: isAdmin,
    closeOrder: canAdminOrSupervisor,
    editClosedOrder: isAdmin,
    canSave: isAdmin || isSupervisor || isResponsible || isAuthor,
  };
}
