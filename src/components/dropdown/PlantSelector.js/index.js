import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";
// import { FormSelector } from "../../forms/FormInput";
import "./index.css";

export function PlantSelector(props) {
  const { disabled, onSelect } = props;
  // const { plant } = useSelector((state) => state.data);
  const { plantList, selectedPlant } = useSelector((state) => state.plants);
  const { userData } = useSelector((state) => state.people);
  const [requested, setRequested] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (requested) return;
    if (!plantList[0]) {
      dispatch(plantActions.getPlants());
    }
    setRequested(true);
  }, [requested, plantList, dispatch]);

  useEffect(() => {
    if (!selectedPlant.name && plantList[0]) {
      dispatch(
        plantActions.setPlant(
          userData.plant
            ? plantList.find((p) => p.name === userData.plant)
            : plantList[0]
        )
      );
    }
  }, [userData, selectedPlant, plantList, dispatch]);

  function handleSelect(e) {
    e.preventDefault();
    const { value } = e.target;
    const plant = plantList.find((p) => p.name === value) || { name: "" };
    onSelect && onSelect(plant);
    dispatch(plantActions.setPlant(plant));
  }

  return (
    <div className="input-group">
      <label
        className="input-group-text col-3 p-1 is-flex justify-content-center"
        style={{ minWidth: "fit-content" }}
      >
        Planta
      </label>
      <select
        className="form-select p-1"
        name="plant"
        value={selectedPlant.name}
        disabled={disabled}
        onChange={handleSelect}
      >
        {plantList
          .map((p) => p.name)
          .map((element, index) => (
            <option value={element} key={index}>
              {element}
            </option>
          ))}
      </select>
    </div>
    // <FormSelector
    //   name="plant"
    //   label="Planta"
    //   onSelect={handleSelect}
    //   value={selectedPlant.name}
    //   options={plantList.map((p) => p.name)}
    //   disabled={disabled}
    // />
  );
}
