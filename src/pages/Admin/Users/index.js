import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions, plantActions } from "../../../actions/StoreActions";
import UserCard from "../../../components/Cards/UserCards/UserCard";
import UserDetail from "../../../components/forms/UserDetail";

import { FormSelector } from "../../../components/forms/FormInput";
import { appConfig } from "../../../config";
import "./index.css";
const { headersRef } = appConfig;

export default function AdminUsers() {
  const { userList, userOptions } = useSelector((state) => state.people);
  const { plantList } = useSelector((state) => state.plants);
  const [options, setOption] = useState({ active: true });
  const dispatch = useDispatch();
  const [userDetail, setUserDetail] = useState(null);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    dispatch(peopleActions.getOptions());
    dispatch(plantActions.getPlants());
  }, [dispatch]);

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
          <div className="col-md-8 py-1">
            <h4>Lista de Usuarios</h4>
          </div>
          <div className="col-md-4">
            <button
              className="btn btn-success w-100"
              onClick={() => setUserDetail("new")}
            >
              CREAR USUARIO
            </button>
          </div>
        </div>
        {userOptions && plantList && (
          <div className="row">
            <div className="col-md-3">
              <FormSelector
                label="Planta"
                options={plantList.map((p) => p.name)}
                name="plant"
                onSelect={setUserFilters}
              />
            </div>
            <div className="col-md-3">
              <FormSelector
                label="Cargo"
                options={userOptions.charge}
                name="charge"
                onSelect={setUserFilters}
              />
            </div>
            <div className="col-md-3">
              <FormSelector
                label="Acceso"
                options={userOptions.access}
                name="access"
                onSelect={setUserFilters}
              />
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-4 align-items-center">
                <label>
                  <input
                    name="active"
                    type="checkbox"
                    className="checkFilter"
                    onChange={setUserFilters}
                  />
                  Incluir inactivos
                </label>
              </div>
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
