import { useEffect, useState } from 'react';
import { DoctorAPI } from '@/lib/api';
import type { Patient, PatientsResponse } from '@/lib/types/doctor';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

function LoadingRows() {
  return (
    <tbody>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b last:border-0">
          <td colSpan={7} className="p-2">
            <Skeleton className="h-6 w-full" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const totalPages = Math.max(1, Math.ceil(count / limit));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        // Attempt pagination params; backend will ignore if unsupported
        const res: PatientsResponse = await DoctorAPI.patients.getAll();
        if (cancelled) return;
        setPatients(res.data || []);
        setCount(res.count || (res.data?.length ?? 0));
      } catch (e: any) {
        if (cancelled) return; 
        setError(e.message || 'Failed to load patients');
        toast.error(e.message || 'Failed to load patients');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page, limit]);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold">Patients</h2>
        <div className="text-xs sm:text-sm text-muted-foreground">Total: {loading ? '...' : count}</div>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-[13px] sm:text-sm min-w-[680px]">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-2 sm:p-2 font-medium">ID</th>
              <th className="p-2 sm:p-2 font-medium">Name</th>
              <th className="p-2 sm:p-2 font-medium">Age</th>
              <th className="p-2 sm:p-2 font-medium">Gender</th>
              <th className="p-2 sm:p-2 font-medium">Phone</th>
              <th className="p-2 sm:p-2 font-medium whitespace-nowrap">Last Visit</th>
              <th className="p-2 sm:p-2 font-medium">Shop</th>
            </tr>
          </thead>
          {loading ? (
            <LoadingRows />
          ) : error ? (
            <tbody>
              <tr>
                <td colSpan={7} className="p-4 text-center text-destructive">
                  {error}
                </td>
              </tr>
            </tbody>
          ) : patients.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  No patients found.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {patients.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-2 sm:p-2">{p.id}</td>
                  <td className="p-2 sm:p-2 font-medium max-w-[140px] truncate" title={p.name}>{p.name}</td>
                  <td className="p-2 sm:p-2">{p.age ?? '-'}</td>
                  <td className="p-2 sm:p-2">{p.gender ?? '-'}</td>
                  <td className="p-2 sm:p-2">{p.phone ?? '-'}</td>
                  <td className="p-2 sm:p-2 whitespace-nowrap">{p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : '-'}</td>
                  <td className="p-2 sm:p-2 max-w-[140px] truncate" title={p.shop?.name}>{p.shop?.name ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {/* Pagination (hidden if only one page or backend doesn't support) */}
        {count > limit && (
          <div className="flex items-center justify-between p-3 border-t bg-muted/30">
            <div className="text-xs text-muted-foreground">Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 rounded border text-xs disabled:opacity-50"
              >Prev</button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded border text-xs disabled:opacity-50"
              >Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}