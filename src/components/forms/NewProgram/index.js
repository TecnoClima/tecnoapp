import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { peopleActions, planActions } from "../../../actions/StoreActions";
import { appConfig } from "../../../config";
import ModalBase from "../../../Modals/ModalBase.js";
import { PlantSelector } from "../../dropdown/PlantSelector.js";
import PeoplePicker from "../../pickers/PeoplePicker";
import { ErrorModal, SuccessModal } from "../../warnings";
import { FormInput, FormSelector, FormTextArea } from "../FormInput";
import "./index.css";
const { headersRef } = appConfig;

export default function NewProgram(props) {
  const emptyProgram = {
    plant: "",
    year: "",
    name: "",
    supervisor: "",
    people: [],
    description: "",
  };
  const { close, editProgram } = props;
  const { year } = useSelector((state) => state.data);
  const { selectedPlant } = useSelector((state) => state.plants);
  const { workersList, supervisors } = useSelector((state) => state.people);
  const { programList, planResult } = useSelector((state) => state.plan);
  const [programmedWorkers, selectProgrammed] = useState([]);
  const [program, setProgram] = useState(
    editProgram
      ? {
          ...editProgram,
          year: `${editProgram.year}`,
          supervisor: `${editProgram.supervisor && editProgram.supervisor.id}`,
        }
      : emptyProgram
  );
  const [errors, setErrors] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(peopleActions.getWorkers({ selectedPlant }));
    dispatch(peopleActions.getSupervisors(selectedPlant));
  }, [dispatch, selectedPlant]);

  useEffect(() => {
    if (!selectedPlant) return;
    program.plant !== selectedPlant.name &&
      setProgram({ ...program, plant: selectedPlant.name });
  }, [selectedPlant, program]);

  useEffect(() => {
    let programmed = [];
    for (let program of programList) {
      for (let worker of program.people) {
        programmed.push({ id: worker.id, program: program.name });
      }
    }
    selectProgrammed(programmed);
  }, [programList]);

  function handleValue(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setValue(name, value);
  }
  function setValue(item, value) {
    setErrors(false);
    const newProgram = { ...program };
    value ? (newProgram[item] = value) : delete newProgram[value];
    setProgram(newProgram);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let errors = [];
    const newProgram = {
      ...program,
      people: program.people.map((w) => w.id),
      plant: program.plant || selectedPlant,
      year: program.year || year,
    };
    const keys = Object.keys(emptyProgram);
    for (let key of keys)
      if (!newProgram[key]) errors.push(headersRef[key] || key);
    if (errors[0]) {
      setErrors(errors);
    } else {
      if (program.id) {
        let update = { ...newProgram };
        for (let key of Object.keys(update)) {
          switch (key) {
            case "people":
              update.people.length === editProgram.length &&
                !update.people.filter(
                  (id) => !editProgram.people.find((e) => e.id === id)
                )[0] &&
                delete update.people;
              break;
            case "supervisor":
              Number(update.supervisor) === editProgram.supervisor.id &&
                delete update.supervisor;
              break;
            default:
              if (key !== "id" && `${update[key]}` === `${editProgram[key]}`)
                delete update[key];
          }
        }
        dispatch(planActions.updateStrategy(update));
      } else {
        dispatch(planActions.createStrategy(newProgram));
      }
    }
  }

  return (
    <ModalBase
      open={true}
      onClose={close}
      title={`${program.id ? "Editar" : "Crear"} programa`}
    >
      {program && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <div className="flex">
            <div className="w-1/3 flex-grow">
              <PlantSelector
                onSelect={(plantName) => setValue("plant", plantName)}
              />
            </div>
            <div className="w-1/3 flex-grow">
              <FormSelector
                label="Año"
                name="year"
                options={[year - 1, year, year + 1]}
                value={`${program && program.year}`}
                onSelect={handleValue}
              />
            </div>
          </div>
          {!!selectedPlant && (
            <>
              <FormInput
                label="Nombre"
                name="name"
                value={program.name}
                changeInput={handleValue}
              />
              <FormSelector
                key={program.supervisor}
                label="Supervisor"
                value={`${program.supervisor}`}
                options={supervisors.filter(
                  ({ plant }) => plant === selectedPlant.name
                )}
                valueField="idNumber"
                name="supervisor"
                captionField="name"
                onSelect={handleValue}
              />
              <div className="h-fit max-h-60 overflow-y-auto">
                <PeoplePicker
                  name="Seleccionar Personal"
                  options={workersList
                    .filter(({ plant }) => plant === selectedPlant.name)
                    .map((w) => ({
                      id: w.idNumber,
                      name: w.name,
                    }))}
                  update={(idArray) =>
                    setProgram({ ...program, people: idArray })
                  }
                  idList={program ? program.people : []}
                  selectedWorkers={{
                    caption: "Programa(s)",
                    array: programmedWorkers,
                  }}
                />
              </div>
              <FormTextArea
                label={"Descripción"}
                name="description"
                defaultValue={program.description}
                changeInput={handleValue}
              />
              {errors ? (
                <div className="alert alert-error" role="alert">
                  {`Debe completar ${errors.join(", ")}.`}
                </div>
              ) : (
                <button
                  className="btn btn-success btn-sm ml-auto"
                  type="submit"
                >
                  GUARDAR PROGRAMA
                </button>
              )}
            </>
          )}
        </form>
      )}
      {planResult.error && (
        <ErrorModal
          message={`No se pudo guardar el programa. Error: ${planResult.error}`}
          open={true}
          close={() => dispatch(planActions.resetPlanResult())}
        />
      )}
      {planResult.success && (
        <SuccessModal
          message={"Programa guardado exitosamente!"}
          open={true}
          close={() => {
            dispatch(planActions.resetPlanResult());
          }}
        />
      )}
    </ModalBase>
  );
}
