import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions, plantActions } from "../../../actions/StoreActions";
import UserCard from "../../../components/Cards/UserCards/UserCard";
import UserDetail from "../../../components/forms/UserDetail";

import { faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormSelector } from "../../../components/forms/FormInput";
import { appConfig } from "../../../config";
// import "./index.css";
const { headersRef } = appConfig;

export default function AdminUsers() {
  const { userList, userOptions } = useSelector((state) => state.people);
  const { plantList } = useSelector((state) => state.plants);
  const [options, setOption] = useState({ active: true });
  const dispatch = useDispatch();
  const [userDetail, setUserDetail] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    dispatch(peopleActions.getOptions());
    dispatch(plantActions.getPlants());
  }, [dispatch]);

  function setUserFilters(e) {
    const item = e.target.name;
    const { value, checked } = e.target;
    let checkBox = Object.keys(e.target).includes("checked");

    const newOption = { ...options };
    if (!value || checked || value === "Seleccione") {
      delete newOption[item];
    } else {
      newOption[item] = checkBox ? !checked : value;
    }
    setOption(newOption);
  }

  useEffect(
    () => dispatch(peopleActions.getAllUsers({ active: "all" })),
    [dispatch]
  );

  useEffect(() => {
    const keys = Object.keys(options);
    setFilteredList(
      userList.filter((u) => {
        let check = true;
        for (let key of keys) {
          if (key === "plant" && options[key] === "SIN ASIGNAR") {
            if (u[key]) check = false;
          } else {
            const value = options[key];
            if (u[key] !== value) check = false;
          }
        }
        if (
          nameFilter &&
          !u.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
          !u.username.toLowerCase().includes(nameFilter.toLowerCase())
        )
          check = false;
        return check;
      })
    );
  }, [userList, options, nameFilter]);

  return (
    <div className="page-container">
      <div className="w-full flex justify-between gap-2">
        <div className="page-title">Lista de Usuarios</div>
        <button
          className="btn btn-sm btn-success"
          onClick={() => setUserDetail("new")}
        >
          <FontAwesomeIcon icon={faPlus} />
          <FontAwesomeIcon icon={faUser} />
          CREAR USUARIO
        </button>
      </div>
      <div className="flex gap-2 items-center flex-wrap mb-3">
        <div className="w-60 flex-grow">
          <FormSelector
            label="Planta"
            options={[...plantList.map((p) => p.name), "SIN ASIGNAR"]}
            name="plant"
            onSelect={setUserFilters}
          />
        </div>
        <div className="w-60 flex-grow">
          <FormSelector
            label="Cargo"
            options={userOptions.charge}
            name="charge"
            onSelect={setUserFilters}
          />
        </div>
        <div className="w-60 flex-grow">
          <FormSelector
            label="Acceso"
            options={userOptions.access}
            name="access"
            onSelect={setUserFilters}
          />
        </div>
        <input
          type="text"
          className="input input-bordered input-sm"
          placeholder="Buscar por nombre..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        {userOptions && plantList && (
          <div className="form-control flex-none">
            <label className="label cursor-pointer gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                name="active"
                onChange={setUserFilters}
              />
              <span className="label-text">Incluir inactivos</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-wrap gap-2">
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
            access={userOptions.access.map((e) => ({
              access: e,
              acceso: headersRef[e] || e,
            }))}
            plant={plantList.map((p) => p.name)}
            close={() => setUserDetail(null)}
          />
        )}
      </div>
    </div>
  );
}
