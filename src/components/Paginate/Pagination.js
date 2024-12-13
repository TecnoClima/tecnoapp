import { useState } from "react";

function PageButton({ value, isCurrent, onClick }) {
  return (
    <button
      value={value}
      onClick={onClick}
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

export default function Pagination({ length, current, select, size }) {
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

  return (
    <div className="join">
      {pagesArray.map((value, index) => (
        <PageButton
          key={index}
          value={isNaN(value) ? null : value}
          isCurrent={value === current}
          onClick={select}
        />
      ))}
    </div>
  );
}
