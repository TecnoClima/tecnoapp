import {
  // useEffect,
  useState,
} from "react";
import "./index.css";

export default function AddCylinder(props) {
  const { cylinderList, disabled, create } = props;
  const [cylinder, setCylinder] = useState({});
  const [max, setMax] = useState(0);
  const [min] = useState(2.2);
  const [errors, setErrors] = useState(undefined);

  function setCode(code) {
    const cylinder = {
      ...cylinderList.find((element) => element.code === code),
    };
    cylinder.init = cylinder.currentStock;
    setCylinder(code ? cylinder : {});
    setMax(cylinder ? cylinder.currentStock : 0);
  }

  function setInit(value) {
    const amount = Number(value);
    const newCylinder = { ...cylinder };
    delete newCylinder.final;
    delete newCylinder.total;
    if (amount > max) {
      setErrors(`El peso inicial no puede superar el stock (${max} kg.)`);
      delete newCylinder.init;
    } else if (amount < min) {
      setErrors(`El peso inicial no puede ser menor a ${min} kg.`);
      delete newCylinder.init;
    } else {
      setErrors(undefined);
      newCylinder.init = amount;
    }
    setCylinder(newCylinder);
  }

  function setFinal(value) {
    const amount = Number(value);
    const newCylinder = { ...cylinder };
    delete newCylinder.total;
    delete newCylinder.final;
    if (amount > cylinder.init) {
      setErrors(`El peso final no puede superar el peso inicial`);
    } else if (amount < min) {
      setErrors(`El peso final no puede ser menor a ${min} kg.`);
    } else {
      setErrors(undefined);
      newCylinder.final = amount;
      newCylinder.total = Number((newCylinder.init - amount).toFixed(1));
    }
    setCylinder(newCylinder);
  }

  function handleClick(e) {
    e.preventDefault();
    create && create(cylinder);
    setCylinder({ code: "" });
  }

  return (
    <form
      key={(JSON.stringify(cylinder) + "1")[0]}
      className="container"
      style={{ fontSize: "80%" }}
    >
      <div className="row fw-bold">
        <div className="col-4">Código (responsable)</div>
        <div className="col">Peso inicial</div>
        <div className="col">Peso final</div>
        <div className="col">Total Kg</div>
        <div className="col">Acción</div>
      </div>
      <div className="row">
        <select
          className="form-selector col-4 p-0"
          onChange={(event) => setCode(event.target.value)}
          disabled={disabled}
          defaultValue={cylinder.code}
        >
          <option value="">Elegir garrafa</option>
          {cylinderList.map((cylinder) => {
            return (
              <option key={cylinder.code} value={cylinder.code}>
                {`${cylinder.code} (${cylinder.owner})`}
              </option>
            );
          })}
        </select>

        <input
          type="number"
          className="form-input col p-0"
          onChange={(event) => setInit(event.target.value)}
          defaultValue={cylinder.currentStock}
          key={cylinder ? cylinder.currentStock : 2}
          disabled={!cylinder.code}
          placeholder="kg"
          min={min}
          max={max}
          step={0.1}
        />

        <input
          type="number"
          className="form-input col p-0"
          onChange={(event) => setFinal(event.target.value)}
          defaultValue={cylinder.final || 0}
          key={cylinder ? cylinder.code : 3}
          disabled={!cylinder.init}
          placeholder="kg"
          min={min}
          max={cylinder.init}
          step={0.1}
        />

        <input
          className="form-input col p-0"
          readOnly={true}
          defaultValue={cylinder.total}
          placeholder="gas (kg.)"
        />

        <div className="form-input col p-0">
          <button
            className="btn btn-success p-1 w-100"
            onClick={(e) => handleClick(e)}
            disabled={!cylinder.total}
          >
            <i className="fas fa-check" />
          </button>
        </div>
      </div>
      {errors && (
        <div className="row">
          <div className="alert alert-warning" role="alert">
            {errors}
          </div>
        </div>
      )}
    </form>
  );
}
