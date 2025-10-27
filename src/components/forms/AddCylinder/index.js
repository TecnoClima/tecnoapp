import {
  // useEffect,
  useState,
} from "react";
import "./index.css";
import TextInput, { NumInput, SelectInput } from "../FormFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
    }
    newCylinder.final = amount;
    newCylinder.total = Number((newCylinder.init - amount).toFixed(1));
    setCylinder(newCylinder);
  }

  function handleClick(e) {
    e.preventDefault();
    create && create(cylinder);
    setCylinder({ code: "", total: "" });
  }

  return (
    <form key={(JSON.stringify(cylinder) + "1")[0]} className="w-full text-xs">
      <div className="flex flex-wrap w-full fw-bold sm:items-stretch gap-1">
        <div className="w-full sm:w-1/3 flex-grow">
          <div>Código (responsable)</div>
          <SelectInput
            handleChange={(e) => setCode(e.target.value)}
            options={[
              { value: "", label: "Sin Seleccionar" },
              ...cylinderList.map((c) => ({
                value: c.code,
                label: `${c.code} (${c.owner})`,
              })),
            ]}
            disabled={disabled}
            value={cylinder.code || ""}
          />
        </div>
        <div className="w-20 flex-grow sm:flex-grow-0">
          <div>Peso inicial</div>
          <NumInput
            handleChange={(e) => setInit(e.target.value)}
            value={cylinder.currentStock}
            key={cylinder ? cylinder.currentStock : 2}
            disabled={!cylinder.code}
            min={min}
            max={max}
            step={0.1}
          />
        </div>
        <div className="w-20 flex-grow sm:flex-grow-0">
          <div>Peso final</div>
          <NumInput
            onInput={(e) => setFinal(e.target.value)}
            // handleChange={(e) => setFinal(e.target.value)}
            value={cylinder.final || ""}
            key={cylinder ? cylinder.code : 3}
            disabled={!cylinder.init}
            min={min}
            max={cylinder.init}
            step={0.1}
          />
        </div>
        <div className="w-16 flex-grow sm:flex-grow-0">
          <div>Total Kg</div>
          <TextInput
            readOnly={true}
            value={cylinder.total}
            placeholder="gas (kg.)"
          />
        </div>
        <div className="flex flex-col w-10">
          <div>Acción</div>
          <button
            className="btn btn-xs btn-success w-fit px-1 m-auto"
            onClick={(e) => handleClick(e)}
            disabled={!cylinder.total || errors}
          >
            <FontAwesomeIcon icon={faCheck} className="text-base" />
          </button>
        </div>
      </div>
      <div className="flex">
        {/* <input
          type="number"
          className="form-input flex-grow p-0"
          onChange={(event) => setInit(event.target.value)}
          defaultValue={cylinder.currentStock}
          key={cylinder ? cylinder.currentStock : 2}
          disabled={!cylinder.code}
          placeholder=""
          min={min}
          max={max}
          step={0.1}
        /> 
        
        <input
          type="number"
          className="form-input flex-grow p-0"
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
          className="form-input flex-grow p-0"
          readOnly={true}
          defaultValue={cylinder.total}
          placeholder="gas (kg.)"
        /> */}

        <div className="flex w-10 justify-center items-center"></div>
      </div>
      {errors && (
        <div className="alert alert-warning py-1 px-2 rounded-md" role="alert">
          {errors}
        </div>
      )}
    </form>
  );
}
