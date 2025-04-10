export default function OrderField({ field, name, value, options, onInput }) {
  return (
    <div className="join">
      <label
        className="label input-xs md:input-sm md:text-xs bg-neutral w-28 join-item font-bold border border-base-200"
        placeholder="Search"
      >
        {field}
      </label>
      {options ? (
        <select
          name={name}
          className="select select-xs md:select-sm select-bordered join-item flex-grow"
          onChange={onInput}
        >
          {options.map((o) => (
            <option value={o.id || o}>{o.name || o}</option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          className="input input-xs md:input-sm input-bordered join-item flex-grow"
          placeholder="Search"
          value={value}
          onChange={onInput}
        />
      )}
    </div>
  );
}
