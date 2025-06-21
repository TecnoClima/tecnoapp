import "./index.css";
import { appConfig } from "../../../config";
const { headersRef } = appConfig;

export function FormInput(props) {
  const {
    label,
    type,
    disabled,
    defaultValue,
    ref,
    value,
    min,
    max,
    step,
    changeInput,
    onBlur,
    name,
    readOnly,
    placeholder,
  } = props;
  return (
    <>
      <div className="join w-full">
        <label
          className="label input-xs md:input-sm bg-base-content/10 w-28 join-item border border-base-content/20 min-w-fit"
          placeholder="Search"
        >
          {headersRef[label] || label}
        </label>
        <input
          className="input input-xs md:input-sm input-bordered join-item flex-grow"
          autoComplete="off"
          disabled={disabled}
          defaultValue={defaultValue}
          readOnly={readOnly}
          ref={ref}
          value={value}
          placeholder={placeholder}
          type={type || "text"}
          name={name}
          min={type === "number" ? min : undefined}
          max={["number", "date"].includes(type) ? max : undefined}
          step={["number", "date"].includes(type) ? step : undefined}
          onBlur={onBlur}
          onChange={(e) => changeInput && changeInput(e)}
        />
      </div>
    </>
  );
}

export function FormSelector(props) {
  const {
    label,
    defaultValue,
    valueField,
    name,
    captionField,
    options,
    onSelect,
    onBlur,
    readOnly,
    disabled,
    value,
  } = props;
  return (
    <div className="join text-sm bg-base-content/10 w-full border border-base-content/20">
      <label
        htmlFor={name}
        className="label w-20 flex-none join-item input-sm px-2"
      >
        {headersRef[label] || label}
      </label>

      <select
        className="select join-item select-sm w-20 flex-grow px-1"
        name={name}
        defaultValue={defaultValue}
        readOnly={readOnly}
        value={value}
        disabled={disabled}
        onBlur={onBlur}
        onChange={(e) => onSelect && onSelect(e)}
      >
        <option className="w-auto">Seleccione</option>
        {options &&
          options.map((element, index) => (
            <option
              value={valueField ? element[valueField] : element}
              key={index}
            >
              {captionField ? element[captionField] : element}
            </option>
          ))}
      </select>
    </div>
  );
}

export function FormTextArea({
  label,
  disabled,
  defaultValue,
  changeInput,
  name,
  readOnly,
  value,
  placeholder,
}) {
  // const {label, disabled, defaultValue, changeInput, name, readOnly, placeholder}=props
  return (
    <div className="join join-vertical md:join-horizontal text-sm bg-base-content/10 w-full border border-base-content/20">
      <span className="label w-20 flex-none join-item input-sm px-2 min-w-fit">
        {headersRef[label] || label}
      </span>
      <textarea
        className="textarea join-item flex-grow"
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        type={"text"}
        name={name}
        onChange={(e) => changeInput && changeInput(e)}
        // onBlur={(e) => changeInput && changeInput(e)}
      />
    </div>
  );
}
