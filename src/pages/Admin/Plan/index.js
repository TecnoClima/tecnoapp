import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setYear } from "../../../actions/dataActions.js";
import { PlantSelector } from "../../../components/dropdown/PlantSelector.js";
import { FormSelector } from "../../../components/forms/FormInput/index.js";
import PlanCalendar from "../../../components/plan/Calendar";
import ProgramManagement from "../../../components/plan/ManagePrograms";
import PlanTask from "../../../components/plan/Tasks";
import "./index.css";

export default function AdminPlan() {
  const steps = ["Acciones", "Calendario", "Programas"];
  const { plant, year } = useSelector((state) => state.data);

  const [step, setStep] = useState(steps[0]);
  const [years, setYears] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const thisYear = new Date().getFullYear();
    let years = [];
    for (let i = 2020; i <= thisYear + 1; i++) {
      years = [...years, i];
    }
    setYears(years);
  }, []);

  return (
    <div className="container-fluid p-0 mb-1 bg-form h-full d-flex flex-column">
      <div className="row m-0">
        <div className="col-sm-6 p-0 d-flex">
          <PlantSelector />
          <FormSelector
            label="Año"
            name="year"
            value={year}
            options={years}
            onSelect={(e) => dispatch(setYear(e.target.value))}
          />
        </div>
        <div className="col-sm-6">
          <ul className="nav nav-tabs">
            {steps.map((option, index) => (
              <li
                key={index}
                className={`nav-item nav-link col text-center px-0 ${
                  step === option ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => setStep(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="row m-0 flex-grow-1">
        {step === steps[0] && <PlanTask year={year} />}
        {step === steps[1] && <PlanCalendar />}
        {step === steps[2] && <ProgramManagement plant={plant} />}
      </div>
    </div>
  );
}
