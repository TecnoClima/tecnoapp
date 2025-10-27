import { useState } from "react";

export function Info({ text, className }) {
  const [hovers, setHovers] = useState(false);
  function onMouseEnter() {
    setHovers(true);
  }
  function onMouseLeave() {
    setHovers(false);
  }

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-base-content/10 border rounded-full w-5 h-5 flex items-center justify-center text-sm font-light cursor-pointer">
        i
      </div>
      {hovers && (
        <div
          className={`absolute w-60 bg-base-100 ${className} p-2 z-40 text-sm font-light border rounded-box`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
