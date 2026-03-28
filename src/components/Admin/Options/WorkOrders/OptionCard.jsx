import { appConfig } from "../../../../config";
import { CreateOrderOptionValues } from "./CreateOrderOptionValues";
const { headersRef } = appConfig;

export function OptionCard({ options, targetCollection, type }) {
  const order = (Math.max(...options.map(({ order }) => order)) || 0) + 1;

  return (
    <div className="relative card w-full bg-base-content/5 p-2">
      <div className="card-title mb-3">{headersRef[type] || type}</div>
      <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        {options.map((o) => (
          <div
            key={o._id}
            className="badge text-center w-full min-h-fit flex-grow h-6"
          >
            {o.label}
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2">
        <CreateOrderOptionValues
          order={order}
          targetCollection={targetCollection}
          type={type}
        />
      </div>
    </div>
  );
}
