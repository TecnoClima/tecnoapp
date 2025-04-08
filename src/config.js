const appConfig = {
  frequencies: [
    { weeks: 1, frequency: "Semanal" },
    { weeks: 2, frequency: "Quincenal" },
    { weeks: 4, frequency: "Mensual" },
    { weeks: 8, frequency: "Bimestral" },
    { weeks: 12, frequency: "Trimestral" },
    { weeks: 16, frequency: "Cuatrimestral" },
    { weeks: 24, frequency: "Semestral" },
    { weeks: 48, frequency: "Anual" },
  ],
  headersRef: {
    //Work Orders
    code: "Código",
    class: "Clase",
    status: "Estado",
    device: "Equipo",
    description: "Descripción",
    solicitor: "Solicitante",
    registration: "Alta",
    clientWO: "OT Cliente",
    closed: "Cierre",
    cause: "Causa",
    frequency: "Frecuencia",
    issue: "Problema",
    line: "Línea",
    area: "Área",
    macroCause: "Causa Macro",
    supervisor: "Supervisor",
    idNumber: "DNI",
    phone: "Teléfono",
    following: "Siguiendo",
    dateMin: "Desde",
    dateMax: "Hasta",

    //forms
    location: "Ubicación",
    date: "Fecha",
    time: "Hora",
    workers: "Personal",
    task: "Tarea",

    //Devices
    plant: "Planta",
    plantName: "Planta",
    name: "Nombre",
    type: "Tipo",
    types: "Tipos",
    powerKcal: "Pot Kcal",
    powerTnRef: "Pot TnRef",
    refrigerant: "Gas",
    gasAmount: "Cant.Gas",
    extraDetails: "Descripción Larga",
    service: "Servicio",
    category: "Categoría",
    regDate: "Fecha Alta",
    environment: "Ambiente",
    servicePoints: "Lugares de Servicio",
    servicePoint: "Lugar de Servicio",
    power: "Potencia",
    age: "Antigüedad",
    unit: "Unidad",
    active: "Activo",

    //AdminUsers
    charge: "Cargo",
    access: "Acceso",
    View: "Vista",
    Client: "Usuario",
    Worker: "Técnico",
    Internal: "Interno",

    //Plan
    program: "Programa",
    reclaims: "Reclamos",
    responsible: "Responsable",
    year: "Año",
    people: "Personal",

    //SP
    spCode: "CódigoLS",
    calory: "Caloría",
    dangerTask: "Tarea Peligrosa",
    steelMine: "Acería",
    insalubrity: "Insalubridad",
  },
  values: {
    startingYear: 2015,
  },
  cylinderStatuses: [
    {
      name: "Nueva",
      class: { unselected: "btn-outline-info", selected: "btn-info" },
    },
    {
      name: "En uso",
      class: { unselected: "btn-outline-success", selected: "btn-success" },
    },
    {
      name: "Vacía",
      class: { unselected: "btn-outline-danger", selected: "btn-danger" },
    },
    {
      name: "Descartada",
      class: { unselected: "btn-outline-secondary", selected: "btn-secondary" },
    },
  ],
};

export { appConfig };
