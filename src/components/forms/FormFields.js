export default function TextInput({
  label,
  name,
  value,
  className = "",
  type = "text",
  handleChange,
  placeholder = "Escribe aqui",
  readOnly,
}) {
  return (
    <label className={`w-full max-w-xs ${className}`}>
      {label && (
        <div className="label">
          <span className="label-text font-bold">{label}</span>
        </div>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="custom-input-text w-full max-w-xs"
        onChange={handleChange}
        value={value}
        readOnly={readOnly}
      />
    </label>
  );
}

export function NumInput({
  label,
  name,
  value,
  className = "",
  handleChange,
  placeholder,
  readOnly,
  step,
  onInput,
}) {
  console.log(value);
  return (
    <label className={`w-full max-w-xs ${className}`}>
      {label && (
        <div className="label">
          <span className="label-text font-bold">{label}</span>
        </div>
      )}
      <input
        onInput={onInput}
        name={name}
        type="number"
        placeholder={placeholder}
        className="custom-input-text w-full max-w-xs"
        onChange={handleChange}
        value={value}
        readOnly={readOnly}
        step={step}
      />
    </label>
  );
}

export function SelectInput({
  label,
  name,
  value,
  className = "",
  options,
  handleChange,
}) {
  return (
    <label className={`w-full max-w-xs ${className}`}>
      {label && (
        <div className="label">
          <span className="label-text font-bold">{label}</span>
        </div>
      )}
      <select
        className="select select-sm custom-input-text w-full pl-8"
        onChange={handleChange}
        name={name}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
