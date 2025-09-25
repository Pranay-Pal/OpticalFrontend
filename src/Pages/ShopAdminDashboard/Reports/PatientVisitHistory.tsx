import { useEffect, useMemo, useState } from "react";
import { ShopAdminAPI } from "@/lib/api";
import Pagination from "../Pagination/Pagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router";

type Visit = {
  id: number; visitDate: string; purpose: string; notes: string;
  patient: { name: string; age: number; phone: string }
};

export default function PatientVisitHistory() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Filters with query param defaults
  const [patientId, setPatientId] = useState<number>(() => {
    const v = params.get('patientId');
    return v ? Number(v) : 0;
  });
  const [startDate, setStartDate] = useState<string>(() => params.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
  const [endDate, setEndDate] = useState<string>(() => params.get('endDate') || new Date().toISOString().slice(0,10));

  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const load = async () => {
    if (!patientId) {
      setVisits([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await ShopAdminAPI.reports.getPatientVisits(patientId, startDate, endDate);
      // Normalize array or envelope shapes
      const list: Visit[] = Array.isArray(res)
        ? res as Visit[]
        : Array.isArray((res as any)?.visits)
          ? (res as any).visits
          : Array.isArray((res as any)?.data)
            ? (res as any).data
            : [];
      setVisits(list);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return visits.slice(start, start + pageSize);
  }, [visits, page]);
  const totalPages = Math.max(1, Math.ceil(visits.length / pageSize));

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-4 p-4">
        <h2 className="font-bold mb-3">Patient Visit History</h2>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Patient ID</label>
            <Input type="number" value={patientId || ''} placeholder="Enter patient id"
              onChange={(e) => setPatientId(Number(e.target.value))} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => { setPage(1); load(); }} disabled={loading || !patientId}>
              {loading ? 'Loading...' : 'Apply'}
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">Tip: You can deep-link using query params, e.g. ?patientId=123&startDate=2025-09-01&endDate=2025-09-30</div>
      </Card>

      {error && <Card className="mb-4 p-4 text-red-600">{error}</Card>}

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Visits</h3>
          <div className="text-sm text-muted-foreground">Total: {visits.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Date</th>
                <th>Purpose</th>
                <th>Notes</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              )}
              {!loading && paginated.map((visit: Visit) => (
                <tr key={visit.id} className="border-b">
                  <td>{visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : '—'}</td>
                  <td>{visit.purpose || '—'}</td>
                  <td>{visit.notes || '—'}</td>
                  <td>{visit.patient?.name || '—'}</td>
                  <td>{visit.patient?.age ?? '—'}</td>
                  <td>{visit.patient?.phone || '—'}</td>
                </tr>
              ))}
              {!loading && paginated.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No visits</td></tr>
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
