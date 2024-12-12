export default function ModalBase({ id, className, open, children }) {
  return (
    <dialog id={id} className="modal w-full h-full" open={open}>
      <div
        className={`modal-box bg-error text-error-content p-4 relative ${className}`}
      >
        {children}
      </div>
    </dialog>
  );
}
