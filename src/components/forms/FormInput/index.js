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
    <div className="input-group">
      <span
        className="input-group-text col-3 p-1 is-flex justify-content-center"
        style={{ minWidth: "fit-content" }}
      >
        {headersRef[label] || label}
      </span>
      <input
        className="form-control p-1"
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
    <div className="input-group">
      <label
        className="input-group-text col-3 p-1 is-flex justify-content-center"
        style={{ minWidth: "fit-content" }}
      >
        {headersRef[label] || label}
      </label>
      <select
        className="form-select p-1"
        name={name}
        defaultValue={defaultValue}
        readOnly={readOnly}
        value={value}
        disabled={disabled}
        onBlur={onBlur}
        onChange={(e) => onSelect && onSelect(e)}
      >
        <option className="w-auto" value="">
          Seleccione
        </option>
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
    <div className="input-group">
      <span
        className="input-group-text col-3 ps-1 pe-1 is-flex justify-content-center"
        style={{ minWidth: "fit-content" }}
      >
        {headersRef[label] || label}
      </span>
      <textarea
        className="form-control"
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
