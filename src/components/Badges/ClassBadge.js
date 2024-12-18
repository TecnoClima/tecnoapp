import { classBorderColor } from "../../utils/Constants";

export default function ClassBadge({ cls }) {
  return (
    <div className="flex w-full items-center">
      <div className={`flex-grow border ${classBorderColor[cls]}`} />
      <div
        className={`badge h-fit text-xs text-center w-fit border-2 bg-neutral/50 ${classBorderColor[cls]}`}
      >
        {cls}
      </div>
      <div className={`flex-grow border ${classBorderColor[cls]}`} />
    </div>
  );
}
