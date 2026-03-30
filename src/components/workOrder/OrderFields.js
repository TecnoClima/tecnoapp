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
}) {
  return (
    <div className={`join ${className || ""}`}>
      <label
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
      </label>
      {options ? (
        <select
          name={name}
          className="select select-xs md:select-sm select-bordered join-item flex-grow"
          onChange={onInput}
          value={value}
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
          value={value}
          onChange={onInput}
        />
      )}
    </div>
  );
}

// Local field wrappers that match OrderField's visual style but support
// type="date", type="number", and textarea.
export function DateField({ field, name, value, onInput }) {
  return (
    <div className="join">
      <div
        title={field}
        className="label input-xs md:input-sm text-ellipsis whitespace-nowrap overflow-hidden md:text-xs bg-neutral w-28 join-item font-bold border border-base-200"
      >
        {field}
      </div>
      <input
        type="date"
        name={name}
        className="input input-xs md:input-sm input-bordered join-item flex-grow"
        value={value || ""}
        onChange={onInput}
      />
    </div>
  );
}

export function NumberField({ field, name, value, onInput, placeholder }) {
  return (
    <div className="join">
      <div
        title={field}
        className="relative label input-xs md:input-sm md:text-xs bg-neutral w-28 join-item font-bold border border-base-200 text-ellipsis whitespace-nowrap overflow-hidden"
      >
        {field}
      </div>
      <input
        type="number"
        name={name}
        className="input input-xs md:input-sm input-bordered join-item flex-grow"
        placeholder={placeholder}
        value={value}
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
}) {
  return (
    <div className={`join join-vertical md:join-horizontal ${className}`}>
      <div className="label input-xs md:text-xs bg-neutral md:w-28 join-item font-bold border border-base-200 flex md:items-start md:pt-2 h-8 md:h-full">
        {field}
      </div>
      <textarea
        name={name}
        className="textarea textarea-bordered textarea-xs join-item flex-grow min-h-[3.5rem] resize-none"
        placeholder={placeholder}
        value={value}
        onChange={onInput}
      />
    </div>
  );
}
