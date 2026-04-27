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
    <div className="flex w-full sm:w-fit">
      {displayAlertError && display && (
        <div className="absolute bottom-full alert alert-error transition-all duration-[3s] overflow-hidden max-w-80 right-0">
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
