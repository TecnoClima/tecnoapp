import { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const tabs = [
  { item: "workOrders", caption: "Ordenes" },
  { item: "subtask", caption: "Subtareas" },
  { item: "techTaskTemplates", caption: "Tareas" },
  //   { item: "device", caption: "Equipo" },
  //   { item: "users", caption: "Usuarios" },
];

export function AdminOptionsNav({ tabs }) {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const navigate = useNavigate();

  useEffect(() => {
    if (!tab) {
      navigate(`${tabs[0].href}`);
    }
  }, [tab]);

  return (
    <div role="tablist" className="tabs w-full tabs-lifted">
      {tabs.map(({ name, href }) => {
        const isActive = name === tab;
        return (
          <Link
            key={name}
            to={href}
            className={`tab text-center px-2 ${
              isActive
                ? "tab-active bg-gradient-to-b from-base-200 to-transparent"
                : "bg-gradient-to-b from-base-content/5 to-transparent"
            }`}
          >
            {name}
          </Link>
        );
      })}
    </div>
  );
}
