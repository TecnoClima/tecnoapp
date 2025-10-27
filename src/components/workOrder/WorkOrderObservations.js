import { useState } from "react";
import WorkOrderCard from "./WorkOrderCard";

export default function WorkOrderObservations({
  value,
  user,
  onSubmit,
  required,
}) {
  const [text, setText] = useState("");
  const today = new Date();

  function handleChange(e) {
    e.preventDefault();
    const value = e.currentTarget.value;
    setText(value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(`(${today.toLocaleDateString()} ${user}) ${text}`);
    setText("");
  }

  return (
    <WorkOrderCard title="OBSERVACIONES" required={required}>
      <textarea
        className="textarea textarea-bordered min-h-40 flex-grow"
        value={value}
        readOnly
      />
      <div className="flex w-full gap-2 mt-1">
        <textarea
          value={text}
          className="textarea textarea-bordered resize-none bg-base-content/10 py-0 flex-grow"
          onChange={handleChange}
        />
        <button className="btn btn-primary h-full" onClick={handleSubmit}>
          Guardar
        </button>
      </div>
    </WorkOrderCard>
  );
}
