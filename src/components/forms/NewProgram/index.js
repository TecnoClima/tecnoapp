import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlantSelector } from "../../dropdown/PlantSelector.js";
import PeoplePicker from "../../pickers/PeoplePicker";
import { FormInput, FormSelector, FormTextArea } from "../FormInput";
import "./index.css";
import { appConfig } from "../../../config";
import { peopleActions, planActions } from "../../../actions/StoreActions";
import { ErrorModal, SuccessModal } from "../../warnings";
const { headersRef } = appConfig;

export default function NewProgram(props) {
  const { close, editProgram } = props;
  const { plant, year } = useSelector((state) => state.data);
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
      : {}
  );
  const [errors, setErrors] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(peopleActions.getWorkers({ plant }));
    dispatch(peopleActions.getSupervisors(plant));
  }, [dispatch, plant]);

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
    setErrors(false);
    const newProgram = { ...program };
    const { name, value } = e.target;
    value ? (newProgram[name] = value) : delete newProgram[value];
    setProgram(newProgram);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let errors = [];
    const newProgram = {
      ...program,
      plant: program.plant || plant,
      year: program.year || year,
    };
    const keys = [
      "plant",
      "year",
      "name",
      "supervisor",
      "people",
      "description",
    ];
    for (let key of keys)
      if (!newProgram[key]) errors.push(headersRef[key] || key);
    if (errors[0]) {
      setErrors(errors);
    } else {
      if (program.id) {
        let update = { ...program };
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
        dispatch(planActions.createStrategy(program));
      }
    }
  }

  return (
    <div className="modal">
      {program && (
        <form
          onSubmit={handleSubmit}
          className="container col-lg-6 bg-light bg-form"
        >
          <div className="row d-flex mb-2">
            <h5 className="col mt-2">{`${
              program.id ? "Editar" : "Crear"
            } programa`}</h5>
            <button className="btn btn-close m-2" onClick={close} />
          </div>
          <div className="row">
            <div className="col-sm-6 mb-2">
              <PlantSelector
                key={program.plant}
                defaultValue={program.plant}
                onSelect={handleValue}
              />
            </div>
            <div className="col-sm-6 mb-2">
              <FormSelector
                key={program.year}
                label="Año"
                name="year"
                options={[year - 1, year, year + 1]}
                defaultValue={`${program && program.year}`}
                onSelect={handleValue}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 mb-2">
              <FormInput
                label="Nombre"
                name="name"
                value={program.name}
                changeInput={handleValue}
              />
            </div>
            <div className="col-sm-6 mb-2">
              <FormSelector
                key={program.supervisor}
                label="Supervisor"
                value={`${program.supervisor}`}
                options={supervisors}
                valueField="idNumber"
                name="supervisor"
                captionField="name"
                onSelect={handleValue}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="input-group">
              <label
                className="input-group-text col-3 ps-1 pe-1 is-flex justify-content-center"
                style={{ minWidth: "fit-content" }}
              >
                Personal
              </label>
              <div className="form-control p-0 d-grid gap-2">
                <PeoplePicker
                  name="Seleccionar..."
                  options={workersList.map((w) => {
                    w.id = w.idNumber;
                    return w;
                  })}
                  update={(idArray) =>
                    setProgram({ ...program, people: idArray.map((e) => e.id) })
                  }
                  idList={program ? program.people : undefined}
                  selectedWorkers={{
                    caption: "Programa(s)",
                    array: programmedWorkers,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row mb-2">
            <FormTextArea
              label={"Descripción"}
              name="description"
              defaultValue={program.description}
              changeInput={handleValue}
            />
          </div>
          {errors ? (
            <div className="alert alert-danger" role="alert">
              {`Debe completar ${errors.join(", ")}.`}
            </div>
          ) : (
            <div className="row mb-2 d-flex justify-content-center">
              <div className="col-md-4 d-grid gap-2">
                <button className="btn btn-success" type="submit">
                  GUARDAR PROGRAMA
                </button>
              </div>
            </div>
          )}
        </form>
      )}
      {planResult.error && (
        <ErrorModal
          message={`No se pudo guardar el programa. Error: ${planResult.error}`}
          close={() => dispatch(planActions.resetPlanResult())}
        />
      )}
      {planResult.success && (
        <SuccessModal
          message={"Programa guardado exitosamente!"}
          close={() => {
            dispatch(planActions.resetPlanResult());
          }}
        />
      )}
    </div>
  );
}
