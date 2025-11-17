import { Link, useSearchParams } from "react-router-dom";
import PendantDropdown from "./PendantDropdown";
import TableFilters from "./TableFilters";

export default function DataGrid({ data }) {
  const [searchParams] = useSearchParams();
  const hideNoReclaims = searchParams.get("hideNoReclaims") === "true";
  const hidePendingClose = searchParams.get("hidePendingClose") === "true";

  return (
    <div>
      <TableFilters />
      <table className="table">
        <thead>
          <tr className="text-center">
            <th className="text-left">Equipo</th>
            <th className="text-center">
              Último <br /> Mantenimiento
            </th>
            <th>Reclamos</th>
            <th title="Tiempo Medio Entre Fallos">
              MTBF
              <br />
              [días]
            </th>
            <th title="Tiempo Medio de Reparación">
              MTTR
              <br />
              [hs]
            </th>
          </tr>
        </thead>

        <tbody>
          {data
            .filter((item) => !hideNoReclaims || item.totalReclaims > 0)
            .filter(
              (item) => !hidePendingClose || item.pendingClose?.length === 0
            )
            .map((item) => (
              <tr className="text-center" key={item.device}>
                <td className="py-0 text-left">
                  <div>
                    <div className="font-bold">{item.device}</div>
                    <div className="text-sm text-base-content/75">
                      {item.name}
                    </div>
                  </div>
                </td>
                <td className="py-0">
                  {item.lastOrder ? (
                    <Link
                      className="link link-info"
                      to={`/ots/detail/${item.lastOrder}`}
                    >
                      {item.lastOrder}
                    </Link>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-0">
                  <div className="flex justify-center items-center">
                    {item.totalReclaims || "-"}
                    {item.pendingClose?.length > 0 && (
                      <PendantDropdown reclaims={item.pendingClose} />
                    )}
                  </div>
                </td>
                <td className="py-0">
                  {Math.round(item.mtbf * 100) / 100 || "-"}
                </td>
                <td className="py-0">
                  {Math.round(item.mttr * 100) / 100 || "-"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
