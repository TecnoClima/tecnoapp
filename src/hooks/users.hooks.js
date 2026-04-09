import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions } from "../actions/StoreActions";

export const useGetPlantWorkers = ({ plant: devicePlant }) => {
  const dispatch = useDispatch();

  const { userData, workersList } = useSelector((state) => state.people);
  const plant = userData?.plant || devicePlant;

  useEffect(() => {
    // Solo fetch si no hay datos
    if (!workersList || workersList.length === 0) {
      dispatch(peopleActions.getWorkers(plant ? { plant } : undefined));
      dispatch(peopleActions.getSupervisors(plant ? { plant } : undefined));
    }
  }, [dispatch, plant, workersList]);
};
