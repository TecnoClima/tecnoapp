import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { plantActions } from "../../../actions/StoreActions";
import {
  ErrorModal,
  SuccessModal,
} from "../../../components/warnings/index.js";
import { appConfig } from "../../../config.js";
import CreateElement from "./CreateElement.js";

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
    const { value } = e.target;
    const prop = e.target.name;
    let propValue = undefined;
    if (prop === item) propValue = array.find((p) => p.name === value);
    setData(prop, propValue);
  }

  function handleDeleteData(e, i) {
    e.preventDefault();
    setDeleting(true);
    dispatch(deleteAction(array[i]));
  }

  return (
    <div className="container-fluid px-0 mb-4">
      <div className="row">
        {creation && (
          <CreateElement
            close={() => setCreation(false)}
            item={item}
            save={create}
            data={data}
          />
        )}
        <div className="flex align-items-center gap-4 mb-1 w-100">
          <h5 className="my-0 w-50">{headersRef[item]}</h5>
          <button
            className="btn btn-success w-50"
            onClick={() => setCreation(true)}
            disabled={!enableCreation}
          >
            CREAR
          </button>
        </div>
      </div>
      <div className="row">
        {enableCreation &&
          array
            .filter((e) => (data[item] ? e.name === data[item].name : e))
            .map((element, i) => {
              const { name } = element;
              return (
                <div key={i} className="d-flex">
                  <button
                    name={item}
                    value={name}
                    className={`btn ${
                      item === "servicePoint"
                        ? "btn-outline-secondary"
                        : data[item] && data[item].name === name
                        ? "btn-primary"
                        : "btn-outline-primary"
                    } w-100 flex flex-grow-1 justify-content-start align-items-center`}
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
                    className="btn btn-danger m-1 p-1"
                    title="Eliminar"
                    onClick={(e) => handleDeleteData(e, i)}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                  <button
                    className="btn btn-info m-1 p-1"
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
                  {plantResult.error && plantResult.item === item && (
                    <ErrorModal
                      message={plantResult.error}
                      close={() => dispatch(plantActions.resetResult())}
                    />
                  )}
                  {plantResult.success &&
                    plantResult.item === item &&
                    deleting && (
                      <SuccessModal
                        message={plantResult.success}
                        close={() => {
                          dispatch(plantActions.resetResult());
                          setDeleting(false);
                        }}
                      />
                    )}
                </div>
              );
            })}
      </div>
    </div>
  );
}
