import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { plantActions } from "../../../actions/StoreActions";

export function PlantSelector({ disabled, onSelect }) {
  const [searchParams] = useSearchParams();
  const plantCode = searchParams.get("plant");

  const { plantList, selectedPlant } = useSelector((state) => state.plants);
  const { userData } = useSelector((state) => state.people);
  const [requested, setRequested] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (plantCode && plantList[0]) {
      const plant = plantList.find((p) => p.code === plantCode);
      dispatch(plantActions.setPlant(plant));
    }
  }, [plantCode, dispatch, plantList]);

  const isAdmin = userData.access === "Admin";

  useEffect(() => {
    if (requested) return;
    if (!plantList[0]) {
      dispatch(plantActions.getPlants());
    }
    setRequested(true);
  }, [requested, plantList, dispatch]);

  useEffect(() => {
    if (!plantCode && !selectedPlant?.name && plantList[0]) {
      dispatch(
        plantActions.setPlant(
          isAdmin
            ? undefined
            : userData.plant
            ? plantList.find((p) => p.name === userData.plant)
            : undefined
        )
      );
    }
  }, [userData, selectedPlant, plantList, dispatch, isAdmin]);

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
        value={selectedPlant?.name}
        disabled={disabled}
        onChange={handleSelect}
      >
        <option value="">Seleccione</option>
        {plantList
          .map((p) => p.name)
          .map((element, index) => (
            <option value={element} key={index}>
              {element}
            </option>
          ))}
      </select>
    </div>
  );
}
