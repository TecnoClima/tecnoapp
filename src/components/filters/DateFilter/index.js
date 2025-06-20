import { useEffect } from "react";
import { useState } from "react";
import { appConfig } from "../../../config";
import { FilterSelect } from "../DeviceFilters/newFilters";
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
    <div className="sm:join text-sm bg-base-content/10 w-full sm:max-w-80">
      <label htmlFor="date" className="plan-filter-label">
        Fecha
      </label>
      <div className="flex flex-grow">
        <FilterSelect
          id="year"
          value={filters.year}
          options={years}
          onSelect={setFilter}
          noLabel
        />
        <FilterSelect
          id="month"
          value={filters.month}
          options={months}
          onSelect={setFilter}
          disabled={!filters.year}
          noLabel
          placeholder="Mes"
        />
        <FilterSelect
          id="day"
          value={filters.day}
          options={days}
          onSelect={setFilter}
          disabled={!filters.month}
          noLabel
          placeholder="Día"
        />
      </div>
    </div>
  );
}
