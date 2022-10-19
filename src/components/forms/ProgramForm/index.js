import { useEffect, useState } from "react";
import "./index.css";
import { appConfig } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import { FormSelector, FormTextArea } from "../FormInput/index.js";
import { planActions } from "../../../actions/StoreActions.js";
const { frequencies } = appConfig;

export default function ProgramForm(props) {
  const { selection, save, onClose } = props;

  const { selectedPlant } = useSelector((s) => s.plants);
  const { year } = useSelector((state) => state.data);
  const fullProgramList = useSelector((state) => state.plan.programList); // allPrograms

  const [programList, setProgramList] = useState(props.programList); //filtered Program List
  const [planProgram, setPlanProgram] = useState({});
  const [program, setProgram] = useState({});
  const dispatch = useDispatch();

  useEffect(() => setProgramList(fullProgramList), [fullProgramList]);

  function selectProgram(name) {
    const program = programList.find((program) => program.name === name);
    setPlanProgram(
      program
        ? { name: name, year: program.year, plant: selectedPlant.name }
        : undefined
    );
    setProgram(program);
  }

  function setProgramItem(item, value) {
    const newProgram = { ...planProgram };
    if (value === "") {
      delete newProgram[item];
    } else {
      newProgram[item] = value;
    }
    setPlanProgram(newProgram);
  }

  useEffect(() => {
    if (!(selectedPlant.name && year && selection)) return;
    const newProgram = { plant: selectedPlant.name };
    newProgram.device = selection
      .filter((dev) => dev.plant === selectedPlant.name)
      .map((dev) => dev.code);
    dispatch(planActions.getStrategies({ plant: selectedPlant.name, year }));
    setPlanProgram(newProgram);
  }, [selectedPlant, selection, year, dispatch]);

  function handlePeople(e) {
    e.preventDefault();
    const worker = program.people.find(
      (worker) => worker.id === Number(e.target.value)
    );
    setProgramItem(
      "responsible",
      worker ? { id: worker.id, name: worker.name } : ""
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    save &&
      save({ device: selection.map((dev) => dev.code), program: planProgram });
    onClose && onClose();
  }

  return (
    <div className="modal">
      <form
        className="container bg-light p-2 w-auto rounded-2"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="row justify-content-between">
          <h5 className="w-auto text-decoration-underline">
            Programar grupo de equipos
          </h5>
          <button
            className="btn btn-close mx-2"
            onClick={() => props.onClose()}
          />
        </div>
        <div className="row">
          <div className="col d-flex flex-column align-items-center gap-1">
            <b>Lista de Equipos</b>
            <div className="formItemList">
              {selection.map((device, index) => (
                <div
                  key={index}
                  className={`${
                    planProgram.plant &&
                    planProgram.plant !== device.plant &&
                    "discard"
                  }`}
                >
                  {`(${device.code}) ${device.name}
                            - ${
                              device.power > 7500
                                ? Math.floor(device.power / 3000) + " TR"
                                : device.power + " Frigorías"
                            }
                            `}
                  {planProgram.plant && planProgram.plant !== device.plant && (
                    <div className="errorMessage">
                      Este equipo no pertenece a esa planta
                    </div>
                  )}
                </div>
              ))}
            </div>
            <FormSelector
              label="Programa"
              value={program.name}
              options={programList ? programList.map((p) => p.name) : []}
              onSelect={(e) => selectProgram(e.target.value)}
            />
            {!planProgram.name && (
              <div className="errorMessage">Debe seleccionar un programa</div>
            )}

            <FormSelector
              label="Frecuencia"
              value={program.frequency}
              options={frequencies || []}
              valueField={"weeks"}
              captionField={"frequency"}
              disabled={!program.name}
              onSelect={(e) =>
                setProgramItem("frequency", Number(e.target.value))
              }
            />
            {!planProgram.frequency && (
              <div className="errorMessage">
                Debe seleccionar una frecuencia
              </div>
            )}

            <FormSelector
              label="Responsable"
              defaultValue={program.name}
              options={program ? program.people : []}
              disabled={!planProgram.frequency}
              valueField={"id"}
              captionField={"name"}
              onSelect={(e) => handlePeople(e)}
            />
            {!planProgram.responsible && (
              <div className="errorMessage">
                Debe seleccionar un responsable
              </div>
            )}

            <FormTextArea
              label="Comentarios"
              placeholder="Descripción o resumen de actividades, recomendaciones, etc."
              changeInput={(e) =>
                setProgramItem("observations", e.target.value)
              }
            />
          </div>
        </div>

        {/* <PlantSelector key={plant} />
        {!planProgram.plant && (
          <div className="errorMessage">Debe seleccionar una planta</div>
        )} */}

        {/* <div className="section">
          <label className="formLabel">Comentarios</label>
          <textarea
            className="planComments"
            placeholder="Descripción o resumen de actividades, recomendaciones, etc."
            onBlur={(e) => setProgramItem("observations", e.target.value)}
          />
        </div> */}

        <div className="row justify-content-center">
          <button
            className="btn btn-success w-auto my-2"
            type="submit"
            disabled={!planProgram.name}
          >
            <i className="fas fa-save" /> GUARDAR PLAN
          </button>
        </div>
      </form>
    </div>
  );
}
