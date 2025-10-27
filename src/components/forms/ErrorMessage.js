export default function ErrorMessage({ children }) {
  return (
    <div className="relative h-0 overflow-visible">
      <div
        className="alert alert-error absolute top-0 -mt-1 py-1 px-2 rounded-md text-xs font-bold"
        role="alert"
        style={{ width: "100%" }}
      >
        {children}
      </div>
    </div>
  );
}
