import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { planActions } from "../../../actions/StoreActions";
import "./index.css";

export default function CalendarPicker(props) {
  const { year, task, yearDates } = props;
  const { dates, frequency } = task;
  const [taskDates, setTaskDates] = useState([]);
  const [firstDate, setFirstDate] = useState("");
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const [stringDates, setStringDates] = useState(
    taskDates
      ? taskDates.map((date) => new Date(date).toLocaleDateString())
      : []
  );
  const dispatch = useDispatch();

  useEffect(
    () =>
      setFirstDate(
        taskDates[0]
          ? `${taskDates[0].getDate()}/${taskDates[0].getMonth() + 1}`
          : ""
      ),
    [taskDates]
  );

  useEffect(
    () => setTaskDates(dates.map((date) => new Date(date.date))),
    [dates]
  );

  useEffect(
    () =>
      setStringDates(
        taskDates.map((date) => date.toLocaleDateString().split(" ")[0])
      ),
    [taskDates]
  );

  async function setAllDates(event) {
    event.preventDefault();
    let index = Number(event.target.value);
    let datesInput = [];
    //set first date
    let date = new Date(yearDates[index]);
    while (date && date.getMonth() + 1) {
      //new DatesArray push
      datesInput.push({ date: date, orders: [] });
      //set new date adding frequency
      index += frequency;
      let newDate = new Date(yearDates[index]);
      //check for months issues
      if (newDate && frequency % 4 === 0) {
        if (newDate.getMonth() - date.getMonth() < frequency / 4) {
          let monthDates = yearDates.filter(
            (e) => new Date(e).getMonth() === newDate.getMonth() + 1
          );
          if (monthDates[0]) newDate = new Date(monthDates[0]);
        }
      }
      //finally got date
      date = newDate;
    }
    datesInput = [
      ...datesInput,
      ...dates.filter((date) => !!(date.orders && date.orders[0])),
    ];
    setTaskDates(datesInput.map((item) => new Date(item.date)));
    setStringDates(
      datesInput.map(
        (item) => new Date(item.date).toLocaleDateString().split(" ")[0]
      )
    );

    dispatch(
      planActions.setDates({
        year,
        strategy: task.strategy,
        device: task.code,
        dates: datesInput,
      })
    );
  }

  return (
    <tr style={{ fontSize: "80%" }}>
      <td className="p-0">
        <div>
          <div style={{ minWidth: "fit-content" }}>
            <b>{task.device.name}</b>
          </div>
          <div>
            {task
              ? `${task.strategy} ${
                  task.responsible ? `(${task.responsible.name})` : ""
                }`
              : "SIN PROGRAMA"}
          </div>
        </div>
      </td>
      <td className="p-0">
        <div className="d-flex align-items-center" style={{ height: "2rem" }}>
          <input
            className="form-control p-0 mx-auto text-center"
            style={{ width: "3rem", fontSize: "100%" }}
            type="text"
            placeholder={"dd/mm"}
            value={firstDate}
            readOnly={true}
          />
        </div>
      </td>
      {months.map((item, index) => (
        <td
          key={index}
          id={index}
          className="p-0"
          style={{
            borderTop: "none",
            borderBottom: "none",
            borderLeft: "1px solid grey",
            borderRight: "1px solid grey",
          }}
        >
          <div
            className="d-flex align-content-center w-100 justify-content-evenly"
            style={{ height: "2rem" }}
          >
            {yearDates
              .filter((date) => new Date(date).getMonth() === index)
              .map((element) => {
                const date = new Date(element).toLocaleDateString();
                const weekIndex = yearDates.findIndex(
                  (e) => new Date(e).toLocaleDateString() === date
                );
                const dateObject = dates.find(
                  (item) => item.date === element.toISOString()
                );
                const orders = dateObject && dateObject.orders;

                return (
                  <button
                    key={weekIndex}
                    className={`btn p-0 my-auto ${
                      stringDates.includes(date)
                        ? orders && orders[0]
                          ? "btn-warning"
                          : "btn-success"
                        : "btn-outline-success"
                    }`}
                    style={{ height: "1rem", width: ".8rem" }}
                    value={weekIndex}
                    onClick={(e) => setAllDates(e)}
                    title={
                      date.split("/").splice(0, 2).join("/") +
                      (orders && orders[0]
                        ? ` - tiene órdenes asociadas: ${orders.join(", ")}`
                        : "")
                    }
                  />
                );
              })}
          </div>
        </td>
      ))}
    </tr>
  );
}
