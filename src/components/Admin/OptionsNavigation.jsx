import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const tabs = [
  { item: "workOrders", caption: "Ordenes" },
  { item: "subtask", caption: "Subtareas" },
  //   { item: "device", caption: "Equipo" },
  //   { item: "users", caption: "Usuarios" },
];

export function AdminOptionsNav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  useEffect(() => {
    if (!tab) {
      setSearchParams({ tab: tabs[0].caption });
    }
  }, [tab]);

  function handleClick(e) {
    e.preventDefault();
    setSearchParams({ tab: e.currentTarget.value });
  }

  return (
    <div role="tablist" className="tabs w-full tabs-lifted">
      {tabs.map(({ item, caption }) => {
        const isActive = caption === tab;
        return (
          <button
            key={item}
            onClick={handleClick}
            value={caption}
            className={`tab text-center px-2 ${
              isActive
                ? "tab-active bg-gradient-to-b from-base-200 to-transparent"
                : "bg-gradient-to-b from-base-content/5 to-transparent"
            }`}
          >
            {caption}
          </button>
        );
      })}
    </div>
  );
}
