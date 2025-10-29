import { faSync, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchData,
  peopleActions,
  plantActions,
} from "../../actions/StoreActions";
import TextInput, { SelectInput } from "../forms/FormFields";
import { ErrorModal, SuccessModal } from "../warnings";

export function ReasignateOrders() {
  const { plantList } = useSelector((state) => state.plants);
  const { supervisors } = useSelector((state) => state.people);
  const [filters, setFilters] = useState({
    plant: "",
    supervisor: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [displayDetail, setDisplayDetail] = useState(false);
  const [orders, setOrders] = useState([]);
  const [newSupervisor, setNewSupervisor] = useState("");
  const [result, setResult] = useState({});
  const dispatch = useDispatch();

  async function handleSetValue(e) {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    if (name === "plant") {
      newFilters.supervisor = "";
      setNewSupervisor("");
      setOrders([]);
    }
    if (name === "supervisor") {
      const data = await fetchData({
        endpoint: `/workorder/supervisors?plant=${newFilters.plant}&supervisor=${value}`,
        method: "PUT",
      });
      setOrders(data.orders);
    }
    setFilters(newFilters);
  }

  async function handleReassignOrders() {
    if (!newSupervisor) return;
    const body = {
      supervisor: newSupervisor,
    };
    const data = await fetchData({
      endpoint: `/workorder/supervisors?plant=${filters.plant}&supervisor=${filters.supervisor}`,
      method: "PUT",
      body,
    });
    if (data.success) {
      setResult({
        success: true,
        message: `Se reasignaron ${data.count} del supervisor ${
          supervisors.find(
            (supervisor) => supervisor.idNumber === Number(filters.supervisor)
          )?.name
        } al supervisor ${
          supervisors.find(
            (supervisor) => supervisor.idNumber === newSupervisor
          )?.name
        }`,
      });
    }
    if (data.error) {
      setResult({ error: data.error });
    }
  }

  function handleClose() {
    setOpenModal(false);
    setResult({});
    setFilters({ plant: "", supervisor: "" });
    setNewSupervisor("");
    setOrders([]);
    setDisplayDetail(false);
  }

  useEffect(() => {
    if (!isFetching) {
      if (!plantList?.length) dispatch(plantActions.getPlants());
      if (!supervisors?.length) dispatch(peopleActions.getSupervisors());
      setIsFetching(true);
    }
  }, [isFetching, dispatch, plantList, supervisors]);

  const plantsOptions = plantList.map((plant) => ({
    value: plant.code,
    label: plant.name,
  }));

  const selectedPlant =
    plantList?.[0] &&
    filters.plant &&
    plantList.find((plant) => plant.code === filters.plant);

  const supervisorsOptions = supervisors.map((supervisor) => ({
    value: supervisor.idNumber,
    label: supervisor.name,
  }));

  return (
    <>
      <button
        className="btn btn-sm btn-info btn-outline"
        onClick={() => setOpenModal(true)}
      >
        <FontAwesomeIcon icon={faSync} />
        Reasignar OT
      </button>
      <dialog
        id="reassignate-orders"
        className="modal bg-neutral/50"
        open={openModal}
      >
        <div className="modal-box">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg">Reasignar OT</h3>
            <button className="p-1" onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <p className="py-4">
            Selecciona planta y supervisor para reasignar las órdenes de trabajo{" "}
            <b>pendientes</b> de ese supervisor a otro supervisor de la misma
            planta.
          </p>
          <div className="flex relative items-center gap-4">
            <SelectInput
              label="Planta"
              required={!filters.plant}
              name="plant"
              options={plantsOptions}
              className="flex gap-4"
              value={filters.plant}
              handleChange={handleSetValue}
            />
          </div>
          <div>
            <SelectInput
              label="Supervisor"
              name="supervisor"
              required={!filters.supervisor}
              options={supervisorsOptions}
              handleChange={handleSetValue}
              disabled={!selectedPlant}
              className="flex gap-4"
            />
          </div>
          {orders.length > 0 && (
            <>
              <div className="flex flex-wrap gap-4">
                <TextInput
                  label="Total de órdenes"
                  name="orders"
                  className="grid grid-cols-2 gap-4"
                  value={orders.length}
                  readOnly
                />

                <button
                  className="btn btn-sm btn-info flex-grow"
                  onClick={() => setDisplayDetail(!displayDetail)}
                >
                  {`${displayDetail ? `Ocultar` : `Ver`} detalle`}
                </button>
              </div>

              {displayDetail && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] bg-base-content/10 p-4 rounded-box">
                  {orders.map((order) => (
                    <div className="flex w-full justify-center">
                      <Link
                        className="hover:underline hover:text-info"
                        to={`/ots/detail/${order}`}
                        key={order}
                      >
                        {order}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <SelectInput
                  label="Asignar a"
                  name="newSupervisor"
                  options={supervisorsOptions.filter(
                    (supervisor) =>
                      supervisor.value !== Number(filters.supervisor)
                  )}
                  handleChange={(e) => setNewSupervisor(Number(e.target.value))}
                  disabled={!selectedPlant}
                  className=""
                />
              </div>
            </>
          )}

          <div className="modal-action">
            <button
              className="btn btn-sm btn-success"
              disabled={!filters.plant || !filters.supervisor || !newSupervisor}
              onClick={handleReassignOrders}
            >
              Reasignar
            </button>
          </div>
          {result.success && (
            <SuccessModal
              message={result.message}
              open={true}
              close={handleClose}
            />
          )}
          {result.error && (
            <ErrorModal
              message={result.error}
              open={true}
              close={() => setResult({})}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
