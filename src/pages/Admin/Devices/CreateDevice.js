import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deviceActions, plantActions } from "../../../actions/StoreActions";
import {
  FormInput,
  FormSelector,
  FormTextArea,
} from "../../../components/forms/FormInput";
import LocationSelector from "../../../components/forms/LocationSelector";
import { ErrorModal, SuccessModal } from "../../../components/warnings";
import WarningErrors from "../../../components/warnings/WarningErrors";
import { appConfig } from "../../../config";
import "./index.css";
const { headersRef } = appConfig;

export default function CreateDevice({ edit, close }) {
  const units = ["Frigorías", "Tn. Ref"];
  const emptyDevice = {
    name: "",
    regDate: new Date().toISOString().split("T")[0],
    type: "",
    power: 0,
    refrigerant: "",
    service: "",
    category: "",
    environment: "",
    extraDetails: "",
    status: "",
    active: true,
  };
  const { deviceOptions, deviceResult, deviceFullList } = useSelector(
    (state) => state.devices
  );
  const { lineDetail, spList } = useSelector((state) => state.plants);
  const [errors, setErrors] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [device, setDevice] = useState(
    edit
      ? { ...edit, regDate: new Date(edit.regDate).toISOString().split("T")[0] }
      : emptyDevice
  );
  const [location, setLocation] = useState({});
  const [lineId, setLineId] = useState("");
  const [unit, setUnit] = useState(units[0]);
  const [fetching, setFetching] = useState(false);
  const [servicePoints, setServicePoints] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetching) return;
    if (!deviceOptions.type) dispatch(deviceActions.allOptions());
    if (!deviceFullList[0]) dispatch(deviceActions.getFullList());
    if (!spList[0]) dispatch(plantActions.getSPs());
    setFetching(true);
  }, [fetching, deviceFullList, deviceOptions, spList, dispatch]);

  useEffect(() => {
    if (spList && edit && lineId)
      setServicePoints(
        spList
          .filter(
            (sp) =>
              sp.lineId === lineId &&
              edit.servicePoints &&
              edit.servicePoints.includes(sp.name)
          )
          .map((sp) => sp.id)
      );
  }, [spList, edit, lineId]);

  function setValue(e) {
    e.preventDefault();
    const { name, value } = e.target;
    const newJson = { ...device };
    value ? (newJson[name] = value) : delete newJson[name];
    if (name === "plant") delete newJson.area;
    if (["plant", "area"].includes(name)) delete newJson.line;
    setDevice(newJson);
  }

  useEffect(() => {
    if (edit) {
      const { plant, area, line } = edit;
      setLocation({ plant, area, line });
      dispatch(plantActions.getLine({ plant, area, line }));
    }
  }, [edit, dispatch]);
  useEffect(() => {
    setLineId(lineDetail._id);
  }, [lineDetail]);

  function pickSP(e) {
    e.preventDefault();
    const { id } = e.target;
    setServicePoints(
      servicePoints.includes(id)
        ? servicePoints.filter((e) => e !== id)
        : [...servicePoints, id]
    );
  }

  function selectLine(json) {
    setLineId(json ? json.line : "" || "");
    setServicePoints([]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const warnings = ["¿Confirma que desea guardar el equipo?"];
    const errors = Object.keys(device).filter(
      (key) => !device[key] && device[key] !== 0
    );
    if (!location.line) errors.unshift("line");
    if (!servicePoints[0])
      warnings.unshift(
        "¿Confirma que desea guardar sin asignar puntos de servicio?"
      );
    if (!device.extraDetails)
      warnings.unshift("¿Confirma que desea guardar sin describir detalles?");

    setErrors(errors);
    if (!errors[0]) setConfirm(warnings);
  }

  function save(e) {
    if (e) e.preventDefault();
    const newDevice = { ...location, ...device, servicePoints };
    if (unit === units[1]) newDevice.power *= 3000;
    if (edit) {
      dispatch(deviceActions.updateDevice(newDevice));
    } else {
      dispatch(deviceActions.createNew(newDevice));
    }
  }

  function handleCloseSuccess(e) {
    if (e) e.preventDefault();
    setDevice(emptyDevice);
    setServicePoints([]);
    dispatch(deviceActions.resetResult());
  }

  function handleClose(e) {
    e && e.preventDefault();
    setServicePoints([]);
    dispatch(deviceActions.resetResult());
    close();
  }

  return (
    <div className="modal">
      <div
        className="container bg-light col-10 px-3"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <div className="container">
          <div className="row justify-content-between pt-3 pb-2">
            <div className="w-auto">
              {edit ? (
                <h4 className="col col-11">
                  Editar Equipo
                  <br />
                  {`[${edit.code}] ${edit.name}`}
                </h4>
              ) : (
                <h4>Crear Nuevo Equipo</h4>
              )}
            </div>
            <button
              type="button"
              className="btn-close col-1"
              aria-label="Close"
              style={{ float: "right" }}
              onClick={handleClose}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="container">
            <LocationSelector
              initNames={
                edit
                  ? {
                      plant: edit.plant,
                      area: edit.area,
                      line: edit.line,
                    }
                  : undefined
              }
              limit="line"
              extraClass="col-md-4"
              getNames={setLocation}
              getId={selectLine}
            />
            <div className="row align-items-center mt-2">
              <div className="col-md-4 mb-2">
                <FormInput
                  label="Nombre"
                  name="name"
                  placeholder="Nombre o Denominación"
                  value={device.name}
                  changeInput={setValue}
                />
              </div>
              <div className="col-md-4 mb-2">
                <FormInput
                  label="Fecha Alta"
                  type="date"
                  name="regDate"
                  value={device.regDate}
                  max={new Date().toISOString().split("T")[0]}
                  placeholder="Nombre o Denominación"
                  changeInput={setValue}
                />
              </div>
              <div className="col-md-4 mb-2">
                <div className="input-group">
                  <div
                    className={`input-group-text ${
                      device.active ? "bg-success text-light" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      defaultChecked={true}
                      onChange={(e) =>
                        setDevice({ ...device, active: e.target.checked })
                      }
                    />
                  </div>
                  <span
                    className={`input-group-text flex-grow-1 ${
                      device.active && `bg-success text-light`
                    }`}
                  >
                    Equipo activo
                  </span>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-4 mb-2">
                <FormSelector
                  label="Tipo"
                  options={deviceOptions.type}
                  name="type"
                  value={device.type}
                  onSelect={setValue}
                />
              </div>
              <div className="col-md-4 mb-2">
                <FormInput
                  label="Potencia"
                  type="number"
                  name="power"
                  min={"0"}
                  value={device.power}
                  changeInput={setValue}
                />
              </div>
              <div className="col-md-4 mb-2">
                <FormSelector
                  label="Unidad"
                  name="unit"
                  options={units}
                  value={unit}
                  onSelect={(e) => setUnit(e.target.value)}
                />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-4 mb-2">
                <FormSelector
                  label="Gas"
                  name="refrigerant"
                  options={deviceOptions.refrigerant}
                  value={device.refrigerant}
                  onSelect={setValue}
                />
              </div>
              <div className="col-md-4 mb-2">
                <FormSelector
                  label="Servicio"
                  name="service"
                  options={deviceOptions.service}
                  value={device.service}
                  onSelect={setValue}
                />
              </div>
              <div className="col-md-4 mb-2">
                <FormSelector
                  label="Categoría"
                  name="category"
                  options={deviceOptions.category}
                  value={device.category}
                  onSelect={setValue}
                />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-4 mb-2">
                <FormSelector
                  label="Ambiente"
                  name="environment"
                  options={deviceOptions.environment}
                  value={device.environment}
                  onSelect={setValue}
                />
              </div>
              <div className="col-md-4 mb-2">
                <FormSelector
                  label="Estado"
                  name="status"
                  options={deviceOptions.status}
                  value={device.status}
                  onSelect={setValue}
                />
              </div>
            </div>
            <div className="row mb-2">
              <FormTextArea
                label="Descripción"
                name="extraDetails"
                placeholder="Descripción o detalle a tener en cuenta"
                changeInput={setValue}
                textArea={true}
                value={device.extraDetails}
              />
            </div>
            <div className="row">
              <div className="col">
                <div className="accordion" id="accordionExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Seleccionar Lugares de Servicio
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        {location && location.line ? (
                          <div
                            className="container"
                            style={{ maxHeight: "45vh", overflowY: "auto" }}
                          >
                            <div className="row">
                              {spList
                                .filter((sp) => sp.lineId === lineId)
                                .map((sp, index) => (
                                  <div className="col-lg-4" key={index}>
                                    <button
                                      id={sp._id || sp.id}
                                      key={index}
                                      name="servicePoints"
                                      value={sp.name}
                                      className={`btn ${
                                        servicePoints.includes(sp._id || sp.id)
                                          ? "btn-primary"
                                          : "btn-secondary"
                                      } m-1 col-12`}
                                      onClick={pickSP}
                                      style={{ fontSize: "90%", height: "90%" }}
                                    >
                                      {sp.name}
                                    </button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <h6>Debe seleccionar línea primero</h6>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {errors[0] && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >{`Debe completar ${errors
                  .map((e) => headersRef[e])
                  .join(", ")}`}</div>
              )}
            </div>
            <div className="row justify-content-center pt-2">
              <button className="btn btn-primary w-auto" type="submit">
                GUARDAR
              </button>
            </div>
            {confirm && (
              <WarningErrors
                warnings={confirm}
                proceed={save}
                close={() => setConfirm(false)}
              />
            )}
            {deviceResult.error && (
              <ErrorModal
                message={`No se pudo guardar el equipo. Error: ${deviceResult.error}`}
                close={() => dispatch(deviceActions.resetResult())}
              />
            )}
            {deviceResult.success && (
              <SuccessModal
                message={`Equipo guardado correctamente. El código es ${deviceResult.success.code}.`}
                link={`/equipos/${deviceResult.success.code}`}
                close={handleCloseSuccess}
              />
            )}
          </div>
        </form>
        <br />
      </div>
    </div>
  );
}
