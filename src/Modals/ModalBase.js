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
    <dialog id={id} className="modal w-full h-full bg-black/30" open={open}>
      <div className={`modal-box p-4 relative ${className}`}>
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
