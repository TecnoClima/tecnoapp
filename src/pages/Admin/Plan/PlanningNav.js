import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setYear } from "../../../actions/dataActions.js";
import { PlantSelector } from "../../../components/dropdown/PlantSelector.js/index.js";
import { FormSelector } from "../../../components/forms/FormInput/index.js";

export default function PlanningNav({ routes }) {
  const { year } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const thisYear = new Date().getFullYear();
  const years = [];
  for (let i = thisYear - 3; i <= thisYear + 1; i++) {
    years.push(i);
  }

  return (
    <div className="flex flex-col md:flex-row w-full gap-2">
      <div className="flex flex-col sm:flex-row md:flex-grow gap-2">
        <div className="flex-grow">
          <PlantSelector />
        </div>
        <div>
          <FormSelector
            label="Año"
            name="year"
            value={year}
            options={years}
            onSelect={(e) => dispatch(setYear(e.target.value))}
          />
        </div>
      </div>
      <div role="tablist" className="tabs tabs-lifted md:flex-grow">
        {routes.map(({ path, text }, index) => (
          <NavLink
            key={index}
            className={({ isActive }) =>
              `tab text-center px-0 ${
                isActive
                  ? "tab-active bg-gradient-to-b from-base-200 to-transparent"
                  : "bg-gradient-to-b from-base-content/5 to-transparent"
              }`
            }
            to={path}
          >
            {text}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
