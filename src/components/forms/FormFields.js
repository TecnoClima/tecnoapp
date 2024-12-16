export default function TextInput({
  label,
  name,
  value,
  className = "",
  type = "text",
  handleChange,
  placeholder = "Escribe aqui",
}) {
  return (
    <label className={`form-control w-full max-w-xs ${className}`}>
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
      />
    </label>
  );
}
