import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { deviceActions } from "../../actions/StoreActions.js";
import DataGrid from "./Datagrid.js";
import { ReportFilters } from "./Filters.js";

const getCurrentMonth = (diff = 0) => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() + diff, 1)
    .toISOString()
    .split("T")[0];
  const to = new Date(now).toISOString().split("T")[0];
  return { from, to };
};

export default function Reports() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { reportData } = useSelector((state) => state.devices);

  const [filters, setFilters] = useState({
    plant: searchParams.get("plant") || "",
    from: searchParams.get("from") || getCurrentMonth().from,
    to: searchParams.get("to") || getCurrentMonth(-1).to,
  });

  useEffect(() => {
    if (!filters.plant || !filters.from || !filters.to) return;
    dispatch(deviceActions.getReportKPIs(filters));
  }, [filters, dispatch]);

  const fullFilters = filters.plant && filters.from && filters.to;

  return (
    <div className="page-container">
      <div className="page-title">Reportes</div>
      <ReportFilters filters={filters} setFilters={setFilters} />
      {fullFilters && reportData && <DataGrid data={reportData} />}
    </div>
  );
}
