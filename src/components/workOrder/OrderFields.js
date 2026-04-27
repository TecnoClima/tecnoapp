export function OrderField({
  field,
  name,
  className,
  value = "",
  options,
  onInput,
  placeholder,
  displayEmpty,
  required,
  readOnly,
}) {
  return (
    <div className={`join ${className || ""}`}>
      <div
        className="relative label input-xs md:input-sm md:text-xs bg-neutral w-28 join-item font-bold border border-base-200 text-ellipsis whitespace-nowrap overflow-hidden"
        placeholder="Search"
      >
        {field}
        {required && (
          <div
            title="campo requerido"
            className="absolute top-1 right-1 badge badge-primary badge-xs font-normal"
          >
            Req
          </div>
        )}
      </div>
      {options ? (
        <select
          name={name}
          className="select select-xs md:select-sm select-bordered join-item flex-grow"
          onChange={onInput}
          value={value || ""}
          disabled={readOnly}
        >
          {displayEmpty && <option value="">Seleccionar...</option>}
          {options.map((o) => (
            <option key={o.id || o} value={o.id || o}>
              {o.name || o}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          className="input input-xs md:input-sm input-bordered join-item flex-grow"
          placeholder={placeholder}
          value={value || ""}
          readOnly={readOnly}
          onChange={onInput}
        />
      )}
    </div>
  );
}

// Local field wrappers that match OrderField's visual style but support
// type="date", type="number", and textarea.
// export function DateField({ field, name, value, onInput, required }) {
//   return (
//     <div className="join">
//       <div
//         title={field}
//         className="relative label input-xs md:input-sm text-ellipsis whitespace-nowrap overflow-hidden md:text-xs bg-neutral w-28 join-item font-bold border border-base-200"
//       >
//         {field}
//         {required && (
//           <div
//             title="campo requerido"
//             className="absolute top-1 right-1 badge badge-primary badge-xs font-normal"
//           >
//             Req
//           </div>
//         )}
//       </div>
//       <input
//         type="date"
//         name={name}
//         className="input input-xs md:input-sm input-bordered join-item flex-grow"
//         value={value || ""}
//         onChange={onInput}
//       />
//     </div>
//   );
// }

// type DateFieldProps = {
//   field: string;
//   name: string;
//   value?: Date;
//   onInput: (value: Date | null) => void;
//   required?: boolean;
//   addTime?: boolean;
// };

function formatForInput(value, addTime) {
  if (!value) return "";
  const date = new Date(value);

  const pad = (n) => String(n).padStart(2, "0");

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());

  if (!addTime) return `${yyyy}-${mm}-${dd}`;

  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function parseFromInput(value, addTime) {
  if (!value) return null;

  if (!addTime) {
    return new Date(value + "T00:00");
  }

  return new Date(value);
}

export function DateField({
  field,
  name,
  value,
  onInput,
  required,
  addTime = false,
}) {
  return (
    <div className="join">
      <div
        title={field}
        className="relative label input-xs md:input-sm text-ellipsis whitespace-nowrap overflow-hidden md:text-xs bg-neutral w-28 join-item font-bold border border-base-200"
      >
        {field}
        {required && (
          <div className="absolute top-1 right-1 badge badge-primary badge-xs font-normal">
            Req
          </div>
        )}
      </div>

      <input
        type={addTime ? "datetime-local" : "date"}
        name={name}
        className="input input-xs md:input-sm input-bordered join-item flex-grow"
        value={value ? formatForInput(value, addTime) : ""}
        onChange={(e) => {
          const parsed = parseFromInput(e.target.value, addTime);

          onInput({
            target: {
              name,
              value: parsed,
            },
          });
        }}
        required={required}
      />
    </div>
  );
}

export function NumberField({
  field,
  name,
  value,
  onInput,
  placeholder,
  required,
}) {
  return (
    <div className="join">
      <div
        title={field}
        className="relative label input-xs md:input-sm md:text-xs bg-neutral w-28 join-item font-bold border border-base-200 text-ellipsis whitespace-nowrap overflow-hidden"
      >
        {field}
        {required && (
          <div
            title="campo requerido"
            className="absolute top-1 right-1 badge badge-primary badge-xs font-normal"
          >
            Req
          </div>
        )}
      </div>
      <input
        type="number"
        name={name}
        className="input input-xs md:input-sm input-bordered join-item flex-grow"
        placeholder={placeholder}
        value={value || ""}
        onChange={onInput}
      />
    </div>
  );
}

export function TextAreaField({
  field,
  className,
  name,
  value,
  onInput,
  placeholder,
  required,
}) {
  return (
    <div className={`join join-vertical md:join-horizontal ${className}`}>
      <div className="relative label input-xs md:text-xs bg-neutral md:w-28 join-item font-bold border border-base-200 flex md:items-start md:pt-2 h-8 md:h-full">
        {field}
        {required && (
          <div
            title="campo requerido"
            className="absolute top-1 right-1 badge badge-primary badge-xs font-normal"
          >
            Req
          </div>
        )}
      </div>
      <textarea
        name={name}
        className="textarea textarea-bordered textarea-xs join-item flex-grow min-h-[3.5rem] resize-none"
        placeholder={placeholder}
        value={value || ""}
        onChange={onInput}
      />
    </div>
  );
}
