import { useEffect, useState } from 'react';
import { DoctorAPI } from '@/lib/api';
import type { Prescription } from '@/lib/types/doctor';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props { id: number | null; onClose: () => void; }

export default function PrescriptionDetail({ id, onClose }: Props) {
  const [data, setData] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await DoctorAPI.prescriptions.getById(id);
        if (!cancelled) setData(res as any);
      } catch (e: any) {
        if (!cancelled) { setError(e.message || 'Failed to load'); }
      } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const downloadPdf = async () => {
    if (!id) return;
    try {
      const blob = await DoctorAPI.prescriptions.getPdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `Prescription-${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) { toast.error(e.message || 'PDF failed'); }
  };
  const showThermal = async () => {
    if (!id) return;
    try {
      const text = await DoctorAPI.prescriptions.getThermal(id);
      const w = window.open('', '_blank', 'width=600,height=800');
      if (!w) return;
      w.document.write(`<pre style="font-family:monospace;white-space:pre">${text}</pre>`);
      w.document.close();
    } catch (e: any) { toast.error(e.message || 'Thermal fetch failed'); }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition ${id ? 'opacity-100' : 'pointer-events-none opacity-0'}`}> 
      <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sm">Prescription Detail{ id && ` #${id}`}</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && <Skeleton className="h-40 w-full" />}
          {error && <p className="text-destructive text-sm">{error}</p>}
          {!loading && !error && data && (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Patient</h4>
                <p>{data.patient?.name || '—'} (ID {data.patientId})</p>
                {data.patient?.phone && <p className="text-muted-foreground">{data.patient.phone}</p>}
              </div>
              <div>
                <h4 className="font-medium mb-1">Right Eye</h4>
                <p>Sph {data.rightEye.sphere} | Cyl {data.rightEye.cylinder} | Axis {data.rightEye.axis} | Add {data.rightEye.add ?? 0}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Left Eye</h4>
                <p>Sph {data.leftEye.sphere} | Cyl {data.leftEye.cylinder} | Axis {data.leftEye.axis} | Add {data.leftEye.add ?? 0}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Created: {new Date(data.createdAt).toLocaleString()}</div>
                <div>Updated: {new Date(data.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
        {id && (
          <div className="p-4 border-t flex items-center gap-2">
            <Button size="sm" onClick={downloadPdf} variant="secondary">PDF</Button>
            <Button size="sm" onClick={showThermal} variant="outline">Thermal</Button>
          </div>
        )}
      </div>
    </div>
  );
}
