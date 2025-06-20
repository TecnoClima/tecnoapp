function PageButton({ value, isCurrent, setPage }) {
  function handleClick(e) {
    e.preventDefault();
    const value = e.currentTarget.value;
    setPage(value);
  }
  return (
    <button
      value={value}
      onClick={handleClick}
      className={`join-item btn btn-xs bg-base-content/20 border-transparent hover:bg-base-content/5 hover:border-base-content ${
        !value
          ? `btn-disabled`
          : isCurrent
          ? "disabled:bg-base-content/50 disabled:text-base-100"
          : ""
      }`}
      disabled={!value || isCurrent}
    >
      {value || "..."}
    </button>
  );
}

export default function Pagination({
  length,
  current,
  size,
  setSize,
  setPage,
}) {
  const pagesArray = [];
  const pages = Math.ceil(length / size);
  if (pages <= 9) {
    for (let i = 1; i <= pages; i++) {
      pagesArray.push(i);
    }
  } else {
    if (current <= 5) {
      pagesArray.push(1, 2, 3, 4, 5, 6, 7, "...", pages);
    } else if (current >= pages - 3) {
      pagesArray.push(
        1,
        "...",
        pages - 6,
        pages - 5,
        pages - 4,
        pages - 3,
        pages - 2,
        pages - 1,
        pages
      );
    } else {
      pagesArray.push(
        1,
        "...",
        current - 2,
        current - 1,
        current,
        current + 1,
        current + 2,
        "...",
        pages
      );
    }
  }

  function handleResize(e) {
    e.preventDefault();
    const newSize = e.target.value;
    const newCurrent = Math.min(Math.floor((size * current) / newSize) - 1, 1);
    setPage(newCurrent);
    setSize(newSize);
  }

  return (
    <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
      <div className="join">
        {pagesArray.map((value, index) => (
          <PageButton
            key={index}
            value={isNaN(value) ? null : value}
            isCurrent={value === current}
            setPage={setPage}
          />
        ))}
      </div>
      {setSize && (
        <select
          className="select select-bordered select-sm"
          value={size}
          onChange={handleResize}
        >
          <option disabled>items/pág</option>
          {[10, 15, 20, 30, 50, 100, 200, 500, 1000].map((item) => (
            <option key={item} value={item}>{`${item}/pág`}</option>
          ))}
        </select>
      )}
    </div>
  );
}
