import { useEffect, useState } from "react";
import { PlantSelector } from "../../dropdown/PlantSelector.js";
import "./index.css";
import { appConfig } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import { getStrategies } from "../../../actions/planActions";
import { FormSelector, FormTextArea } from "../FormInput/index.js";
const { frequencies } = appConfig;

export default function ProgramForm(props) {
  const { selection, save, onClose } = props;

  const { plant, year } = useSelector((state) => state.data);
  const fullProgramList = useSelector((state) => state.plan.programList); // allPrograms

  const [programList, setProgramList] = useState(props.programList); //filtered Program List
  const [planProgram, setPlanProgram] = useState({});
  const [program, setProgram] = useState({});
  const dispatch = useDispatch();

  useEffect(() => setProgramList(fullProgramList), [fullProgramList]);
  useEffect(() => console.log("selection", selection), [selection]);

  function selectProgram(name) {
    const program = programList.find((program) => program.name === name);
    setPlanProgram(
      program
        ? { name: name, year: program.year, plant: program.plant }
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
    if (!(plant && year && selection)) return;
    const newProgram = { plant };
    newProgram.device = selection
      .filter((dev) => dev.plant === plant)
      .map((dev) => dev.code);
    dispatch(getStrategies({ plant, year }));
    setPlanProgram(newProgram);
  }, [plant, selection, year, dispatch]);

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
        <div className="row justify-content-end">
          <button
            className="btn btn-close mx-2"
            onClick={() => props.onClose()}
          />
        </div>

        <div className="title">Programar grupo de equipos</div>

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

        <PlantSelector key={plant} />
        {!planProgram.plant && (
          <div className="errorMessage">Debe seleccionar una planta</div>
        )}

        <FormSelector
          label="Programa"
          defaultValue={program.name}
          options={programList ? programList.map((p) => p.name) : []}
          disabled={!planProgram.plant}
          onSelect={(e) => selectProgram(e.target.value)}
        />
        {!planProgram.name && (
          <div className="errorMessage">Debe seleccionar un programa</div>
        )}

        <FormSelector
          label="Frecuencia"
          defaultValue={program.name}
          options={frequencies || []}
          disabled={!planProgram.name}
          valueField={"weeks"}
          captionField={"frequency"}
          onSelect={(e) => setProgramItem("frequency", Number(e.target.value))}
        />
        {!planProgram.frequency && (
          <div className="errorMessage">Debe seleccionar una frecuencia</div>
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
          <div className="errorMessage">Debe seleccionar un responsable</div>
        )}

        <FormTextArea
          label="Comentarios"
          placeholder="Descripción o resumen de actividades, recomendaciones, etc."
          changeInput={(e) => setProgramItem("observations", e.target.value)}
        />

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
