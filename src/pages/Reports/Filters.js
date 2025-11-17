import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { PlantSelector } from "../../components/dropdown/PlantSelector.js";
import { FormInput } from "../../components/forms/FormInput";

export function ReportFilters({ filters, setFilters }) {
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate(`/reportes?${new URLSearchParams(filters).toString()}`);
  };
  function handleSetValue(name, value) {
    setFilters({ ...filters, [name]: value });
  }

  return (
    <div className="flex w-full gap-4">
      <PlantSelector
        onSelect={(plant) => handleSetValue("plant", plant.code)}
      />
      <FormInput
        label="Desde"
        name="from"
        type="date"
        value={filters.from}
        changeInput={(e) => handleSetValue("from", e.target.value)}
      />
      <FormInput
        label="Hasta"
        name="to"
        type="date"
        value={filters.to}
        changeInput={(e) => handleSetValue("to", e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="btn btn-sm btn-primary btn-outline"
        disabled={!filters.plant || !filters.from || !filters.to}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
}
