import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { planActions } from "../../../actions/StoreActions.js";
import { appConfig } from "../../../config";
import ModalBase from "../../../Modals/ModalBase.js";
import { FormSelector, FormTextArea } from "../FormInput/index.js";
import "./index.css";
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
    <ModalBase open={true} title="Programar grupo de equipos" onClose={onClose}>
      <form
        className="flex flex-col h-[70vh] gap-1"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-col h-20 flex-grow">
          <b>Lista de Equipos</b>
          <div className="flex flex-col flex-grow  min-h-0 overflow-y-auto gap-1 bg-base-content/10 text-sm p-1">
            {selection.map((device, index) => (
              <div
                key={index}
                className={`${
                  planProgram?.plant &&
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
                {planProgram?.plant && planProgram.plant !== device.plant && (
                  <div className="errorMessage">
                    Este equipo no pertenece a esa planta
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <FormSelector
            label="Programa"
            value={program?.name}
            options={programList ? programList.map((p) => p.name) : []}
            onSelect={(e) => selectProgram(e.target.value)}
          />
          {!planProgram?.name && (
            <div className="errorMessage">Debe seleccionar un programa</div>
          )}

          <FormSelector
            label="Frecuencia"
            value={program?.frequency}
            options={frequencies || []}
            valueField={"weeks"}
            captionField={"frequency"}
            disabled={!program?.name}
            onSelect={(e) =>
              setProgramItem("frequency", Number(e.target.value))
            }
          />
          {!planProgram?.frequency && (
            <div className="errorMessage">Debe seleccionar una frecuencia</div>
          )}

          <FormSelector
            label="Responsable"
            defaultValue={program?.name}
            options={program?.people || []}
            disabled={!planProgram?.frequency}
            valueField={"id"}
            captionField={"name"}
            onSelect={(e) => handlePeople(e)}
          />
          {!planProgram?.responsible && (
            <div className="errorMessage">Debe seleccionar un responsable</div>
          )}

          <FormTextArea
            label="Comentarios"
            placeholder="Descripción o resumen de actividades, recomendaciones, etc."
            changeInput={(e) => setProgramItem("observations", e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button
            className="btn btn-success btn-sm w-fit my-2"
            type="submit"
            disabled={!planProgram?.name}
          >
            <i className="fas fa-save" /> GUARDAR PLAN
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
