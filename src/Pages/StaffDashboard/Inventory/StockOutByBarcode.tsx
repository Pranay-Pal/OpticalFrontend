import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StaffAPI } from '@/lib/api';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, Minus, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ProductInfo { id?: number; name?: string; barcode?: string; sku?: string; eyewearType?: string; company?: { name?: string }; quantity?: number }
interface StockOutResponse { message?: string; product?: ProductInfo; updatedQuantity?: number; quantity?: number; change?: number }

const StockOutByBarcode = () => {
  const navigate = useNavigate();
  const barcodeRef = useRef<HTMLInputElement | null>(null);
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('sale');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StockOutResponse | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<Array<{ code: string; qty: number; reason: string; ts: number }>>([]);

  useEffect(() => { barcodeRef.current?.focus(); }, []);

  // Debounced product lookup
  useEffect(() => {
    if (!barcode.trim()) { setProduct(null); return; }
    const h = setTimeout(async () => {
      try {
        setLookupLoading(true);
        const res = await StaffAPI.inventory.getProductByBarcode(barcode.trim());
        // we don't know exact shape; attempt to extract product
        const prod = res?.product || res || null;
        setProduct(prod);
      } catch { setProduct(null); }
      finally { setLookupLoading(false); }
    }, 400);
    return () => clearTimeout(h);
  }, [barcode]);

  const available = product?.quantity ?? (result?.updatedQuantity ?? 0);

  const validate = () => {
    if (!barcode.trim()) { setError('Barcode is required'); return false; }
    if (!(quantity > 0)) { setError('Quantity must be > 0'); return false; }
    // If we know available, ensure not exceeding
    if (available && quantity > available) { setError('Quantity exceeds available stock'); return false; }
    if (!reason) { setError('Reason is required'); return false; }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true); setError(null); setResult(null);
      const payload = { barcode: barcode.trim(), quantity };
      const res = await StaffAPI.inventory.stockOutByBarcode(payload);
      setResult(res);
      setHistory(h => [{ code: barcode.trim(), qty: quantity, reason, ts: Date.now() }, ...h.slice(0, 49)]);
      setConfirming(false);
      setBarcode(''); setQuantity(1); setNote(''); barcodeRef.current?.focus();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Stock out failed';
      setError(msg);
    } finally { setSubmitting(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { if (confirming) submit(); else setConfirming(true); }
    if (e.key === 'Escape') { if (confirming) setConfirming(false); else resetForm(); }
  };

  const resetForm = () => {
    setBarcode(''); setQuantity(1); setNote(''); setReason('sale'); setProduct(null); setError(null); setResult(null); setConfirming(false); barcodeRef.current?.focus();
  };

  const lowStock = (result?.updatedQuantity ?? available) !== undefined && (result?.updatedQuantity ?? available) <= 5;

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Stock Out (Barcode)</h1>
          <p className="text-gray-600">Remove stock via barcode scanning with validation and reasons</p>
        </div>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {result && !error && (
        <Alert className="border-green-500/40"><AlertDescription className="flex items-center gap-2 text-green-700"><CheckCircle2 className="h-4 w-4" /> Stock reduced successfully.</AlertDescription></Alert>
      )}
      {lowStock && !error && (
        <Alert className="border-yellow-400/50 bg-yellow-50"><AlertDescription className="flex items-center gap-2 text-yellow-700"><AlertTriangle className="h-4 w-4" /> Low stock level after this operation.</AlertDescription></Alert>
      )}

      <Card className="glass-card">
        <CardHeader><CardTitle>Stock Out</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium" htmlFor="barcode">Barcode *</label>
            <Input id="barcode" ref={barcodeRef} value={barcode} onChange={(e)=> setBarcode(e.target.value)} placeholder="Scan or type barcode" />
            {lookupLoading && <p className="text-xs text-muted-foreground">Looking up...</p>}
            {barcode && !lookupLoading && !product && <p className="text-xs text-red-500">Not found</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="qty">Quantity *</label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={()=> setQuantity(q => Math.max(1, q-1))}><Minus className="h-4 w-4" /></Button>
              <Input id="qty" type="number" min={1} value={quantity} onChange={(e)=> setQuantity(Math.max(1, Number(e.target.value)))} className="w-24" />
              <Button type="button" variant="outline" size="sm" onClick={()=> setQuantity(q => q+1)}><Minus className="h-4 w-4 rotate-180" /></Button>
            </div>
            {available ? <p className="text-xs text-muted-foreground">Available: {available}</p> : null}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="reason">Reason *</label>
            <select id="reason" className="w-full border rounded-md bg-background px-2 py-2 h-10" value={reason} onChange={(e)=> setReason(e.target.value)}>
              <option value="sale">Sale</option>
              <option value="damage">Damage</option>
              <option value="return">Customer Return</option>
              <option value="adjustment">Adjustment</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-1 md:col-span-4">
            <label className="text-sm font-medium" htmlFor="note">Note (optional)</label>
            <Input id="note" value={note} onChange={(e)=> setNote(e.target.value)} placeholder="Add any remarks" />
          </div>
        </CardContent>
      </Card>

      {product && (
        <Card className="glass-card">
          <CardHeader><CardTitle>Product</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>{product.name}</strong></p>
            <p className="text-muted-foreground text-xs">Barcode: {product.barcode || '—'} | SKU: {product.sku || '—'}</p>
            {product.company?.name && <p className="text-xs">Company: {product.company.name}</p>}
            {product.eyewearType && <p className="text-xs">Type: {product.eyewearType}</p>}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 flex-wrap">
        {!confirming ? (
          <Button type="button" onClick={()=> setConfirming(true)} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Proceed</Button>
        ) : (
          <div className="flex gap-2 items-center">
            <Button type="button" variant="destructive" onClick={()=> submit()} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Confirm Stock Out</Button>
            <Button type="button" variant="outline" onClick={()=> setConfirming(false)} disabled={submitting}>Cancel</Button>
          </div>
        )}
        <Button type="button" variant="ghost" onClick={resetForm} disabled={submitting}>Reset</Button>
      </div>

      {history.length > 0 && (
        <Card className="glass-card">
          <CardHeader><CardTitle>Recent Stock-Outs</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="py-1 px-2">Time</th>
                  <th className="py-1 px-2">Barcode</th>
                  <th className="py-1 px-2">Qty</th>
                  <th className="py-1 px-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.ts} className="border-t">
                    <td className="py-1 px-2">{new Date(h.ts).toLocaleTimeString()}</td>
                    <td className="py-1 px-2 font-mono">{h.code}</td>
                    <td className="py-1 px-2">{h.qty}</td>
                    <td className="py-1 px-2 capitalize">{h.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockOutByBarcode;
