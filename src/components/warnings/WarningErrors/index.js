import { useState } from "react";

export default function WarningErrors(props) {
  const { proceed, close } = props;
  const [warnings, setWarnings] = useState(props.warnings);
  function deleteWarning(e) {
    e.preventDefault();
    const index = Number(e.target.value);
    const newList = [...warnings];
    newList.splice(index, 1);
    if (newList[0]) {
      setWarnings(newList);
    } else {
      proceed();
      close();
    }
  }

  return (
    <>
      <dialog id="warning-modal" className="modal w-full h-full" open={true}>
        <div className="modal-box bg-warning text-warning-content p-4 relative">
          <h3 className="font-bold text-lg">¡ATENCIÓN!</h3>
          {warnings.map((warning, index) => (
            <div key={warning} className="flex gap-2">
              <p className="py-1">{warning}</p>
              <button
                type="button"
                className="btn btn-success btn-sm px-3"
                value={index}
                onClick={deleteWarning}
              >
                SI
              </button>
              <button
                type="button"
                className="btn btn-warning bg-neutral/30 btn-sm px-3"
                value={index}
                onClick={() => close()}
              >
                NO
              </button>
            </div>
          ))}
        </div>
      </dialog>
    </>
  );
}
