import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions } from "../actions/StoreActions";

export const useGetPlantWorkers = () => {
  const dispatch = useDispatch();

  const { userData, workersList } = useSelector((state) => state.people);
  const plant = userData?.plant;

  useEffect(() => {
    // Solo fetch si no hay datos
    if (!workersList || workersList.length === 0) {
      dispatch(peopleActions.getWorkers(plant ? { plant } : undefined));
    }
  }, [dispatch, plant, workersList]);

  return workersList;
};
