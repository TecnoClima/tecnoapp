import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { optionActions } from "../../../actions/StoreActions";
import { NavLink, useParams } from "react-router-dom";
import { appConfig } from "../../../config";

const { headersRef } = appConfig;

const optionsMenu = {
  deviceOptions: { caption: "Equipos", path: "equipos", element: "Equipos" },
  userOptions: { caption: "Usuarios", path: "usuarios", element: "Usuarios" },
  wOOptions: {
    caption: "Órdenes de trabajo",
    path: "ordenes-de-trabajo",
    element: "OTs",
  },
};

function CreateForm({ option, example, onClose }) {
  function handleClose(e) {
    e.preventDefault();
    onClose && onClose();
  }
  return (
    <div className="modal">
      <div className="d-flex flex-column bg-light rounded-4 p-2">
        <button className="btn btn-close ms-auto" onClick={handleClose} />
        <h2>Agregar {option}</h2>
        {Object.keys(example || {})
          .filter((k) => k !== "count")
          .map((key) => (
            <div className="input-group">
              <label className="input-group-text">
                {headersRef[key] || key}
              </label>
              <input className="form-control" />
            </div>
          ))}
      </div>
    </div>
  );
}

export default function AdminOptions() {
  const { submenu } = useParams();
  const { options } = useSelector((state) => state.options);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [menuKey, setMenuKey] = useState(null);
  const [element, setElement] = useState("");
  const dispatch = useDispatch();

  useEffect(() => dispatch(optionActions.getOptions()), [dispatch]);
  useEffect(() => {
    if (!submenu || !options) return;
    const index = Object.keys(optionsMenu).find(
      (key) => optionsMenu[key].path === submenu
    );
    setMenuKey(index);
    setSelectedOptions(options[index]);
    setElement(optionsMenu[index].element);
  }, [submenu, options]);
  useEffect(() => console.log(selectedOptions), [selectedOptions]);

  function handleOpenModal(e) {
    e.preventDefault();
    const { value } = e.currentTarget;
    setModalData({
      option: headersRef[value],
      example: selectedOptions[value][0],
    });
  }

  function handleDelete(e) {
    e.preventDefault();
    const { value, name } = e.currentTarget;
    dispatch(
      optionActions.deleteOption({ model: menuKey, option: name, value })
    );
  }

  return (
    <div className="adminOptionSelected pt-4 px-2">
      {modalData && (
        <CreateForm {...modalData} onClose={() => setModalData(null)} />
      )}
      <div className="container">
        <div className="row">
          <h4 className="col-sm-8">Administración de Opciones</h4>
        </div>
        <div className="container-fluid">
          <ul className="nav nav-tabs">
            {Object.keys(options).map((option, i) => (
              <li key={option} className="nav-item">
                <NavLink
                  className={`nav-link ${selectedOptions?.id === option.id}`}
                  aria-current="page"
                  to={`/admin/opciones/${optionsMenu[option].path}`}
                >
                  {optionsMenu[option].caption}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="row">
            {selectedOptions &&
              Object.keys(selectedOptions).map((key, i) => (
                <div className="mb-4" key={i}>
                  <h4>{headersRef[key]}</h4>
                  <div className="container-fluid p-0">
                    <div className="row">
                      {selectedOptions[key].map(({ value, count }, i) => {
                        return (
                          <div className="col-lg-4 p-1" key={i} value={value}>
                            <div className="d-flex flex-row h-100 align-items-center justify-content-between text-start btn btn-outline-primary">
                              <div>
                                <div>{headersRef[value] || value}</div>
                                <div
                                  className={`badge ${
                                    count ? "bg-info" : "bg-success"
                                  }`}
                                >
                                  {element}: {count}
                                </div>
                              </div>
                              {count === 0 && (
                                <div className="bg-light ms-1 rounded-1">
                                  <button
                                    title="Eliminar opción"
                                    name={key}
                                    value={value}
                                    className="btn btn-sm btn-outline-danger h-auto"
                                    onClick={handleDelete}
                                  >
                                    X
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="d-flex">
                    <button
                      onClick={handleOpenModal}
                      value={key}
                      className="d-flex btn btn-success align-items-center gap-1"
                    >
                      <i className="fa fa-plus"></i>
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
