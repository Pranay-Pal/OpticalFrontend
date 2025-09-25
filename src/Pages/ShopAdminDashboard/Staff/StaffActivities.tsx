import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import Pagination from "../Pagination/Pagination";
import { Card } from "@/components/ui/card";
import { ShopAdminAPI } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type StaffActivity = {
  id?: number;
  type: string;
  description: string;
  amount?: number;
  timestamp: string;
};

export default function StaffActivities() {
  const { staffId } = useParams();
  const [activities, setActivities] = useState<StaffActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!staffId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ShopAdminAPI.staff.getActivities(parseInt(staffId), startDate, endDate);
        const list: StaffActivity[] = Array.isArray(res)
          ? res as StaffActivity[]
          : Array.isArray((res as any)?.activities)
            ? (res as any).activities
            : Array.isArray((res as any)?.data)
              ? (res as any).data
              : [];
        setActivities(list);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [staffId, startDate, endDate]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return activities.slice(start, start + pageSize);
  }, [activities, page]);
  const totalPages = Math.max(1, Math.ceil(activities.length / pageSize));

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-4 mb-4">
        <h2 className="font-bold mb-3">Staff Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => { setPage(1); /* effect will refetch */ }} disabled={loading}>
              {loading ? 'Loading...' : 'Apply'}
            </Button>
          </div>
        </div>
      </Card>

      {error && <Card className="mb-4 p-4 text-red-600">{error}</Card>}

      <Card className="p-4">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
            )}
            {!loading && paginated.map((act: StaffActivity, idx: number) => (
              <tr key={idx} className="border-b">
                <td>{act.type}</td>
                <td>{act.description}</td>
                <td>{act.amount ? `₹${act.amount}` : "-"}</td>
                <td>{new Date(act.timestamp).toLocaleString()}</td>
              </tr>
            ))}
            {!loading && paginated.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No activities</td></tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  );
}
