import { useState } from "react";
export default function ProgressFilter(props) {
  const { select } = props;
  const [range, setRange] = useState({ min: 0, max: 100 });

  function maxValue(e) {
    const { value } = e.target;
    if (value < range.min) return;
    const nf = { ...range, max: Number(value) };
    setRange(nf);
    select && select(nf);
  }
  function minValue(e) {
    const { value } = e.target;
    if (value > range.max) return;
    const nf = { ...range, min: Number(value) };
    setRange(nf);
    select && select(nf);
  }

  function setPendants(e) {
    e.preventDefault();
    const range = { min: 0, max: 99 };
    setRange(range);
    select && select(range);
  }
  function setCompleted(e) {
    e.preventDefault();
    const range = { min: 100, max: 100 };
    setRange(range);
    select && select(range);
  }
  function setAll(e) {
    e.preventDefault();
    const range = { min: 0, max: 100 };
    setRange(range);
    select && select(range);
  }

  return (
    <div className="input-group">
      <span className="input-group-text py-0 px-1 fw-bold">AVANCE</span>
      <input
        className="form-control px-1 py-0 text-center"
        type="number"
        min="0"
        max={range.max}
        value={range.min}
        onChange={minValue}
      />
      <input
        className="form-control px-1 py-0 text-center"
        type="number"
        min={range.min}
        max="100"
        value={range.max}
        onChange={maxValue}
      />
      <button className="btn btn-danger py-0" onClick={setPendants}>
        Pendientes
      </button>
      <button className="btn btn-success py-0" onClick={setCompleted}>
        Completas
      </button>
      <button className="btn btn-info py-0" onClick={setAll}>
        Todas
      </button>
    </div>
  );
}
