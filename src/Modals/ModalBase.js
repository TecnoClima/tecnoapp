import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ModalBase({
  id,
  className,
  open,
  children,
  title,
  onClose,
}) {
  return (
    <dialog id={id} className="modal w-full h-full bg-black/50" open={open}>
      <div
        className={`modal-box w-full sm:max-w-lg px-2 sm:px-4 py-3 relative shadow-md shadow-secondary/20 ${className}`}
      >
        <div className="flex justify-between items-baseline mb-3">
          {title && <h3 className="text-lg font-bold">{title}</h3>}
          {onClose && (
            <button className="opacity-80 hover:opacity-100" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          )}
        </div>
        {children}
      </div>
    </dialog>
  );
}
