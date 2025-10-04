import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StaffAPI } from '@/lib/api';
import { useNavigate, useSearchParams } from 'react-router';
import { Loader2, ArrowLeft, Printer, RefreshCw, CheckCircle2 } from 'lucide-react';

interface PatientOption { id: number; name?: string; phone?: string }
interface GiftCardResponse { id?: number; code?: string; balance?: number; patientId?: number; createdAt?: string }

const GiftCardIssue = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const prefillPatientId = params.get('patientId');
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | ''>(prefillPatientId ? Number(prefillPatientId) : '');
  const [balance, setBalance] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [issued, setIssued] = useState<GiftCardResponse | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const fetchPatients = async (q?: string) => {
    try {
      setPatientsLoading(true);
      // Using patients API (assuming StaffAPI.patients.getAll like earlier usage or fallback)
      const res = await StaffAPI.patients?.getAll?.({ page: 1, limit: 50, search: q })?.then((r: any) => r.data || r) ?? [];
      const list = (res?.patients || res || []).map((p: any) => ({ id: p.id, name: p.name, phone: p.phone }));
      setPatients(list);
    } catch {
      // ignore
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);
  useEffect(() => { const id = setTimeout(()=> fetchPatients(patientSearch), 350); return () => clearTimeout(id); }, [patientSearch]);

  const validate = () => {
    const errs: string[] = [];
    if (!selectedPatientId) errs.push('Patient is required');
    const bal = Number(balance);
    if (!(bal > 0)) errs.push('Balance must be greater than 0');
    setValidationErrors(errs);
    return errs.length === 0;
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true); setError(null); setIssued(null);
      const payload = { patientId: Number(selectedPatientId), balance: Number(balance) };
      const res = await StaffAPI.giftCards.issue(payload);
      setIssued(res);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Issue failed';
      setError(msg);
    } finally { setSubmitting(false); }
  };

  const resetForm = () => {
    setBalance('');
    if (!prefillPatientId) setSelectedPatientId('');
    setIssued(null);
    setValidationErrors([]);
    setError(null);
  };

  const handlePrint = () => {
    if (!issued || !cardRef.current) return;
    const printWindow = window.open('', '_blank', 'width=480,height=600');
    if (!printWindow) return;
    const html = cardRef.current.outerHTML;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Gift Card</title><style>body{font-family:system-ui,sans-serif;padding:16px;} .gc{border:2px dashed #444;padding:20px;border-radius:12px;max-width:360px} .code{font-size:1.5rem;font-weight:700;letter-spacing:2px;margin-top:4px} .balance{font-size:1.1rem;margin-top:8px} .meta{font-size:.75rem;color:#555;margin-top:12px}</style></head><body>${html}<script>window.onload=()=>{window.print();}</script></body></html>`);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Issue Gift Card</h1>
          <p className="text-gray-600">Create a new gift card for a patient</p>
        </div>
      </div>

      <form onSubmit={handleIssue} className="space-y-6" noValidate>
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {validationErrors.length > 0 && (
          <Alert variant="destructive"><AlertDescription><ul className="list-disc list-inside space-y-1">{validationErrors.map(v => <li key={v}>{v}</li>)}</ul></AlertDescription></Alert>
        )}
        {issued && !error && (
          <Alert className="border-green-500/40"><AlertDescription className="text-green-700 flex flex-col gap-1"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Gift card issued successfully.</span><span className="text-xs">You can print or issue another.</span></AlertDescription></Alert>
        )}

        <Card className="glass-card">
          <CardHeader><CardTitle>Gift Card Details</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium">Patient *</label>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <Input placeholder="Search patients" value={patientSearch} onChange={(e)=> setPatientSearch(e.target.value)} className="h-9" />
                  <Button type="button" variant="outline" size="sm" onClick={()=> fetchPatients(patientSearch)} disabled={patientsLoading}><RefreshCw className={`h-4 w-4 ${patientsLoading? 'animate-spin':''}`} /></Button>
                </div>
                <select className="w-full border rounded-md bg-background px-2 py-2 h-10" value={selectedPatientId} onChange={(e)=> setSelectedPatientId(e.target.value ? Number(e.target.value) : '')} disabled={!!prefillPatientId}>
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name || 'Unnamed'} {p.phone ? `(${p.phone})`: ''}</option>)}
                </select>
                {patientsLoading && <p className="text-xs text-muted-foreground">Loading...</p>}
              </div>
            </div>
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium" htmlFor="balance">Balance *</label>
              <Input id="balance" type="number" min={1} value={balance} onChange={(e)=> setBalance(e.target.value)} placeholder="Amount" />
            </div>
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium">Preview</label>
              <div ref={cardRef} className="gc bg-white shadow-inner border rounded-md p-3 text-center select-none">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Gift Card</div>
                <div className="code font-mono">{issued?.code || 'XXXX-XXXX'}</div>
                <div className="balance font-medium">₹{issued?.balance ?? (balance || '0')}</div>
                <div className="meta">{issued?.createdAt ? new Date(issued.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 flex-wrap">
          <Button type="submit" disabled={submitting} className="min-w-[150px]">{submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Issue Card</Button>
          <Button type="button" variant="outline" onClick={resetForm} disabled={submitting}>Reset</Button>
          {issued && <Button type="button" variant="secondary" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" /> Print</Button>}
        </div>
        <p className="text-xs text-muted-foreground">Fields marked * are required.</p>
      </form>
    </div>
  );
};

export default GiftCardIssue;
