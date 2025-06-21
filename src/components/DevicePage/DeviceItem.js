export default function DeviceItem({ children, value = "" }) {
  return (
    <div className="join flex-grow">
      <label
        className="label w-8 text-sm join-item h-8 bg-primary/20 px-2"
        htmlFor="inputGroupSelect01"
      >
        {children}
      </label>
      <input
        className="input input-sm join-item flex-grow w-40 cursor-default"
        value={value}
        readOnly
      />
    </div>
  );
}
