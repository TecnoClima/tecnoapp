import { faLocationDot, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { appConfig } from "../../../config";
import { FormSelector, FormTextArea } from "../../forms/FormInput";
const { frequencies } = appConfig;

export default function PlanDevice(props) {
  const { onSave, programs, device } = props;
  const [startProgram, setStartProgram] = useState(device.strategy || {}); // programa en el equipo
  const [program, setProgram] = useState(
    device.strategy
      ? programs.find((program) => program.name === device.strategy.name)
      : undefined
  ); //programa elegido de la lista de programas
  const [newProgram, setNewProgram] = useState(
    device.strategy || { frequency: device.frequency }
  ); // programa nuevo
  const [save, setSave] = useState(false);

  useEffect(
    () =>
      setSave(
        newProgram?.name &&
          !(JSON.stringify(startProgram) === JSON.stringify(newProgram))
      ),
    [startProgram, newProgram]
  );

  useEffect(
    () => setStartProgram(device.strategy || { frequency: device.frequency }),
    [device.strategy]
  );

  function handleProperty(key, value) {
    let program = { ...newProgram };
    if (!value) {
      delete program[key];
    } else {
      if (!program) program = {};
      program[key] = value;
    }
    setNewProgram(program);
  }

  function handleProgram(e) {
    const { value } = e.currentTarget;
    const program = programs.find((program) => program.name === value);
    setProgram({ ...program });
    setNewProgram(
      value === ""
        ? {}
        : { name: value, year: program?.year, plant: program?.plant }
    );
  }

  function handleSave() {
    let program = { ...newProgram };
    if (!program.frequency) program.frequency = 48;
    onSave({ device: [device.code], program });
    setStartProgram(program);
  }

  const plantPrograms = programs.filter(
    (program) => program.plant === device.plant
  );

  return (
    <div
      className={`card flex flex-col gap-1 py-1 px-2 border ${
        newProgram.name
          ? "border-success bg-success/10"
          : "border-transparent bg-error/10"
      }`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="checkbox"
          className="checkbox"
          id={device.code}
          defaultChecked={props.checked}
          onChange={(e) => props.onCheck(e)}
        />
        <div className="flex-grow text-base">
          <b>{`[${device.code}] ${device.name}`}</b>
        </div>

        <div className="text-sm ">
          {` (${device.type} ${
            device.power > 7500
              ? Math.floor(device.power / 3000) + "TR"
              : device.power + "Frig"
          }
                                ${device.refrigerant})${
            device.gasAmount ? ` - ${device.gasAmount}g` : ""
          }`}
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-1">
        <div className="text-xs md:w-1/3">
          <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
          {`${device.plant} > ${device.area} > ${device.line}`}
        </div>

        <div className="flex flex-grow flex-wrap text-xs gap-1">
          <div className="rounded-md bg-base-content/10 px-2 py-1 w-20 flex-grow min-w-fit">
            <i className="fas fa-table me-1" />
            {device.category}
          </div>
          <div className="rounded-md bg-base-content/10 px-2 py-1 w-20 flex-grow min-w-fit">
            <i className="fas fa-tools me-1" />
            {device.service}
          </div>
          <div className="rounded-md bg-base-content/10 px-2 py-1 w-20 flex-grow min-w-fit">
            <i className="fas fa-globe me-1" />
            {device.environment}
          </div>
          <div className="rounded-md bg-base-content/10 px-2 py-1 w-20 flex-grow min-w-fit">
            <i className="far fa-calendar-alt  me-1" />
            {device.age + " años"}
          </div>
          <div className="rounded-md bg-base-content/10 px-2 py-1 w-20 flex-grow min-w-fit">
            <i className="far fa-star  me-1" />
            {device.status}
          </div>
          <div className="rounded-md bg-base-content/10 px-2 py-1 w-20 flex-grow min-w-fit">
            <i className="fas fa-bell me-1" />
            {device.reclaims + " reclamos"}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-1">
        <div
          title={
            !plantPrograms.length
              ? "No hay programas para esta planta"
              : undefined
          }
          className="flex flex-col flex-grow justify-start"
        >
          <FormSelector
            size="xs"
            name="program"
            label="Programa"
            options={plantPrograms}
            disabled={!plantPrograms.length}
            valueField="name"
            captionField="name"
            onSelect={handleProgram}
            defaultValue={newProgram ? newProgram.name : undefined}
          />

          <FormSelector
            size="xs"
            label="Responsable"
            name="responsible"
            options={program?.people}
            valueField="id"
            captionField="name"
            onSelect={(event) =>
              handleProperty(
                "responsible",
                program.people.find(
                  (worker) => worker.id === Number(event.target.value)
                )
              )
            }
            disabled={!newProgram.name}
            defaultValue={
              newProgram
                ? newProgram.responsible && newProgram.responsible.id
                : undefined
            }
          />

          <FormSelector
            size="xs"
            name="frequency"
            label="Frecuencia"
            options={frequencies}
            valueField="weeks"
            captionField="frequency"
            onSelect={(e) =>
              handleProperty(
                "frequency",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            value={newProgram.frequency}
            disabled={!newProgram.name}
          />
        </div>
        <div className="flex flex-grow gap-1">
          <FormTextArea
            key={newProgram.description}
            label="Observaciones"
            onChange={(e) => handleProperty("observations", e.target.value)}
            defaultValue={newProgram?.observations || ""}
          />
          <button
            className="btn btn-success btn-sm ml-auto h-full"
            onClick={handleSave}
            disabled={!save}
          >
            <div className="flex flex-col justify-center">
              <FontAwesomeIcon icon={faSave} className="mb-2" />
              Guardar
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
