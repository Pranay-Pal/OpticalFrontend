import { useEffect, useState } from 'react';
import { DoctorAPI } from '@/lib/api';
import type { Prescription, PrescriptionsListResponse } from '@/lib/types/doctor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import CreatePrescriptionForm from './CreatePrescriptionForm';
import PrescriptionDetail from './PrescriptionDetail';

export default function PrescriptionsPage() {
  const [items, setItems] = useState<Prescription[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res: PrescriptionsListResponse = await DoctorAPI.prescriptions.list({ page, limit });
      setItems(res.prescriptions);
      setTotal(res.total); setTotalPages(res.totalPages);
    } catch (e: any) {
      setError(e.message || 'Failed to load prescriptions');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [page, limit]);

  const onCreated = (id: number) => {
    toast.success(`Prescription #${id} created`);
    fetchData();
    setDetailId(id); // open detail view automatically
  };

  const downloadPdf = async (id: number) => {
    try {
      const blob = await DoctorAPI.prescriptions.getPdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `Prescription-${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) { toast.error(e.message || 'PDF failed'); }
  };
  const showThermal = async (id: number) => {
    try {
      const text = await DoctorAPI.prescriptions.getThermal(id);
      const w = window.open('', '_blank', 'width=600,height=800');
      if (!w) return; w.document.write(`<pre style="font-family:monospace;white-space:pre">${text}</pre>`); w.document.close();
    } catch (e: any) { toast.error(e.message || 'Thermal failed'); }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="lg:w-1/3 w-full">
          <CreatePrescriptionForm onCreated={onCreated} />
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Prescriptions</h2>
            <div className="text-xs text-muted-foreground">Total: {loading ? '...' : total}</div>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-[13px] sm:text-sm min-w-[620px]">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="p-2 sm:p-2 font-medium">ID</th>
                  <th className="p-2 sm:p-2 font-medium">Patient</th>
                  <th className="p-2 sm:p-2 font-medium whitespace-nowrap">Right (S/C/A)</th>
                  <th className="p-2 sm:p-2 font-medium whitespace-nowrap">Left (S/C/A)</th>
                  <th className="p-2 sm:p-2 font-medium">Created</th>
                  <th className="p-2 sm:p-2 font-medium">Actions</th>
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td colSpan={6} className="p-2 sm:p-2"><Skeleton className="h-6 w-full" /></td>
                    </tr>
                  ))}
                </tbody>
              ) : error ? (
                <tbody><tr><td colSpan={6} className="p-4 text-center text-destructive">{error}</td></tr></tbody>
              ) : items.length === 0 ? (
                <tbody><tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No prescriptions found.</td></tr></tbody>
              ) : (
                <tbody>
                  {items.map(p => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => setDetailId(p.id)}>
                      <td className="p-2 sm:p-2">{p.id}</td>
                      <td className="p-2 sm:p-2 font-medium max-w-[120px] truncate" title={p.patient?.name || ''}>{p.patient?.name || '—'}</td>
                      <td className="p-2 sm:p-2">{p.rightEye.sphere}/{p.rightEye.cylinder}/{p.rightEye.axis}</td>
                      <td className="p-2 sm:p-2">{p.leftEye.sphere}/{p.leftEye.cylinder}/{p.leftEye.axis}</td>
                      <td className="p-2 sm:p-2 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="p-2 sm:p-2">
                        <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="secondary" className="h-7 px-2" onClick={() => downloadPdf(p.id)}>PDF</Button>
                          <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => showThermal(p.id)}>Thermal</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            {total > limit && (
              <div className="flex items-center justify-between p-3 border-t bg-muted/30 text-xs">
                <div>Page {page} of {totalPages}</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={page === 1 || loading} onClick={() => setPage(p => Math.max(1,p-1))}>Prev</Button>
                  <Button size="sm" variant="outline" disabled={page >= totalPages || loading} onClick={() => setPage(p => Math.min(totalPages,p+1))}>Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <PrescriptionDetail id={detailId} onClose={() => setDetailId(null)} />
    </div>
  );
}
