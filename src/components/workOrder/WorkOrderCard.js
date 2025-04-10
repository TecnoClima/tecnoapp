export default function WorkOrderCard({
  title,
  children,
  className,
  headerButton,
}) {
  return (
    <div
      className={`card bg-base-content/10 p-2 text-sm w-1/4 min-w-72 md:min-w-80 max-w-full flex-grow ${className}`}
    >
      <div className="flex items-cetnter justify-between">
        <div className="font-bold text-base">{title}</div>
        {headerButton}
      </div>
      {children}
    </div>
  );
}
