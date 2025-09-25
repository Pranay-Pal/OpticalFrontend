import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { ShopAdminAPI } from "@/lib/api";
import Pagination from "../Pagination/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Minimal types aligned to POSTMAN_TESTING_TODO.md
// summary: { totalStaff, totalSales, topPerformer }
// staffSales: Array<{ staffId, staffName, totalSales, totalOrders, avgOrderValue }>

type StaffSalesSummary = {
  totalStaff: number;
  totalSales: number;
  topPerformer: { staffId: number; staffName: string; totalSales: number } | null;
};

type StaffSalesItem = {
  staffId: number;
  staffName: string;
  totalSales: number;
  totalOrders?: number;
  avgOrderValue?: number;
};

type StaffSalesResponse = {
  summary: StaffSalesSummary;
  staffSales: StaffSalesItem[]; // fallback if API returns different key we will normalize
  period?: { startDate?: string; endDate?: string };
  // Sometimes APIs return different casing/keys; keep index signature for resilience
  [key: string]: any;
};

export default function StaffSalesReport() {
  const [data, setData] = useState<StaffSalesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Date range controls
  const [startDate, setStartDate] = useState<string>(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ShopAdminAPI.reports.getStaffSales(startDate, endDate);
      // Normalize possible shapes
      const items: StaffSalesItem[] = Array.isArray(res.staffSales)
        ? res.staffSales
        : Array.isArray(res.items)
          ? res.items
          : Array.isArray(res.data)
            ? res.data
            : Object.values(res.staffSales || {}).filter(Boolean);
      setData({ ...res, staffSales: items });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paginated = useMemo(() => {
    const items = data?.staffSales ?? [];
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [data, page]);

  const totalPages = useMemo(() => {
    const total = data?.staffSales?.length ?? 0;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [data]);

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="mb-4 p-4">
        <h2 className="font-bold mb-3">Sales by Staff</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div>
            <Button onClick={() => { setPage(1); load(); }} disabled={loading}>
              {loading ? "Loading..." : "Apply"}
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="mb-4 p-4 text-red-600">{error}</Card>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Staff</div>
          <div className="text-2xl font-semibold">{data?.summary?.totalStaff ?? 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Sales</div>
          <div className="text-2xl font-semibold">₹{data?.summary?.totalSales ?? 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Top Performer</div>
          <div className="text-2xl font-semibold">{data?.summary?.topPerformer?.staffName ?? "—"}</div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Staff Sales Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Total Sales</th>
                <th>Orders</th>
                <th>Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.staffId} className="border-b">
                  <td>{row.staffName}</td>
                  <td>₹{row.totalSales}</td>
                  <td>{row.totalOrders ?? "—"}</td>
                  <td>{row.avgOrderValue ? `₹${row.avgOrderValue}` : "—"}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted-foreground py-6">No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
