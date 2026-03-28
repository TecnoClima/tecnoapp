import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextInput from "../forms/FormFields";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export function SearchInput({ searchKey, setSearchKey }) {
  return (
    <div className="flex gap-2 items-center text-base-content w-full">
      <TextInput
        className="flex-grow"
        handleChange={(e) => setSearchKey(e.target.value)}
        value={searchKey}
        placeholder="3 caracteres o más"
      />
      <FontAwesomeIcon icon={faSearch} className="text-white" />
    </div>
  );
}
