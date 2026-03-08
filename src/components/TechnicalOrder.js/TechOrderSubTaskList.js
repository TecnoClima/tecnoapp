import { Fragment } from "react";

const subTasks = [
  {
    group: "Equipo",
    procedure: "Realizar bloqueo eléctrico LOTO",
    options: ["Si", "No", "N/A"],
    selectedOption: "Si",
    value: null,
  },
  {
    group: "Equipo",
    procedure: "Recuperar gas refrigerante",
    options: ["Si", "No", "N/A"],
    selectedOption: "Si",
    value: null,
  },
  {
    group: "Unidad Exterior",
    procedure: "Reemplazo MC",
    options: ["Si", "No", "N/A"],
    selectedOption: "Si",
    value: null,
  },
  {
    group: "Equipo",
    procedure: "Presurización y control de hermeticidad",
    options: ["Aprobó", "Alerta", "Falló"],
    selectedOption: "Aprobó",
    value: null,
  },
  {
    group: "Unidad Exterior",
    procedure: "Vacío y carga de gas refrigerante",
    options: ["Si", "No", "N/A"],
    selectedOption: "Si",
    value: null,
  },
  {
    group: "Unidad Exterior",
    procedure: "Reemplazo placa PCB Inverter",
    options: ["Si", "No", "N/A"],
    selectedOption: "N/A",
    value: null,
  },
  {
    group: "Equipo",
    procedure: "PEM Equipo y control de parámetros mediante interface",
    options: ["Si", "No", "N/A"],
    selectedOption: "Si",
    value: null,
  },
  {
    group: "Unidad Exterior",
    procedure: "Presión de gas refrigerante en servicio",
    options: [],
    selectedOption: null,
    value: "140",
  },
  {
    group: "Unidad Exterior",
    procedure: "Consumo eléctrico MC",
    options: [],
    selectedOption: null,
    value: "12",
  },
  {
    group: "Unidad Interior",
    procedure: "Temperatura inyección",
    options: [],
    selectedOption: null,
    value: "12",
  },
  {
    group: "Unidad Interior",
    procedure: "Temperatura ambiente",
    options: [],
    selectedOption: null,
    value: "25",
  },
  {
    group: "Equipo",
    procedure: "Comentarios",
    options: [],
    selectedOption: null,
    value:
      "Reemplazo de compresor 2 quedando en servicio, se recomienda preventivamente hidrolavar con desincrustante ambas unidades y limpieza de tablero eléctrico ya que la temperatura de placa Inverter compresor 1 está un poco más alta de lo normal.",
  },
  {
    group: "Diagnóstico",
    procedure: "Estado final equipo",
    options: ["Aprobó", "Alerta", "Falló"],
    selectedOption: "Aprobó",
    value: null,
  },
];
export function TechOrderSubTaskList() {
  return (
    <div>
      <div className="grid grid-cols-3 w-full border border-collapse">
        <div className="col-span-3 border p-4 text-center text-lg font-bold">
          SUBTAREAS
        </div>
        <div className="font-bold border p-1">
          <p>Grupo/parte</p>
        </div>
        <div className="font-bold border p-1">
          <p>Procedimiento</p>
        </div>
        <div className="font-bold border p-1">
          <p>Resultado</p>
        </div>
        {subTasks.map(
          ({ group, procedure, options, selectedOption, value }) => (
            <Fragment key={procedure}>
              <div className="border p-1">
                <p>{group}</p>
              </div>
              <div className="border p-1">
                <p>{procedure}</p>
              </div>
              <div className="border p-1">
                {options?.length > 0 ? (
                  <div className="flex">
                    {options.map((option) => (
                      <div className="flex gap-4" key={option}>
                        <div className="form-control">
                          <label className="label cursor-pointer flex-row-reverse gap-1">
                            <span className="label-text">{option}</span>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="checkbox"
                              checked={option === selectedOption}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>{value}</div>
                )}
              </div>
            </Fragment>
          )
        )}
      </div>
    </div>
  );
}
