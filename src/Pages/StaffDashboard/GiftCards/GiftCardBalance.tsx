import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StaffAPI } from '@/lib/api';
import { useNavigate } from 'react-router';
import { ArrowLeft, Clipboard, Printer, Wallet, FileQuestion } from 'lucide-react';

interface GiftCardData { id?: number; code?: string; balance?: number; patientId?: number; createdAt?: string; updatedAt?: string }

const GiftCardBalance = () => {
  const navigate = useNavigate();
  const codeRef = useRef<HTMLInputElement | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GiftCardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => { codeRef.current?.focus(); }, []);

  // Debounce lookup
  useEffect(() => {
    if (!code.trim()) { setData(null); setError(null); return; }
    const h = setTimeout(async () => {
      try {
        setLoading(true); setError(null); setTouched(true);
        const res = await StaffAPI.giftCards.getBalance(code.trim());
        if (!res || res.error) { setData(null); setError('Gift card not found'); return; }
        setData(res);
      } catch {
        setData(null); setError('Gift card not found');
      } finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(h);
  }, [code]);

  const copyCode = async () => {
    if (!data?.code) return; await navigator.clipboard.writeText(data.code); setCopied(true); setTimeout(()=> setCopied(false), 1500);
  };

  const handlePrint = () => {
    if (!data) return;
    const w = window.open('', '_blank', 'width=480,height=600'); if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Gift Card Balance</title><style>body{font-family:system-ui,sans-serif;padding:16px;} .card{border:2px solid #111;padding:20px;border-radius:12px;max-width:360px} .code{font-size:1.3rem;font-weight:700;letter-spacing:1px;} .balance{font-size:1.1rem;margin-top:8px} .meta{font-size:.75rem;color:#555;margin-top:12px}</style></head><body><div class='card'><div class='code'>${data.code}</div><div class='balance'>Balance: ₹${data.balance}</div><div class='meta'>Patient: ${data.patientId ?? '-'}<br/>Issued: ${data.createdAt ? new Date(data.createdAt).toLocaleDateString(): ''}</div></div><script>window.onload=()=>{window.print();}</script></body></html>`);
    w.document.close();
  };

  const reset = () => { setCode(''); setData(null); setError(null); setTouched(false); codeRef.current?.focus(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Gift Card Balance</h1>
          <p className="text-gray-600">Check current balance and details of a gift card</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Lookup</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium" htmlFor="code">Gift Card Code *</label>
            <Input id="code" ref={codeRef} value={code} onChange={(e)=> setCode(e.target.value)} placeholder="Enter code" />
            {loading && <p className="text-xs text-muted-foreground">Looking up...</p>}
            {touched && !loading && !data && error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">Actions</label>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={copyCode} disabled={!data?.code}><Clipboard className="h-4 w-4 mr-1" /> {copied ? 'Copied' : 'Copy Code'}</Button>
              <Button type="button" variant="outline" onClick={handlePrint} disabled={!data}><Printer className="h-4 w-4 mr-1" /> Print</Button>
              {data?.code && <Button type="button" variant="secondary" onClick={()=> navigate(`/staff-dashboard/gift-cards/redeem?code=${encodeURIComponent(data.code!)}`)}>Redeem</Button>}
              <Button type="button" variant="ghost" onClick={reset}>Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" /> Balance</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : data ? (
                <div className="space-y-2">
                  <p className="text-3xl font-bold">₹{data.balance}</p>
                  <p className="text-xs text-muted-foreground">Code: <span className="font-mono">{data.code}</span></p>
                  <p className="text-xs text-muted-foreground">Patient ID: {data.patientId ?? '—'}</p>
                  {data.createdAt && <p className="text-xs text-muted-foreground">Issued: {new Date(data.createdAt).toLocaleDateString()}</p>}
                  {data.updatedAt && <p className="text-xs text-muted-foreground">Updated: {new Date(data.updatedAt).toLocaleDateString()}</p>}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Enter a code to view balance.</p>
                  <p>Supports real-time lookup.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader><CardTitle className="flex items-center gap-2"><FileQuestion className="h-5 w-5" /> History</CardTitle></CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground py-8 text-center border rounded-md bg-muted/20">Transaction history not implemented yet.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GiftCardBalance;
