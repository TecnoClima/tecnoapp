export default function WorkOrderCard({
  title,
  children,
  className = "",
  headerButton,
  required,
}) {
  return (
    <div className={`card bg-base-content/10 p-2 text-sm w-full ${className}`}>
      <div className="flex items-cetnter justify-between">
        <div className="flex items-center gap-2">
          <div className="font-bold text-base w-full">{title}</div>
          {required && (
            <div
              title="campo requerido"
              className="badge badge-primary badge-xs font-normal"
            >
              Req
            </div>
          )}
        </div>
        {headerButton}
      </div>
      {children}
    </div>
  );
}
