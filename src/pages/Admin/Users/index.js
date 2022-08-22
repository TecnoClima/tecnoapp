import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlantList } from "../../../actions/dataActions";
import { peopleActions } from "../../../actions/StoreActions";
import UserCard from "../../../components/Cards/UserCards/UserCard";
// import DropdownChoice from "../../../components/dropdown/DropdownChoice";
import UserDetail from "../../../components/forms/UserDetail";

import { cloneJson } from "../../../utils/utils";
import { FormSelector } from "../Devices";
import { appConfig } from "../../../config";
import "./index.css";
const { headersRef } = appConfig;

export default function AdminUsers() {
  const { userList, userOptions } = useSelector((state) => state.people);
  const { locationTree } = useSelector((state) => state.data);
  const [options, setOption] = useState({ active: true });
  const dispatch = useDispatch();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    dispatch(peopleActions.getOptions());
    dispatch(getPlantList());
  }, [dispatch]);

  function setUserFilters(e) {
    const item = e.target.name,
      value = e.target.value;
    const newOption = cloneJson(options);
    if (value === "0" || value === false) {
      delete newOption[item];
    } else {
      newOption[item] = value;
    }
    setOption(newOption);
    dispatch(peopleActions.getAllUsers(options));
  }

  useEffect(() => {
    options && dispatch(peopleActions.getAllUsers(options));
  }, [dispatch, options]);

  return (
    <div className="adminOptionSelected">
      <div className="container p-4">
        <div className="row">
          <h4>Lista de Usuarios</h4>
        </div>
        {userOptions && locationTree && (
          <div className="row">
            <FormSelector
              label="Planta"
              array={locationTree}
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
                  type="checkbox"
                  className="checkFilter"
                  onChange={(e) => setUserFilters("active", !e.target.checked)}
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
          {userList &&
            userList.map((element, index) => (
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
            plant={locationTree}
            close={() => setUserDetail(null)}
          />
        )}
      </div>
    </div>
  );
}
