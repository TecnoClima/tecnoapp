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
        className="input input-bordered w-full max-w-xs input-sm text-base-content focus-visible:outline-none"
        onChange={handleChange}
        value={value}
      />
    </label>
  );
}
