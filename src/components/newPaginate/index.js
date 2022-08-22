import { useEffect, useState } from "react";

export default function NewPaginate({ length, visible, size, select }) {
  const [indexes, setIndexes] = useState(() => {
    const array = [];
    for (let i = 1; i <= Number(visible + 1); i++) array.push(i);
    return array;
  });
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(Number(size) || 10);
  const [lastPage, setLastPage] = useState(
    Math.ceil(Number(length) / pageSize)
  );

  useEffect(() => {
    const delta = Math.floor(Number(visible) / 2);
    let min =
      Math.max(1, current - delta) - Math.max(delta - (lastPage - current), 0);
    let max = Math.min(min + 2 * delta);
    let arrayIndex = [];
    for (let i = min; i <= max; i++)
      if (i >= 1 && i <= lastPage) arrayIndex.push(i);
    setIndexes(arrayIndex);
  }, [current, lastPage, visible]);

  function handleClick(e) {
    e.preventDefault();
    let newCurrent = Number(e.target.value);
    setCurrent(newCurrent);
    select &&
      select((newCurrent - 1) * pageSize, newCurrent * pageSize, pageSize);
  }
  function handleSize(e) {
    e.preventDefault();
    let size = Number(e.target.value);
    let last = Math.ceil(length / size);
    setLastPage(last);
    setPageSize(size);
    let newCurrent = Math.min(current, last);
    select && select((newCurrent - 1) * size, newCurrent * size, size);
  }

  return (
    <div className="container-fluid p-0 d-flex align-content-center justify-content-center">
      <div className="row m-auto justify-content-center">
        <button
          className="col-auto btn btn-outline-primary py-0 px-1"
          title="Primera Página"
          onClick={handleClick}
          disabled={current === 1}
          value={1}
        >
          {"<<"}
        </button>
        {indexes.map((index, key) => (
          <button
            key={key}
            className={`col-auto btn px-1 py-0 ${
              index === current ? "btn-info" : "btn-outline-info"
            }`}
            style={{ minWidth: "1.5rem" }}
            disabled={index === current}
            onClick={handleClick}
            value={index}
          >
            {index}
          </button>
        ))}
        <button
          className="col-auto btn btn-outline-primary py-0 px-1"
          title="Última Página"
          onClick={handleClick}
          disabled={current === lastPage}
          value={lastPage}
        >
          {">>"}
        </button>
        {size && (
          <select
            className="form-select py-0 ps-1 pe-4"
            defaultValue={"" + pageSize}
            onChange={handleSize}
            style={{ width: "fit-content" }}
          >
            <option disabled>items/pág</option>
            {[10, 15, 20, 30, 50, 100, 200, 500, 1000].map((items) => (
              <option key={items} value={items}>{`${items}/pág`}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
