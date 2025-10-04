import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StaffAPI } from '@/lib/api';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, CheckCircle2, Receipt } from 'lucide-react';

interface BalanceData { code?: string; balance?: number; patientId?: number; updatedAt?: string; id?: number }
interface RedeemResponse { balance?: number; code?: string; amount?: number; message?: string }

const GiftCardRedeem = () => {
  const navigate = useNavigate();
  const codeInputRef = useRef<HTMLInputElement | null>(null);
  const [code, setCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [amount, setAmount] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [result, setResult] = useState<RedeemResponse | null>(null);

  // Debounced balance lookup
  useEffect(() => {
    if (!code.trim()) { setBalanceData(null); return; }
    const handle = setTimeout(async () => {
      try {
        setLookupLoading(true); setError(null);
        const res = await StaffAPI.giftCards.getBalance(code.trim());
        setBalanceData(res);
      } catch (e) {
        setBalanceData(null);
      } finally { setLookupLoading(false); }
    }, 400);
    return () => clearTimeout(handle);
  }, [code]);

  useEffect(() => { codeInputRef.current?.focus(); }, []);

  const validate = () => {
    const errs: string[] = [];
    if (!code.trim()) errs.push('Gift card code is required');
    const amt = Number(amount);
  const bal = Number(balanceData?.balance ?? 0);
    if (!(amt > 0)) errs.push('Redeem amount must be greater than 0');
    if (bal && amt > bal) errs.push('Amount cannot exceed current balance');
    setValidationErrors(errs); return errs.length === 0;
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setRedeeming(true); setError(null); setResult(null);
      const payload = { code: code.trim(), amount: Number(amount) };
      const res = await StaffAPI.giftCards.redeem(payload);
      setResult(res);
      // attempt update balance display
      try { const newBal = await StaffAPI.giftCards.getBalance(code.trim()); setBalanceData(newBal); } catch {}
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Redeem failed';
      setError(msg);
    } finally { setRedeeming(false); }
  };

  const resetForm = () => {
    setCode(''); setAmount(''); setValidationErrors([]); setError(null); setResult(null); setBalanceData(null); codeInputRef.current?.focus();
  };

  const currentBalance = Number(balanceData?.balance ?? 0) || 0;
  const postBalance = result ? Number(result.balance ?? (currentBalance - Number(amount))) : (currentBalance - (Number(amount) || 0));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Redeem Gift Card</h1>
          <p className="text-gray-600">Apply a gift card to a purchase or reduce its balance</p>
        </div>
      </div>

      <form onSubmit={handleRedeem} className="space-y-6" noValidate>
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {validationErrors.length > 0 && (
          <Alert variant="destructive"><AlertDescription><ul className="list-disc list-inside space-y-1">{validationErrors.map(v => <li key={v}>{v}</li>)}</ul></AlertDescription></Alert>
        )}
        {result && !error && (
          <Alert className="border-green-500/40"><AlertDescription className="text-green-700 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Redeemed ₹{result.amount} successfully.</AlertDescription></Alert>
        )}

        <Card className="glass-card">
          <CardHeader><CardTitle>Gift Card Redemption</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium" htmlFor="code">Gift Card Code *</label>
              <Input id="code" ref={codeInputRef} value={code} onChange={(e)=> setCode(e.target.value)} placeholder="Enter code" />
              {lookupLoading && <p className="text-xs text-muted-foreground">Looking up...</p>}
              {code && !lookupLoading && !balanceData && <p className="text-xs text-red-500">Not found</p>}
            </div>
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium" htmlFor="amount">Redeem Amount *</label>
              <Input id="amount" type="number" min={1} value={amount} onChange={(e)=> setAmount(e.target.value)} placeholder="Amount" />
              {currentBalance > 0 && <p className="text-xs text-muted-foreground">Current Balance: ₹{currentBalance}</p>}
            </div>
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium">Balances</label>
              <div className="rounded-md border p-3 bg-white text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Current</span><span>₹{currentBalance}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Redeem</span><span>₹{Number(amount) || 0}</span></div>
                <div className="flex justify-between font-medium"><span>After</span><span>₹{postBalance < 0 ? 0 : postBalance}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="glass-card">
            <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-4 w-4" /> Redemption Receipt</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Code:</strong> {result.code || code}</p>
              <p><strong>Redeemed:</strong> ₹{result.amount ?? Number(amount)}</p>
              <p><strong>Remaining:</strong> ₹{postBalance < 0 ? 0 : postBalance}</p>
              {balanceData?.patientId && <p><strong>Patient ID:</strong> {balanceData.patientId}</p>}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 flex-wrap">
          <Button type="submit" disabled={redeeming} className="min-w-[150px]">{redeeming && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Redeem</Button>
          <Button type="button" variant="outline" onClick={resetForm} disabled={redeeming}>Reset</Button>
          <Button type="button" variant="outline" onClick={()=> code && setAmount(String(currentBalance))} disabled={!code || !currentBalance || redeeming}>Redeem Full</Button>
        </div>
        <p className="text-xs text-muted-foreground">Fields marked * are required.</p>
      </form>
    </div>
  );
};

export default GiftCardRedeem;
