import { useEffect, useMemo, useState } from "react";
import { ShopAdminAPI } from "@/lib/api";
import Pagination from "../Pagination/Pagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Provide flexible types to accommodate evolving backend shapes
type InventoryMovement = { id: number; productId?: number; product?: { id?: number; name?: string; sku?: string; category?: string }; type?: string; quantity: number; notes?: string; date?: string; createdAt?: string };
type InventorySummaryObject = { totalMovements?: number; stockIn?: number; stockOut?: number; [k: string]: any };
type InventoryResponse = {
  summary?: InventorySummaryObject | InventorySummaryObject[]; // backend may return object or array variant
  movements?: InventoryMovement[]; // canonical expected key
  details?: InventoryMovement[];   // alternate key fallback
  period?: { startDate?: string; endDate?: string };
  [key: string]: any;
};

export default function InventoryReport() {
  const [data, setData] = useState<InventoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().slice(0,10));

  // Pagination (movements list)
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ShopAdminAPI.reports.getInventory(typeFilter, startDate, endDate);
      // Normalize movements array (movements | details | data)
      const movements: InventoryMovement[] = Array.isArray(res.movements)
        ? res.movements
        : Array.isArray(res.details)
          ? res.details
          : Array.isArray(res.data)
            ? res.data
            : [];
      // Ensure summary is an object (if array given, merge first element)
      let summary: InventorySummaryObject | undefined;
      if (Array.isArray(res.summary)) {
        summary = res.summary.reduce((acc: any, cur: any) => ({ ...acc, ...cur }), {});
      } else {
        summary = res.summary;
      }
      setData({ ...res, summary, movements });
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

  const movements = data?.movements ?? [];
  const summaryObj: InventorySummaryObject | undefined = data && !Array.isArray(data.summary) ? data.summary : undefined;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return movements.slice(start, start + pageSize);
  }, [movements, page]);
  const totalPages = Math.max(1, Math.ceil(movements.length / pageSize));

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-4 p-4">
        <h2 className="font-bold mb-3">Inventory Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
            <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Type</label>
            <Select value={typeFilter} onValueChange={(v: string) => { setTypeFilter(v); }}>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="stock_in">Stock In</SelectItem>
                <SelectItem value="stock_out">Stock Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => { setPage(1); load(); }} disabled={loading}>{loading ? 'Loading...' : 'Apply'}</Button>
          </div>
        </div>
      </Card>

      {error && <Card className="mb-4 p-4 text-red-600">{error}</Card>}

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Movements</div>
          <div className="text-2xl font-semibold">{summaryObj?.totalMovements ?? movements.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Stock In</div>
          <div className="text-2xl font-semibold">{summaryObj?.stockIn ?? movements.filter(m => (m.type || '').toLowerCase().includes('in')).reduce((s,c)=> s + (c.quantity||0),0)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Stock Out</div>
          <div className="text-2xl font-semibold">{summaryObj?.stockOut ?? movements.filter(m => (m.type || '').toLowerCase().includes('out')).reduce((s,c)=> s + (c.quantity||0),0)}</div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-2">Movements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Notes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(m => (
                <tr key={m.id} className="border-b">
                  <td>{m.id}</td>
                  <td>{m.product?.name ?? m.productId ?? '—'}</td>
                  <td>{m.type ?? '—'}</td>
                  <td>{m.quantity}</td>
                  <td>{m.notes ?? '—'}</td>
                  <td>{m.date ? new Date(m.date).toLocaleDateString() : (m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—')}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted-foreground py-6">No data</td>
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
