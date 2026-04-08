export function DataField({ label, children }) {
  const isValidValue = children !== null && children !== undefined;
  if (!isValidValue) return null;
  return (
    <div className="min-w-60 w-1/3 flex-grow">
      <b className="uppercase">{label}:</b> {children}
    </div>
  );
}
