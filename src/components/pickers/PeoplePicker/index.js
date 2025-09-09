import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import noPic from "../../../assets/icons/worker.png";

const PeopleCard = (props) => {
  const { isSelected, select, item, selectedCaption } = props;

  function handleSelect(e) {
    e.preventDefault();
    select(item.id || item.idNumber);
  }

  return (
    <>
      <div className="md:w-1/2 px-1">
        <button
          className={`btn w-full p-0 ${
            isSelected ? "btn-info" : "btn-secondary btn-outline"
          }`}
          id={item.id}
          onClick={handleSelect}
        >
          <div className="flex gap-2 items-center w-full">
            <img
              className="w-12 max-w-full"
              src={item.imgURL || noPic}
              alt="sin foto"
            ></img>
            <div className="text-left text-sm">
              <b>{item.name}</b>
              <p>{item.charge}</p>
            </div>
          </div>
        </button>
        <div
          className="hidden col-sm-6 p-1 d-flex"
          style={{ maxWidth: "15rem" }}
          id={item.id}
        >
          <button
            className={`btn p-2 ${
              isSelected ? "btn-info" : "btn-secondary btn-outline"
            }`}
            onClick={handleSelect}
          >
            <div className="row">
              <div className="col-sm-3 p-1 m-auto" style={{ maxWidth: "5rem" }}>
                <img
                  className="img-fluid p-0"
                  src={item.imgURL || noPic}
                  alt="sin foto"
                ></img>
              </div>
              <div className="col-sm-8 p-0">
                <b>{item.name}</b>
                <p>{item.charge}</p>
              </div>
            </div>
            {item[selectedCaption] && item[selectedCaption][0] && (
              <div className="row" style={{ fontSize: "70%" }}>
                <div className="col-sm-5">
                  <b>{selectedCaption}: </b>
                </div>
                <div className="col-sm-7">
                  {item[selectedCaption].map((e, index) => (
                    <div
                      key={index}
                      className="bg-light m-1 p-0"
                      style={{ color: "black", borderRadius: ".5rem" }}
                    >
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default function PeoplePicker(props) {
  const { options, selectedWorkers, disabled, update } = props;
  const { userData } = useSelector((state) => state.people);
  const title = `${props.name}`;
  const [optionList, setOptions] = useState([]);
  const [idList, setIDList] = useState(props.idList || []);

  function updateList(worker) {
    const check = idList.find((element) => element.id === worker.id);
    const list = check
      ? idList.filter((element) => element.id !== worker.id)
      : [...idList, worker];
    setIDList(list);
    update(list);
  }

  useEffect(() => props.idList && setIDList(props.idList), [props.idList]);
  useEffect(() => setOptions(options), [options]);

  useEffect(() => {
    if (!selectedWorkers || !selectedWorkers.array[0]) return;
    const keys = Object.keys(selectedWorkers.array[0]);
    setOptions(
      options.map((option) => ({
        ...option,
        [selectedWorkers.caption]: selectedWorkers.array
          .filter((w) => w.id === option.id)
          .map((w) => w[keys[1]]),
      }))
    );
  }, [options, selectedWorkers]);

  function handleSelect(id) {
    if (id !== userData.id)
      updateList({
        id,
        name: optionList.find((e) => [e.id, e.idNumber].includes(id)).name,
      });
  }

  return (
    <>
      <div className="collapse bg-base-200">
        <input
          type="checkbox"
          className="input input-sm min-h-10 h-full"
          disabled={disabled}
        />
        <div className="collapse-title font-medium min-h-10 py-2 ">
          <div className="flex w-full gap-1 flex-wrap h-full items-center">
            {idList[0] && idList[0].name ? (
              idList.map((worker, index) => {
                return (
                  <div
                    key={index}
                    className="rounded-md w-fit px-2 border text-sm"
                  >
                    {worker.name}
                  </div>
                );
              })
            ) : (
              <div className="font-bold text-center">{title}</div>
            )}
          </div>
        </div>
        <div className="collapse-content bg-neutral/50 px-2 md:px-4">
          <div className="flex flex-col md:flex-row md:flex-wrap">
            {optionList[0] &&
              optionList
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((option, index) => (
                  <PeopleCard
                    key={index}
                    isSelected={idList
                      .map((e) => e.id)
                      .includes(option.id || option.idNumber)}
                    select={handleSelect}
                    selectedCaption={
                      selectedWorkers ? selectedWorkers.caption : undefined
                    }
                    item={option}
                  />
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
