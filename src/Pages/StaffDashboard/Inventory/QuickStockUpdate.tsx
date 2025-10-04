import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StaffAPI } from '@/lib/api';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, Barcode, Plus, Minus, CheckCircle2 } from 'lucide-react';

interface ProductInfo { id?: number; name?: string; barcode?: string; sku?: string; basePrice?: number; eyewearType?: string; company?: { name?: string } }
interface StockResponse { message?: string; quantity?: number; product?: ProductInfo; updatedQuantity?: number; change?: number }

const QuickStockUpdate = () => {
  const navigate = useNavigate();
  const barcodeRef = useRef<HTMLInputElement | null>(null);
  const qtyRef = useRef<HTMLInputElement | null>(null);
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState<'IN' | 'OUT'>('IN');
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StockResponse | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [history, setHistory] = useState<Array<{ code: string; action: string; qty: number; ts: number }>>([]);

  useEffect(() => { barcodeRef.current?.focus(); }, []);

  // Lookup product when barcode changes (debounce)
  useEffect(() => {
    if (!barcode.trim()) { setProduct(null); return; }
    const h = setTimeout(async () => {
      try {
        setLookupLoading(true);
        const res = await StaffAPI.inventory.getProductByBarcode(barcode.trim());
        setProduct(res?.product || res || null);
      } catch {
        setProduct(null);
      } finally { setLookupLoading(false); }
    }, 400);
    return () => clearTimeout(h);
  }, [barcode]);

  const validate = () => {
    if (!barcode.trim()) { setError('Barcode is required'); return false; }
    if (!(quantity > 0)) { setError('Quantity must be > 0'); return false; }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true); setError(null); setResult(null);
      if (action === 'IN') {
        const res = await StaffAPI.inventory.stockByBarcode({ barcode: barcode.trim(), quantity, action: 'IN' });
        setResult(res);
      } else {
        const res = await StaffAPI.inventory.stockOutByBarcode({ barcode: barcode.trim(), quantity });
        setResult(res);
      }
      setHistory(h => [{ code: barcode.trim(), action, qty: quantity, ts: Date.now() }, ...h.slice(0, 49)]);
      setConfirming(false);
      // focus barcode for next scan
      setBarcode(''); setQuantity(1); barcodeRef.current?.focus();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Stock update failed';
      setError(msg);
    } finally { setSubmitting(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (confirming) submit(); else setConfirming(true);
    }
    if (e.key === 'Escape') {
      if (confirming) setConfirming(false); else resetForm();
    }
  };

  const resetForm = () => {
    setBarcode(''); setQuantity(1); setProduct(null); setError(null); setResult(null); setConfirming(false); barcodeRef.current?.focus();
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Quick Stock Update</h1>
          <p className="text-gray-600">Scan or enter a product barcode to adjust stock instantly</p>
        </div>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {result && !error && (
        <Alert className="border-green-500/40"><AlertDescription className="flex items-center gap-2 text-green-700"><CheckCircle2 className="h-4 w-4" /> Stock {action === 'IN' ? 'added' : 'reduced'} successfully.</AlertDescription></Alert>
      )}

      <Card className="glass-card">
        <CardHeader><CardTitle>Stock Adjustment</CardTitle></CardHeader>
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
              <Input id="qty" ref={qtyRef} type="number" min={1} value={quantity} onChange={(e)=> setQuantity(Math.max(1, Number(e.target.value)))} className="w-24" />
              <Button type="button" variant="outline" size="sm" onClick={()=> setQuantity(q => q+1)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Action *</label>
            <select className="w-full border rounded-md bg-background px-2 py-2 h-10" value={action} onChange={(e)=> setAction(e.target.value === 'IN' ? 'IN' : 'OUT')}>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {product && (
        <Card className="glass-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Barcode className="h-5 w-5" /> Product</CardTitle></CardHeader>
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
            <Button type="button" variant="destructive" onClick={()=> submit()} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{action === 'IN' ? 'Confirm Stock In' : 'Confirm Stock Out'}</Button>
            <Button type="button" variant="outline" onClick={()=> setConfirming(false)} disabled={submitting}>Cancel</Button>
          </div>
        )}
        <Button type="button" variant="ghost" onClick={resetForm} disabled={submitting}>Reset</Button>
      </div>

      {history.length > 0 && (
        <Card className="glass-card">
          <CardHeader><CardTitle>Recent Adjustments</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="py-1 px-2">Time</th>
                  <th className="py-1 px-2">Barcode</th>
                  <th className="py-1 px-2">Action</th>
                  <th className="py-1 px-2">Qty</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.ts} className="border-t">
                    <td className="py-1 px-2">{new Date(h.ts).toLocaleTimeString()}</td>
                    <td className="py-1 px-2 font-mono">{h.code}</td>
                    <td className="py-1 px-2">{h.action}</td>
                    <td className="py-1 px-2">{h.qty}</td>
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

export default QuickStockUpdate;
