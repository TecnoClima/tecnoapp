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
    <div
      className="col-sm-6 p-1 d-flex"
      style={{ maxWidth: "15rem" }}
      id={item.id}
    >
      <button
        className={`rounded-3 container p-2 ${
          isSelected ? "btn-info" : "btn-outline-secondary"
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
    <div className="col">
      <div className="accordion" id="accordionExample">
        <div className="accordion-item d-grid gap-2">
          <button
            className={`rounded-3 ${
              idList[0] && idList[0].name ? "btn-primary" : "btn-secondary"
            } d-flex flex-wrap p-1`}
            style={{ zIndex: "unset" }}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            id="OptionPickerVisibleOption"
            disabled={disabled}
          >
            {idList[0] && idList[0].name
              ? idList.map((worker, index) => {
                  return (
                    <div
                      key={index}
                      className="rounded-3 px-1 btn-info m-1 p-0"
                    >
                      {worker.name}
                    </div>
                  );
                })
              : title}
          </button>
          <div
            id="collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body p-1">
              <div
                className="container"
                style={{ maxHeight: "50vh", overflowY: "auto" }}
              >
                <div className="row">
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
                            selectedWorkers
                              ? selectedWorkers.caption
                              : undefined
                          }
                          item={option}
                        />
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
