const requiredFields = {
  order: ["supervisor", "responsible", "device", "registerDate"],
  diagnostic: [
    "failureType",
    "cause",
    "method",
    "severity",
    "damageType",
    "cause",
  ],
  planned: [
    "priority",
    "startDate",
    "activator",
    "endDate",
    "worktime",
    "requester",
    "classification",
  ],
};

export function validateOrderForClose(order, options) {
  const missingFields = [];

  // Helper para validar vacío
  const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    value === "" ||
    (typeof value === "number" && isNaN(value));

  // 🔹 Nivel raíz (order)
  requiredFields.order.forEach((field) => {
    if (isEmpty(order[field])) {
      missingFields.push(`order.${field}`);
    }
  });

  const classification = options?.classification?.find(
    (c) => c.id === order?.tech?.planned?.classification,
  )?.name;

  if (classification !== "Inspección") {
    // 🔹 diagnostics
    requiredFields.diagnostic.forEach((field) => {
      if (isEmpty(order?.tech?.diagnostics?.[field])) {
        missingFields.push(`diagnostics.${field}`);
      }
    });
  }

  // 🔹 planned
  requiredFields.planned.forEach((field) => {
    if (isEmpty(order?.tech?.planned?.[field])) {
      missingFields.push(`planned.${field}`);
    }
  });

  return {
    canClose: missingFields.length === 0,
    missingFields,
  };
}

export function emptyToNull(obj) {
  if (Array.isArray(obj)) {
    return obj.map(emptyToNull);
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        v === "" ? null : emptyToNull(v),
      ]),
    );
  }

  return obj;
}
