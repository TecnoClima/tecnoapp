export function StatusBadge({ order, className = "" }) {
  const isClosed = order.status === "Cerrada";
  const toClose = order.completed === 99 && !isClosed;

  return (
    <div
      className={`badge w-fit flex-none ${className} ${
        toClose
          ? "badge-success badge-outline"
          : isClosed
          ? "badge-success"
          : "badge-error"
      }`}
    >
      {toClose ? "Orden a cerrar" : order.status}
    </div>
  );
}
