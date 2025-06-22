import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";
import {
  ErrorModal,
  SuccessModal,
} from "../../../components/warnings/index.js";
import { appConfig } from "../../../config.js";
import CreateElement from "./CreateElement.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const { headersRef } = appConfig;

export default function ElementSection(props) {
  const {
    item,
    array,
    deleteAction,
    getAction,
    update,
    create,
    setData,
    data,
    enableCreation,
  } = props;
  const dispatch = useDispatch();
  const { plantResult } = useSelector((state) => state.plants);
  const [creation, setCreation] = useState(false);
  const [editElement, setEditElement] = useState(null);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => dispatch(getAction()), [dispatch, getAction]);

  function handleSetData(e) {
    e.preventDefault();
    if (item === "servicePoint") return;
    const { value } = e.currentTarget;
    const prop = e.currentTarget.name;
    let propValue = undefined;
    if (prop === item) propValue = array.find((p) => p.name === value);
    setData(prop, propValue);
  }

  function handleDeleteData(e, code) {
    e.preventDefault();
    setDeleting(true);
    dispatch(deleteAction(array.find((e) => e.code === code)));
  }

  useEffect(() => dispatch(plantActions.resetResult()), [dispatch]);

  return (
    <div className="card bg-base-content/10 flex-col w-full p-2">
      <div className="flex w-full items-center justify-between">
        {creation && (
          <CreateElement
            close={() => setCreation(false)}
            item={item}
            save={create}
            data={data}
          />
        )}
        <div className="flex w-full items-center justify-between gap-4">
          <div className="card-title">{headersRef[item]}</div>
          <button
            className="btn btn-success btn-sm"
            onClick={() => setCreation(true)}
            disabled={!enableCreation}
          >
            <FontAwesomeIcon icon={faPlus} />
            CREAR
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {enableCreation &&
          array
            .filter((e) => (data[item] ? e.name === data[item].name : e))
            .map((element, i) => {
              const { name } = element;
              return (
                <div key={i} className="w-full join">
                  <button
                    name={item}
                    value={name}
                    className={`btn join-item btn-sm ${
                      item === "servicePoint"
                        ? "btn-outline btn-secondary"
                        : data[item] && data[item].name === name
                        ? "btn-primary"
                        : "btn-outline btn-primary"
                    } flex w-20 min-h-8 h-full py-1 flex-grow justify-start items-center`}
                    key={"divCuerpo" + name}
                    onClick={(e) => handleSetData(e)}
                  >
                    <div>
                      <div className="text-start">
                        [{element.code}] {name}
                      </div>
                      {item === "servicePoint" && (
                        <div className="flex gap-1">
                          {Object.keys(element)
                            .filter((k) => element[k] === true)
                            .map((k, i) => (
                              <div key={i} className="badge bg-primary">
                                {headersRef[k]}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    className="btn join-item btn-error h-full min-h-0"
                    title="Eliminar"
                    onClick={(e) => handleDeleteData(e, element.code)}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                  <button
                    className="btn join-item btn-info btn-sm h-full min-h-0"
                    title="Edit"
                    key={"edit" + element}
                    value={element}
                    onClick={() => setEditElement(element)}
                  >
                    <i className="fas fa-pencil-alt" />
                  </button>
                  {editElement && (
                    <CreateElement
                      close={() => setEditElement(null)}
                      save={update}
                      item={item}
                      element={editElement}
                      data={data}
                    />
                  )}
                </div>
              );
            })}
      </div>
      {!editElement && plantResult.error && plantResult.item === item && (
        <ErrorModal
          message={plantResult.error}
          open={true}
          close={() => dispatch(plantActions.resetResult())}
        />
      )}
      {!editElement &&
        plantResult.success &&
        plantResult.item === item &&
        deleting && (
          <SuccessModal
            message={plantResult.success}
            open={true}
            close={() => {
              dispatch(plantActions.resetResult());
              setDeleting(false);
            }}
          />
        )}
    </div>
  );
}
