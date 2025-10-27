import { useEffect, useState } from "react";
import { appConfig } from "../../../config";
const { startingYear } = appConfig.values;
const currentYear = new Date().getFullYear();
const years = Array(currentYear - startingYear + 1);
for (let i = 0; i < years.length; i++) years[i] = currentYear - i;
const months = Array(12);
for (let i = 0; i < months.length; i++) months[i] = i;

export default function DateFilter(props) {
  const [filters, setFilters] = useState({ year: new Date().getFullYear() });
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
    <div className="join">
      <label className="label input-xs md:input-sm bg-base-content/10 w-28 join-item border border-base-content/20 min-w-fit">
        Fecha
      </label>
      <select
        name="year"
        value={filters.year}
        onChange={setFilter}
        className="select select-bordered select-xs md:select-sm join-item"
      >
        {years.map((y, i) => (
          <option key={i}>{y}</option>
        ))}
      </select>
      <select
        name="month"
        value={filters.month}
        onChange={setFilter}
        disabled={!filters.year}
        className="select select-bordered select-xs md:select-sm join-item"
      >
        <option value="">Mes</option>
        {months.map((m, i) => (
          <option key={i} value={m}>
            {m + 1}
          </option>
        ))}
      </select>
      <select
        name="day"
        value={filters.day}
        onChange={setFilter}
        disabled={!filters.month}
        className="select select-bordered select-xs md:select-sm join-item"
      >
        <option value="">Día</option>
        {days.map((d, i) => (
          <option key={i}>{d}</option>
        ))}
      </select>
    </div>
  );
}
