import React, { useEffect, useMemo, useState } from 'react';
import { StaffAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductOption { id: number; name: string; currentStock?: number; barcode?: string; }
interface LineItem { id: string; productId?: number; productName?: string; quantity: number; costPrice?: string; sellingPrice?: string; pending?: boolean; }
interface StockInFormProps { defaultProductId?: number; onSuccess?: (result: any) => void; }

const StockInForm: React.FC<StockInFormProps> = ({ defaultProductId, onSuccess }) => {
	const [products, setProducts] = useState<ProductOption[]>([]);
	const [loadingProducts, setLoadingProducts] = useState(false);
	const [search, setSearch] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<any | null>(null);
	const [lines, setLines] = useState<LineItem[]>([{ id: 'line-1', productId: defaultProductId, quantity: 1 }]);

	useEffect(() => { const fetchProducts = async () => { try { setLoadingProducts(true); const data = await StaffAPI.inventory.getProducts({ page:1, limit:100 }); const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []); setProducts(items.map((p: any) => ({ id: p.id, name: p.name, currentStock: p.currentStock, barcode: p.barcode }))); } catch (e) { console.error(e); } finally { setLoadingProducts(false); } }; fetchProducts(); }, []);
	const filteredProducts = useMemo(() => { if (!search) return products; return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || String(p.id) === search); }, [products, search]);
	const updateLine = (id: string, patch: Partial<LineItem>) => { setLines(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l)); };
	const addLine = () => { setLines(ls => [...ls, { id: `line-${ls.length + 1}`, quantity: 1 }]); };
	const removeLine = (id: string) => { setLines(ls => ls.length === 1 ? ls : ls.filter(l => l.id !== id)); };
	const resetForm = () => { setLines([{ id: 'line-1', quantity: 1 }]); setSearch(''); };
	const submit = async () => { setSubmitting(true); setError(null); setSuccess(null); try { const validLines = lines.filter(l => l.productId && l.quantity > 0); if (validLines.length === 0) throw new Error('Select at least one product with quantity > 0'); const results: any[] = []; for (const l of validLines) { const payload: any = { productId: l.productId!, quantity: l.quantity }; if (l.costPrice) payload.costPrice = Number(l.costPrice); if (l.sellingPrice) payload.sellingPrice = Number(l.sellingPrice); const res = await StaffAPI.inventory.stockIn(payload); results.push(res); } setSuccess(results); onSuccess?.(results); resetForm(); } catch (e: any) { setError(e?.message || 'Stock-in failed'); } finally { setSubmitting(false); } };

	return (
		<Card className="p-4 space-y-4">
			<div><h2 className="text-xl font-semibold">Stock In Products</h2><p className="text-xs text-muted-foreground">Add stock to inventory. Optional cost/selling price will update product pricing contextually (if supported by backend).</p></div>
			{error && <Alert variant="destructive">{error}</Alert>}
			{success && (<Alert variant="default" className="flex flex-col items-start space-y-1"><span className="font-medium">Stock In Successful</span><span className="text-xs text-muted-foreground">Updated {success.length} item(s).</span></Alert>)}
			<div className="space-y-2">
				<div className="flex flex-wrap gap-2 items-center">
					<Input placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} className="w-60" />
					<Button variant="outline" size="sm" onClick={addLine}>Add Line</Button>
					<Button variant="outline" size="sm" onClick={resetForm} disabled={submitting}>Reset</Button>
				</div>
				<Separator />
				<div className="space-y-3">
					{lines.map(line => { const product = products.find(p => p.id === line.productId); return (
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
								<div><label className="text-xs uppercase text-muted-foreground">Cost Price</label><Input type="number" min={0} step="0.01" value={line.costPrice || ''} onChange={(e) => updateLine(line.id, { costPrice: e.target.value })} placeholder="Optional" /></div>
								<div><label className="text-xs uppercase text-muted-foreground">Selling Price</label><Input type="number" min={0} step="0.01" value={line.sellingPrice || ''} onChange={(e) => updateLine(line.id, { sellingPrice: e.target.value })} placeholder="Optional" /></div>
								<div className="flex gap-2 items-end"><Button variant="ghost" size="sm" onClick={() => removeLine(line.id)} disabled={lines.length === 1}>Remove</Button></div>
							</div>
							{product && (<div className="mt-2 text-[11px] text-muted-foreground flex gap-4 flex-wrap">{product.barcode && <span>Barcode: {product.barcode}</span>}{product.currentStock != null && <span>Current Stock: {product.currentStock}</span>}</div>)}
						</Card>
					); })}
					{loadingProducts && <Skeleton className="h-10 w-full" />}
				</div>
			</div>
			<div className="flex gap-2 flex-wrap"><Button onClick={submit} disabled={submitting}>{submitting ? 'Processing...' : 'Submit Stock In'}</Button></div>
		</Card>
	);
};

export default StockInForm;
