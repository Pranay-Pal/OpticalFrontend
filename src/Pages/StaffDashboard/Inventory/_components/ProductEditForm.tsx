import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { StaffAPI } from '@/lib/api';

interface ProductData { id: number; name: string; description?: string; basePrice?: number; eyewearType?: string; companyId?: number; material?: string; color?: string; size?: string; model?: string; }
interface Props { productId: number; onUpdated?: (p: ProductData) => void; }

const ProductEditForm: React.FC<Props> = ({ productId, onUpdated }) => {
	const [original, setOriginal] = useState<ProductData | null>(null);
	const [form, setForm] = useState<ProductData | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string|null>(null);
	const [success, setSuccess] = useState<string|null>(null);
	const [lastFetched, setLastFetched] = useState<number|null>(null);
	const isDirty = form && original && JSON.stringify(form) !== JSON.stringify(original);
	const beforeUnloadRef = useRef<((e: BeforeUnloadEvent) => void) | null>(null);

	const load = useCallback(async () => {
		try { setLoading(true); setError(null); const data = await StaffAPI.inventory.getProductById(productId); setOriginal(data); setForm(data); setLastFetched(Date.now()); }
		catch (e:any) { setError(e?.response?.data?.message || 'Failed to load product'); }
		finally { setLoading(false); }
	}, [productId]);
	useEffect(() => { load(); }, [load]);

	useEffect(() => { const handler = (e: BeforeUnloadEvent) => { if (isDirty) { e.preventDefault(); e.returnValue = ''; } }; beforeUnloadRef.current = handler; window.addEventListener('beforeunload', handler); return () => window.removeEventListener('beforeunload', handler); }, [isDirty]);

	const updateField = (key: keyof ProductData, value: any) => { setForm(f => f ? { ...f, [key]: value } : f); };
	const save = async () => {
		if (!form) return; setSaving(true); setError(null); setSuccess(null);
		try {
			const payload: Record<string, any> = {};
			(['name','description','basePrice','eyewearType','companyId','material','color','size','model'] as (keyof ProductData)[]).forEach(k => { if ((form as any)[k] !== (original as any)[k]) payload[k] = (form as any)[k]; });
			if (Object.keys(payload).length === 0) { setSuccess('No changes to save'); return; }
			const updated = await StaffAPI.inventory.updateProduct(productId, payload);
			setOriginal(updated); setForm(updated); setSuccess('Product updated successfully'); onUpdated?.(updated);
		} catch (e:any) { setError(e?.response?.data?.message || 'Update failed'); }
		finally { setSaving(false); }
	};
	const resetChanges = () => { setForm(original); setSuccess(null); };

	return (
		<div className="space-y-6">
			<Card className="glass-card">
				<CardHeader><CardTitle>Edit Product</CardTitle></CardHeader>
				<CardContent className="space-y-6">
					{error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
					{success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}
					{loading && <p className="text-sm text-muted-foreground">Loading...</p>}
					{!loading && form && (<>
						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Name" dirty={form.name !== original?.name}><Input value={form.name} onChange={e => updateField('name', e.target.value)} /></Field>
							<Field label="Base Price" dirty={form.basePrice !== original?.basePrice}><Input type="number" value={form.basePrice ?? ''} onChange={e => updateField('basePrice', Number(e.target.value))} /></Field>
							<Field label="Company ID" dirty={form.companyId !== original?.companyId}><Input type="number" value={form.companyId ?? ''} onChange={e => updateField('companyId', Number(e.target.value))} /></Field>
							<Field label="Eyewear Type" dirty={form.eyewearType !== original?.eyewearType}><select className="border rounded-md p-2 w-full" value={form.eyewearType} onChange={e => updateField('eyewearType', e.target.value)}><option value="GLASSES">GLASSES</option><option value="SUNGLASSES">SUNGLASSES</option><option value="LENSES">LENSES</option></select></Field>
							<Field label="Material" dirty={form.material !== original?.material}><Input value={form.material ?? ''} onChange={e => updateField('material', e.target.value)} /></Field>
							<Field label="Color" dirty={form.color !== original?.color}><Input value={form.color ?? ''} onChange={e => updateField('color', e.target.value)} /></Field>
							<Field label="Size" dirty={form.size !== original?.size}><Input value={form.size ?? ''} onChange={e => updateField('size', e.target.value)} /></Field>
							<Field label="Model" dirty={form.model !== original?.model}><Input value={form.model ?? ''} onChange={e => updateField('model', e.target.value)} /></Field>
							<Field label="Description" className="sm:col-span-2" dirty={form.description !== original?.description}><Input value={form.description ?? ''} onChange={e => updateField('description', e.target.value)} /></Field>
						</div>
						<Separator />
						<div className="flex flex-wrap gap-2 justify-end">
							<Button variant="outline" onClick={resetChanges} disabled={!isDirty}>Reset</Button>
							<Button variant="secondary" onClick={save} disabled={saving || !isDirty}>{saving ? 'Saving...' : 'Save Changes'}</Button>
						</div>
						<p className="text-[10px] text-muted-foreground pt-2">Last fetched: {lastFetched ? new Date(lastFetched).toLocaleTimeString() : '—'} • Concurrent edit handling placeholder – consider ETag/version check later.</p>
					</>)}
				</CardContent>
			</Card>
		</div>
	);
};

const Field: React.FC<{ label: string; dirty?: boolean; className?: string; children: React.ReactNode }> = ({ label, dirty, className, children }) => (
	<div className={`space-y-1 relative ${className || ''}`}>
		<label className="text-xs font-medium flex items-center gap-1">{label} {dirty && <span className="w-2 h-2 rounded-full bg-amber-500" />}</label>
		{children}
		{dirty && <span className="absolute -inset-0.5 border border-amber-400 rounded pointer-events-none" />}
	</div>
);

export default ProductEditForm;
