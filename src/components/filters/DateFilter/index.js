import { useEffect } from "react";
import { useState } from "react";
import { appConfig } from "../../../config";
const { startingYear } = appConfig.values;
const currentYear = new Date().getFullYear();
const years = Array(currentYear - startingYear + 1);
for (let i = 0; i < years.length; i++) years[i] = currentYear - i;
const months = Array(12);
for (let i = 0; i < months.length; i++) months[i] = i;

export default function DateFilter(props) {
  const [filters, setFilters] = useState({});
  const [days, setDays] = useState([]);

  function getDays(year, month) {
    if (!month || !year) return;
    const date = new Date(year, month + 1, 1);
    date.setDate(date.getDate() - 1);
    const days = Array.from(
      { length: date.getDate() },
      (_, index) => index + 1
    );
    setDays(days);
  }

  function setFilter(e) {
    e.preventDefault();
    const f = { ...filters };
    const { name, value } = e.target;
    if (value) {
      f[name] = value;
    } else {
      delete f[name];
      if (["month", "year"].includes(name)) delete f.day;
      if (name === "year") delete f.month;
    }
    setFilters(f);
    props.select && props.select(f);
  }

  useEffect(
    () => getDays(Number(filters.year), Number(filters.month)),
    [filters.year, filters.month]
  );

  return (
    <div className="container mb-2 col-md-3">
      <div className="row">
        <div className="col">
          <div className="input-group">
            <span class="input-group-text py-0 px-1">FECHA</span>
            <select
              name="year"
              className="form-control p-0 pe-3"
              value={filters.year}
              onChange={setFilter}
            >
              <option value="">Año</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              name="month"
              className="form-control p-0 pe-3"
              value={filters.month}
              disabled={!filters.year}
              onChange={setFilter}
            >
              <option value="">Mes</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m + 1}
                </option>
              ))}
            </select>
            <select
              name="day"
              className="form-control p-0 pe-3"
              value={filters.day}
              disabled={!filters.month}
              onChange={setFilter}
            >
              <option value="">Día</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
