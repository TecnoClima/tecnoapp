import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { colorByPercent } from "../../../utils/utils";
import "./index.css";

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
    <div className="container-fluid text-center">
      <div className="row">
        <div className="col-sm-11">
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
        </div>
        <div className="col-sm-1 fw-bolder fs-5">{value}%</div>
      </div>
      {errorCond && error && (
        <div className="row">
          <div className="errorMessage">{`El avance debe ser mayor que el actual (${min}%).`}</div>
        </div>
      )}
    </div>
  );
}
