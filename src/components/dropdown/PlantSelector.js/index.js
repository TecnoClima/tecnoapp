import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlantName } from "../../../actions/dataActions";
import { plantActions } from "../../../actions/StoreActions";
import { FormSelector } from "../../forms/FormInput";
import "./index.css";

export function PlantSelector({ defaultValue, disabled, onSelect }) {
  const { plant } = useSelector((state) => state.data);
  const { plantList } = useSelector((state) => state.plants);
  const [value, setValue] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => dispatch(plantActions.getPlants()), [dispatch]);
  useEffect(() => setValue(plant), [plant]);
  useEffect(() => !!defaultValue && setValue(defaultValue), [defaultValue]);

  function handleSelect(e) {
    e.preventDefault();
    const { value } = e.target;
    dispatch(setPlantName(value));
    onSelect && onSelect(e);
  }

  return (
    <FormSelector
      name="plant"
      label="Planta"
      onSelect={handleSelect}
      defaultValue={defaultValue || value}
      options={plantList.map((p) => p.name)}
      disabled={disabled}
    />
  );
}
