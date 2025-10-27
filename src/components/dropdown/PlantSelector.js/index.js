import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";

export function PlantSelector({ disabled, onSelect }) {
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
    <div className="join text-sm bg-base-content/10 w-full border border-base-content/20">
      <label className="label w-20 flex-none join-item input-sm px-2">
        Planta
      </label>
      <select
        className="select join-item select-sm w-20 flex-grow px-1"
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
