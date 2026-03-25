import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { optionActions } from "../../actions/StoreActions";
import { appConfig } from "../../config";
import { CreateOrderOptionValues } from "./CreateOrderOptionValues";
import { OptionCard } from "./OptionCard";
import { SubTaskList } from "./SubTaskList";
const { headersRef } = appConfig;

const RESULT_TYPES = [
  { value: "boolean", label: "Sí / No" },
  { value: "number", label: "Número" },
  { value: "text", label: "Texto" },
  { value: "gps", label: "GPS" },
];

const GROUPS = ["Sitio", "Equipo"];

const emptyTask = () => ({
  group: "Equipo",
  procedure: "",
  resultType: "boolean",
});

export function SubtaskOptions() {
  const { list: optionList } = useSelector((state) => state.options);
  const dispatch = useDispatch();
  const targetCollection = "subTask";
  useEffect(
    () => dispatch(optionActions.getList(targetCollection)),
    [dispatch],
  );
  const types = [...new Set(optionList.map((o) => o.type))];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {types.map((type) => {
          const typeOptions = optionList.filter((o) => o.type === type);
          return (
            <OptionCard
              key={type}
              options={typeOptions}
              targetCollection={targetCollection}
              type={type}
            />
          );
        })}
        <SubTaskList />
      </div>
    </div>
  );
}

// export function SubtaskOptions({ onSubmit }) {
//   const [name, setName] = useState("");
//   const [tasks, setTasks] = useState([emptyTask()]);

//   // agregar tarea
//   const addTask = () => {
//     setTasks([...tasks, emptyTask()]);
//   };

//   // eliminar tarea
//   const removeTask = (index) => {
//     const updated = tasks.filter((_, i) => i !== index);
//     setTasks(updated);
//   };

//   // actualizar campo
//   const updateTask = (index, field, value) => {
//     const updated = [...tasks];
//     updated[index][field] = value;
//     setTasks(updated);
//   };

//   // mover arriba
//   const moveUp = (index) => {
//     if (index === 0) return;
//     const updated = [...tasks];
//     [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
//     setTasks(updated);
//   };

//   // mover abajo
//   const moveDown = (index) => {
//     if (index === tasks.length - 1) return;
//     const updated = [...tasks];
//     [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
//     setTasks(updated);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!name.trim()) {
//       alert("El nombre es obligatorio");
//       return;
//     }

//     if (tasks.some((t) => !t.procedure.trim())) {
//       alert("Todas las tareas deben tener procedimiento");
//       return;
//     }

//     onSubmit({ name, tasks });
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ maxWidth: 800, margin: "0 auto" }}>
//       <h2>Crear Template</h2>

//       {/* Nombre */}
//       <div>
//         <label>Nombre del template</label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           style={{ width: "100%", marginBottom: 20 }}
//         />
//       </div>

//       {/* Lista de tareas */}
//       <h3>Tareas</h3>

//       {tasks.map((task, index) => (
//         <div
//           key={index}
//           style={{
//             border: "1px solid #ccc",
//             padding: 10,
//             marginBottom: 10,
//             borderRadius: 5,
//           }}
//         >
//           <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
//             {/* Grupo */}
//             <select
//               value={task.group}
//               onChange={(e) => updateTask(index, "group", e.target.value)}
//             >
//               {GROUPS.map((g) => (
//                 <option key={g} value={g}>
//                   {g}
//                 </option>
//               ))}
//             </select>

//             {/* Tipo */}
//             <select
//               value={task.resultType}
//               onChange={(e) => updateTask(index, "resultType", e.target.value)}
//             >
//               {RESULT_TYPES.map((t) => (
//                 <option key={t.value} value={t.value}>
//                   {t.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Procedimiento */}
//           <input
//             type="text"
//             placeholder="Descripción de la tarea"
//             value={task.procedure}
//             onChange={(e) => updateTask(index, "procedure", e.target.value)}
//             style={{ width: "100%", marginBottom: 10 }}
//           />

//           {/* Botones */}
//           <div style={{ display: "flex", gap: 10 }}>
//             <button type="button" onClick={() => moveUp(index)}>
//               ↑
//             </button>
//             <button type="button" onClick={() => moveDown(index)}>
//               ↓
//             </button>
//             <button
//               type="button"
//               onClick={() => removeTask(index)}
//               style={{ color: "red" }}
//             >
//               Eliminar
//             </button>
//           </div>
//         </div>
//       ))}

//       {/* Agregar */}
//       <button type="button" onClick={addTask}>
//         ➕ Agregar tarea
//       </button>

//       <hr />

//       <button type="submit">Guardar Template</button>
//     </form>
//   );
// }
