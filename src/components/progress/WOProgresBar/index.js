import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { colorByPercent } from "../../../utils/utils";
import "./index.css";
import ErrorMessage from "../../forms/ErrorMessage";

export default function WOProgress(props) {
  const { select, errorCond, disabled, min, max } = props;
  const { userData } = useSelector((state) => state.people);
  const [value, setValue] = useState("" + (props.value || 0));
  const [style, setStyle] = useState({});
  const [error, setError] = useState(false);

  useEffect(
    () => setStyle({ "--main-bg-color": colorByPercent(Number(value)) }),
    [value]
  );
  useEffect(() => setValue(`${props.value}`), [props.value]);

  function handleChange(e) {
    const newValue = Number(e.target.value);
    const value = `${
      userData.access === "Admin" ? newValue : Math.max(newValue, min)
    }`;
    setError(newValue <= min);
    setValue(`${Math.max(value, min)}`);
    select({ name: "completed", value });
  }

  return (
    <div className="relative flex-grow">
      <div className="flex items-center gap-2">
        <input
          className="WOProgress"
          key={style ? JSON.stringify(style)[0] : 0}
          type="range"
          value={value}
          onChange={(e) => handleChange(e)}
          max={max}
          disabled={disabled}
          style={style}
        />
        <div className="font-bold">{value}%</div>
      </div>
      {errorCond && error && (
        <ErrorMessage>
          {`El avance debe ser mayor que el actual (${min}%).`}
        </ErrorMessage>
      )}
    </div>
  );
}
