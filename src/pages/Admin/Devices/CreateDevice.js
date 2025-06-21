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
import ModalBase from "../../../Modals/ModalBase";
import { appConfig } from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

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
    value
      ? (newJson[name] = name === "power" ? Number(value) : value)
      : delete newJson[name];
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
    setLineId(lineDetail[0]?._id);
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
      (key) => key !== "extraDetails" && !device[key] && device[key] !== 0
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
    !edit && setDevice(emptyDevice);
    setServicePoints([]);
    dispatch(deviceActions.resetResult());
    edit && close();
  }

  function handleClose(e) {
    e && e.preventDefault();
    setServicePoints([]);
    dispatch(deviceActions.resetResult());
    close();
  }

  return (
    <>
      <ModalBase
        title={
          edit ? (
            <div>
              <div>Editar Equipo</div>
              <div className="text-sm font-normal opacity-75">
                {`[${edit.code}] ${edit.name}`}
              </div>
            </div>
          ) : (
            "Crear Nuevo Equipo"
          )
        }
        open={true}
        onClose={handleClose}
        className="sm:max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
          {/* Location Selector */}
          <div className="flex w-full">
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
              getNames={setLocation}
              getId={selectLine}
            />
          </div>

          {/* Basic Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Nombre"
              name="name"
              placeholder="Nombre o Denominación"
              value={device.name}
              changeInput={setValue}
            />
            <FormInput
              label="Fecha Alta"
              type="date"
              name="regDate"
              value={device.regDate}
              max={new Date().toISOString().split("T")[0]}
              changeInput={setValue}
            />
            <div className="flex items-center gap-2 px-2 bg-base-200 rounded-lg">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-success"
                defaultChecked={true}
                onChange={(e) =>
                  setDevice({ ...device, active: e.target.checked })
                }
              />
              <span
                className={`text-sm ${device.active ? "text-success" : ""}`}
              >
                Equipo activo
              </span>
            </div>
          </div>

          {/* Device Type and Power Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelector
              label="Tipo"
              options={deviceOptions.type}
              name="type"
              value={device.type}
              onSelect={setValue}
            />
            <FormInput
              label="Potencia"
              type="number"
              name="power"
              min={"0"}
              value={device.power}
              changeInput={setValue}
            />
            <FormSelector
              label="Unidad"
              name="unit"
              options={units}
              value={unit}
              onSelect={(e) => setUnit(e.target.value)}
            />
          </div>

          {/* Gas and Service Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelector
              label="Gas"
              name="refrigerant"
              options={deviceOptions.refrigerant}
              value={device.refrigerant}
              onSelect={setValue}
            />
            <FormInput
              label="Carga (gramos)"
              type="number"
              name="gasAmount"
              min={"0"}
              value={device.gasAmount}
              changeInput={setValue}
              placeholder="Cantidad de gas en gramos"
            />
          </div>

          {/* Category, Environment, Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelector
              label="Servicio"
              name="service"
              options={deviceOptions.service}
              value={device.service}
              onSelect={setValue}
            />
            <FormSelector
              label="Categoría"
              name="category"
              options={deviceOptions.category}
              value={device.category}
              onSelect={setValue}
            />
            <FormSelector
              label="Ambiente"
              name="environment"
              options={deviceOptions.environment}
              value={device.environment}
              onSelect={setValue}
            />
            <FormSelector
              label="Estado"
              name="status"
              options={deviceOptions.status}
              value={device.status}
              onSelect={setValue}
            />
          </div>

          {/* Description */}
          <div className="w-full">
            <FormTextArea
              label="Descripción"
              name="extraDetails"
              placeholder="Descripción o detalle a tener en cuenta"
              changeInput={setValue}
              textArea={true}
              value={device.extraDetails}
            />
          </div>

          {/* Service Points Accordion */}
          <div className="collapse collapse-arrow bg-base-200">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-lg font-medium">
              Seleccionar Lugares de Servicio
            </div>
            <div className="collapse-content">
              {location && location.line ? (
                <div className="max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {spList
                      .filter((sp) => sp.lineId === lineId)
                      .map((sp, index) => (
                        <button
                          key={index}
                          id={sp._id || sp.id}
                          name="servicePoints"
                          value={sp.name}
                          className={`btn btn-sm ${
                            servicePoints.includes(sp._id || sp.id)
                              ? "btn-primary"
                              : "btn-outline"
                          }`}
                          onClick={pickSP}
                        >
                          {sp.name}
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-warning">
                  Debe seleccionar línea primero
                </div>
              )}
            </div>
          </div>

          {/* Errors */}
          {errors[0] && (
            <div className="alert alert-error">
              <FontAwesomeIcon icon={faTimes} />
              <span>
                Debe completar {errors.map((e) => headersRef[e]).join(", ")}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button className="btn btn-success btn-sm" type="submit">
              <FontAwesomeIcon icon={faCheck} />
              GUARDAR
            </button>
          </div>
        </form>
      </ModalBase>

      {/* Modals */}
      {confirm && (
        <WarningErrors
          warnings={confirm}
          proceed={save}
          open={true}
          close={() => setConfirm(false)}
        />
      )}
      {deviceResult.error && (
        <ErrorModal
          open={true}
          message={`No se pudo guardar el equipo. Error: ${deviceResult.error}`}
          close={() => dispatch(deviceActions.resetResult())}
        />
      )}
      {deviceResult.success && (
        <SuccessModal
          open={true}
          message={`Equipo guardado correctamente. El código es ${deviceResult.success.code}.`}
          link={`/equipos/${deviceResult.success.code}`}
          close={handleCloseSuccess}
        />
      )}
    </>
  );
}
