import { faTableCellsRowLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export function CloseButton({
  onClick,
  missingRequiredFields,
  missingsubtaskValues,
  disabled,
}) {
  const hasMissingRequiredFields = missingRequiredFields?.length > 0;
  const hasMissingSubtaskValues = missingsubtaskValues?.length > 0;
  const displayAlertError = hasMissingRequiredFields || hasMissingSubtaskValues;

  const [display, setDisplay] = useState(false);

  return (
    <div className=" w-full sm:w-fit">
      {displayAlertError && (
        <div
          className={`absolute bottom-full alert alert-error right-0 w-80 max-w-full transition-all ${display ? "opacity-100 translate-y-0" : "translate-y-full opacity-0"}`}
        >
          <div>
            <div className="font-bold">Faltan datos</div>
            <ul className="list-disc pl-4">
              {hasMissingRequiredFields && (
                <li>Tiene campos requeridos sin completar</li>
              )}
              {hasMissingSubtaskValues && (
                <li>
                  Tiene {missingsubtaskValues.length} subtarea sin valor
                  asignado
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
      <button
        className="relative btn btn-sm btn-success sm:ml-2 w-full sm:w-fit"
        onClick={displayAlertError ? undefined : onClick}
        onMouseEnter={displayAlertError ? () => setDisplay(true) : undefined}
        onMouseLeave={displayAlertError ? () => setDisplay(false) : undefined}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={faTableCellsRowLock} />
        CERRAR
      </button>
    </div>
  );
}
