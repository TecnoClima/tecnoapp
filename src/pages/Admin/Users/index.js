import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getPlantList } from "../../../actions/dataActions";
import { peopleActions, plantActions } from "../../../actions/StoreActions";
import UserCard from "../../../components/Cards/UserCards/UserCard";
// import DropdownChoice from "../../../components/dropdown/DropdownChoice";
import UserDetail from "../../../components/forms/UserDetail";

import { FormSelector } from "../Devices";
import { appConfig } from "../../../config";
import "./index.css";
const { headersRef } = appConfig;

export default function AdminUsers() {
  const { userList, userOptions } = useSelector((state) => state.people);
  // const { locationTree } = useSelector((state) => state.data);
  const { plantList } = useSelector((state) => state.plants);
  const [options, setOption] = useState({ active: true });
  const dispatch = useDispatch();
  const [userDetail, setUserDetail] = useState(null);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    dispatch(peopleActions.getOptions());
    dispatch(plantActions.getPlants());
  }, [dispatch]);

  // useEffect(() => console.log("plantList", plantList), [plantList]);
  // useEffect(() => console.log("options", options), [options]);

  function setUserFilters(e) {
    const item = e.target.name;
    const { value, checked } = e.target;
    let checkBox = Object.keys(e.target).includes("checked");

    const newOption = { ...options };
    if (!value || checked) {
      delete newOption[item];
    } else {
      newOption[item] = checkBox ? !checked : value;
    }
    setOption(newOption);
    // dispatch(peopleActions.getAllUsers(options));
  }

  useEffect(
    () => dispatch(peopleActions.getAllUsers({ active: "all" })),
    [dispatch]
  );
  useEffect(() => {
    setFilteredList(
      userList.filter((u) => {
        const keys = Object.keys(options);
        let check = true;
        for (let key of keys) if (u[key] !== options[key]) check = false;
        return check;
      })
    );
  }, [dispatch, userList, options]);

  return (
    <div className="adminOptionSelected">
      <div className="container p-4">
        <div className="row">
          <h4>Lista de Usuarios</h4>
        </div>
        {userOptions && plantList && (
          <div className="row">
            <FormSelector
              label="Planta"
              array={plantList.map((p) => p.name)}
              item="plant"
              select={setUserFilters}
            />
            <FormSelector
              label="Cargo"
              array={userOptions.charge}
              item="charge"
              select={setUserFilters}
            />
            <FormSelector
              label="Acceso"
              array={userOptions.access}
              item="access"
              select={setUserFilters}
            />
            <div className="d-flex gap-4 align-items-center">
              <label>
                Incluir inactivos
                <input
                  name="active"
                  type="checkbox"
                  className="checkFilter"
                  onChange={setUserFilters}
                />
              </label>
              <button
                className="btn btn-success"
                onClick={() => setUserDetail("new")}
              >
                CREAR USUARIO
              </button>
            </div>
          </div>
        )}
        <br />
        <div className="cardList">
          {filteredList.map((element, index) => (
            <UserCard
              user={element}
              key={index}
              editButton={() => setUserDetail(element)}
            />
          ))}
        </div>
        {userDetail && (
          <UserDetail
            user={userDetail}
            charge={userOptions.charge}
            access={userOptions.access.map((e) => headersRef[e] || e)}
            plant={plantList.map((p) => p.name)}
            close={() => setUserDetail(null)}
          />
        )}
      </div>
    </div>
  );
}
