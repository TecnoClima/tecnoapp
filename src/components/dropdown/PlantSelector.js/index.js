import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";
import { FormSelector } from "../../forms/FormInput";
import "./index.css";

export function PlantSelector({ disabled }) {
  const { plant } = useSelector((state) => state.data);
  const { plantList } = useSelector((state) => state.plants);
  const dispatch = useDispatch();

  useEffect(() => dispatch(plantActions.getPlants()), [dispatch]);

  function handleSelect(e) {
    e.preventDefault();
    const { value } = e.target;
    dispatch(
      plantActions.setPlant(plantList.find((p) => p.name === value) || {})
    );
  }

  return (
    <FormSelector
      name="plant"
      label="Planta"
      onSelect={handleSelect}
      value={plant.name}
      options={plantList.map((p) => p.name)}
      disabled={disabled}
    />
  );
}
