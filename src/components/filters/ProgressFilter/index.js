import { useState, useEffect } from "react";
export default function ProgressFilter(props) {
  const { select } = props;
  const [range, setRange] = useState({ min: 0, max: 100 });
  const [inputValues, setInputValues] = useState({ min: "0", max: "100" });
  const [activeButton, setActiveButton] = useState("all");

  useEffect(() => {
    // Actualizar el botón activo basado en el rango
    if (range.min === 0 && range.max === 99) {
      setActiveButton("pendants");
    } else if (range.min === 100 && range.max === 100) {
      setActiveButton("completed");
    } else if (range.min === 0 && range.max === 100) {
      setActiveButton("all");
    } else {
      setActiveButton(null);
    }
  }, [range]);

  function maxValue(e) {
    const { value } = e.target;
    setInputValues((prev) => ({ ...prev, max: value }));

    // Solo actualizar el rango si el valor es válido
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < range.min) return;

    const nf = { ...range, max: numValue };
    setRange(nf);
    select && select(nf);
  }

  function minValue(e) {
    const { value } = e.target;
    setInputValues((prev) => ({ ...prev, min: value }));

    // Solo actualizar el rango si el valor es válido
    const numValue = Number(value);
    if (isNaN(numValue) || numValue > range.max) return;

    const nf = { ...range, min: numValue };
    setRange(nf);
    select && select(nf);
  }

  function handleMinBlur() {
    // Al perder el foco, asegurar que el valor sea válido
    const numValue = Number(inputValues.min);
    if (isNaN(numValue) || numValue < 0) {
      setInputValues((prev) => ({ ...prev, min: "0" }));
      const nf = { ...range, min: 0 };
      setRange(nf);
      select && select(nf);
    } else if (numValue > range.max) {
      setInputValues((prev) => ({ ...prev, min: range.max.toString() }));
      const nf = { ...range, min: range.max };
      setRange(nf);
      select && select(nf);
    } else {
      setInputValues((prev) => ({ ...prev, min: numValue.toString() }));
    }
  }

  function handleMaxBlur() {
    // Al perder el foco, asegurar que el valor sea válido
    const numValue = Number(inputValues.max);
    if (isNaN(numValue) || numValue > 100) {
      setInputValues((prev) => ({ ...prev, max: "100" }));
      const nf = { ...range, max: 100 };
      setRange(nf);
      select && select(nf);
    } else if (numValue < range.min) {
      setInputValues((prev) => ({ ...prev, max: range.min.toString() }));
      const nf = { ...range, max: range.min };
      setRange(nf);
      select && select(nf);
    } else {
      setInputValues((prev) => ({ ...prev, max: numValue.toString() }));
    }
  }

  function setPendants(e) {
    e.preventDefault();
    const range = { min: 0, max: 99 };
    setRange(range);
    setInputValues({ min: "0", max: "99" });
    select && select(range);
    setActiveButton("pendants");
  }

  function setCompleted(e) {
    e.preventDefault();
    const range = { min: 100, max: 100 };
    setRange(range);
    setInputValues({ min: "100", max: "100" });
    select && select(range);
    setActiveButton("completed");
  }

  function setAll(e) {
    e.preventDefault();
    const range = { min: 0, max: 100 };
    setRange(range);
    setInputValues({ min: "0", max: "100" });
    select && select(range);
    setActiveButton("all");
  }

  return (
    <div className="flex items-center flex-wrap gap-2 my-2">
      <div className="join text-sm  w-80 flex-grow items-center bg-base-content/10">
        <div htmlFor="location" className="plan-filter-label">
          Avance
        </div>
        <div className="join-item flex-grow px-1">min</div>

        <input
          className="input input-sm join-item flex-grow w-20 px-1 input-bordered"
          type="number"
          min="0"
          max={range.max}
          value={inputValues.min}
          onChange={minValue}
          onBlur={handleMinBlur}
        />
        <div className="join-item flex-grow px-1">max</div>
        <input
          className="input input-sm join-item flex-grow w-20 px-1 input-bordered"
          type="number"
          min={range.min}
          max="100"
          value={inputValues.max}
          onChange={maxValue}
          onBlur={handleMaxBlur}
        />
      </div>
      <div className="join w-80 flex-grow">
        <button
          className={`btn btn-error btn-sm join-item flex-grow ${
            activeButton !== "pendants" && "btn-outline"
          }`}
          onClick={setPendants}
        >
          Pendientes
        </button>
        <button
          className={`btn btn-success btn-sm join-item flex-grow ${
            activeButton !== "completed" && "btn-outline"
          }`}
          onClick={setCompleted}
        >
          Completas
        </button>
        <button
          className={`btn btn-info btn-sm join-item flex-grow ${
            activeButton !== "all" && "btn-outline"
          }`}
          onClick={setAll}
        >
          Todas
        </button>
      </div>
    </div>
  );
}
