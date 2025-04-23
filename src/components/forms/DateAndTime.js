export default function DateAndTime({
  label,
  name,
  value,
  time,
  timeName,
  disabled,
  className = "",
  handleChange,
  max,
  maxTime
}) {
  return <label className={`form-control w-fit ${className}`}>
        <div className="label-sm flex justify-between">
          <span className="label-text font-bold">{label}</span>
          <span className="label-text-alt">Hora</span>
        </div>
        <div>
          <div className="flex input input-sm input-bordered p-0 mb-0 justify-between">
            <input
              type="date"
              name={name}
              disabled={disabled}
              className="input input-sm px-1"
              value={value}
              max={max}
              onChange={handleChange}
            />
            {timeName && (
              <input
                type="time"
                name={timeName}
                disabled={disabled}
                onChange={handleChange}
                className="input input-sm px-1 w-fit"
                value={time}
                max={maxTime}
              />
            )}
          </div>
        </div>
        {/* <div className="label">
          <span className="label-text-alt">Bottom Left label</span>
          <span className="label-text-alt">Bottom Right label</span>
        </div> */}
      </label>
}