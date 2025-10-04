import React, { useEffect, useMemo, useState } from 'react';
import { StaffAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductOption { id: number; name: string; currentStock?: number; barcode?: string; }
interface LineItem { id: string; productId?: number; quantity: number; reason?: string; note?: string; }
interface StockOutFormProps { defaultProductId?: number; onSuccess?: (result: any) => void; }
const reasons = [ { value: 'sale', label: 'Sale (manual adjustment)' }, { value: 'damage', label: 'Damage' }, { value: 'return', label: 'Return to Supplier' }, { value: 'lost', label: 'Lost / Shrinkage' }, { value: 'other', label: 'Other' } ];

const StockOutForm: React.FC<StockOutFormProps> = ({ defaultProductId, onSuccess }) => {
	const [products, setProducts] = useState<ProductOption[]>([]);
	const [loadingProducts, setLoadingProducts] = useState(false);
	const [search, setSearch] = useState('');
	const [lines, setLines] = useState<LineItem[]>([{ id: 'line-1', productId: defaultProductId, quantity: 1, reason: 'sale' }]);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState<any[] | null>(null);

	useEffect(() => { const fetchProducts = async () => { try { setLoadingProducts(true); const data = await StaffAPI.inventory.getProducts({ page:1, limit:100 }); const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []); setProducts(items.map((p: any) => ({ id: p.id, name: p.name, currentStock: p.currentStock, barcode: p.barcode }))); } catch (e) { console.error(e); } finally { setLoadingProducts(false); } }; fetchProducts(); }, []);
	const filteredProducts = useMemo(() => { if (!search) return products; return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || String(p.id) === search); }, [products, search]);
	const updateLine = (id: string, patch: Partial<LineItem>) => setLines(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l));
	const addLine = () => setLines(ls => [...ls, { id: `line-${ls.length + 1}`, quantity: 1, reason: 'sale' }]);
	const removeLine = (id: string) => setLines(ls => ls.length === 1 ? ls : ls.filter(l => l.id !== id));
	const resetForm = () => { setLines([{ id: 'line-1', quantity: 1, reason: 'sale' }]); setSearch(''); setSuccess(null); setError(null); };
	const validate = () => { for (const l of lines) { if (!l.productId) { setError('All lines must have a product'); return false; } if (!(l.quantity > 0)) { setError('Quantities must be > 0'); return false; } const prod = products.find(p => p.id === l.productId); if (prod?.currentStock != null && l.quantity > prod.currentStock) { setError('Quantity exceeds current stock on a line'); return false; } if (!l.reason) { setError('All lines need a reason'); return false; } } setError(null); return true; };
	const submit = async () => { if (!validate()) return; setSubmitting(true); setError(null); setSuccess(null); try { const validLines = lines.map(l => ({ productId: l.productId!, quantity: l.quantity, reason: l.reason, note: l.note })); const results: any[] = []; for (const l of validLines) { const payload: any = { productId: l.productId, quantity: l.quantity }; const res = await StaffAPI.inventory.stockOut(payload); results.push({ line: l, response: res }); } setSuccess(results); onSuccess?.(results); resetForm(); } catch (e: any) { setError(e?.message || 'Stock out failed'); } finally { setSubmitting(false); } };

	return (
		<Card className="p-4 space-y-4">
			<div><h2 className="text-xl font-semibold">Stock Out Products</h2><p className="text-xs text-muted-foreground">Remove stock from inventory. Ensure reasons are accurate for audit purposes.</p></div>
			{error && <Alert variant="destructive">{error}</Alert>}
			{success && (<Alert variant="default" className="flex flex-col items-start space-y-1"><span className="font-medium">Stock Out Successful</span><span className="text-xs text-muted-foreground">Processed {success.length} line(s).</span></Alert>)}
			<div className="flex flex-wrap gap-2 items-center">
				<Input placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} className="w-60" />
				<Button variant="outline" size="sm" onClick={addLine}>Add Line</Button>
				<Button variant="outline" size="sm" onClick={resetForm} disabled={submitting}>Reset</Button>
			</div>
			<Separator />
			<div className="space-y-3">
				{lines.map(line => { const prod = products.find(p => p.id === line.productId); const lowAfter = prod?.currentStock != null && (prod.currentStock - line.quantity) <= 5; return (
					<Card key={line.id} className="p-3 border-dashed">
						<div className="flex flex-col md:flex-row md:items-end gap-3 flex-wrap">
							<div className="w-full md:w-64">
								<label className="text-xs uppercase text-muted-foreground">Product</label>
								<select className="mt-1 w-full border rounded px-2 py-1 text-sm bg-background" value={line.productId ?? ''} onChange={(e) => updateLine(line.id, { productId: e.target.value ? Number(e.target.value) : undefined })}>
									<option value="">Select...</option>
									{filteredProducts.map(p => (<option key={p.id} value={p.id}>{p.name} {p.currentStock != null ? `(Stock: ${p.currentStock})` : ''}</option>))}
								</select>
							</div>
							<div><label className="text-xs uppercase text-muted-foreground">Qty</label><Input type="number" min={1} value={line.quantity} onChange={(e) => updateLine(line.id, { quantity: Math.max(1, Number(e.target.value)) })} /></div>
							<div><label className="text-xs uppercase text-muted-foreground">Reason</label><select className="mt-1 w-full border rounded px-2 py-1 text-sm bg-background" value={line.reason} onChange={(e) => updateLine(line.id, { reason: e.target.value })}>{reasons.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
							<div className="flex-1 min-w-[200px]"><label className="text-xs uppercase text-muted-foreground">Note</label><Input value={line.note || ''} onChange={(e) => updateLine(line.id, { note: e.target.value })} placeholder="Optional" /></div>
							<div className="flex gap-2 items-end"><Button variant="ghost" size="sm" onClick={() => removeLine(line.id)} disabled={lines.length === 1}>Remove</Button></div>
						</div>
						{prod && (<div className="mt-2 text-[11px] text-muted-foreground flex gap-4 flex-wrap">{prod.barcode && <span>Barcode: {prod.barcode}</span>}{prod.currentStock != null && <span>Current Stock: {prod.currentStock}</span>}{lowAfter && <span className="text-red-500 font-medium">Low after: {prod.currentStock! - line.quantity}</span>}</div>)}
					</Card>
				); })}
				{loadingProducts && <Skeleton className="h-10 w-full" />}
			</div>
			<div className="flex gap-2 flex-wrap"><Button onClick={submit} disabled={submitting}>{submitting ? 'Processing...' : 'Submit Stock Out'}</Button></div>
		</Card>
	);
};

export default StockOutForm;
