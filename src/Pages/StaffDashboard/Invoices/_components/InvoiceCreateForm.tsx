import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StaffAPI } from '@/lib/api';

// Types for line items in the draft invoice
interface DraftLineItem {
  id: string; // client-only id
  productId?: number;
  productName?: string;
  quantity: number;
  unitPrice: string; // keep as string for controlled input
  discount?: string; // percent or absolute in future (currently absolute ₹)
  cgstRate?: string; // percent
  sgstRate?: string; // percent
  loadingProduct?: boolean;
}

interface InvoiceCreateFormProps {
  onCreated?: (invoice: any) => void;
}

const InvoiceCreateForm: React.FC<InvoiceCreateFormProps> = ({ onCreated }) => {
  // Party selection (either patient or customer for now we support patientId only per API definition)
  const [patientId, setPatientId] = useState('');
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<DraftLineItem[]>([
    { id: 'li-1', quantity: 1, unitPrice: '', discount: '', cgstRate: '', sgstRate: '' },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any | null>(null);
  const [globalProductSearch, setGlobalProductSearch] = useState('');
  const [productOptions, setProductOptions] = useState<any[]>([]);
  // Removed loadingProducts flag (not used in UI rendering currently)

  // Load a limited product list for selection
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await StaffAPI.inventory.getProducts({ page: 1, limit: 100 });
        const list = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
        setProductOptions(list);
      } catch (e) {
        // ignore
  } finally { /* loading flag removed */ }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!globalProductSearch) return productOptions;
    const q = globalProductSearch.toLowerCase();
    return productOptions.filter(p => (p.name || '').toLowerCase().includes(q) || String(p.id) === globalProductSearch);
  }, [productOptions, globalProductSearch]);

  const updateItem = (id: string, patch: Partial<DraftLineItem>) => {
    setItems(list => list.map(l => l.id === id ? { ...l, ...patch } : l));
  };
  const removeItem = (id: string) => {
    setItems(list => list.length === 1 ? list : list.filter(l => l.id !== id));
  };
  const addItem = () => {
    setItems(list => [...list, { id: `li-${list.length + 1}`, quantity: 1, unitPrice: '', discount: '', cgstRate: '', sgstRate: '' }]);
  };

  // Derived totals
  const totals = useMemo(() => {
    let sub = 0; let cgst = 0; let sgst = 0; let discountTotal = 0;
    items.forEach(i => {
      const qty = i.quantity || 0;
      const price = parseFloat(i.unitPrice || '0') || 0;
      const disc = parseFloat(i.discount || '0') || 0; // treat as absolute amount discount (not %) for now
      const lineBase = qty * price;
      const lineTaxBase = Math.max(0, lineBase - disc);
      const cgstRate = parseFloat(i.cgstRate || '0') || 0;
      const sgstRate = parseFloat(i.sgstRate || '0') || 0;
      const lineCgst = lineTaxBase * (cgstRate / 100);
      const lineSgst = lineTaxBase * (sgstRate / 100);
      sub += lineBase;
      discountTotal += disc;
      cgst += lineCgst;
      sgst += lineSgst;
    });
    const taxable = Math.max(0, sub - discountTotal);
    const grand = taxable + cgst + sgst;
    return { sub, discountTotal, taxable, cgst, sgst, grand };
  }, [items]);

  const valid = useMemo(() => {
    if (items.length === 0) return false;
    if (!items.some(i => i.productId && i.quantity > 0 && parseFloat(i.unitPrice || '0') > 0)) return false;
    // patientId optional (API supports patient or maybe future customer). For now allow empty.
    return true;
  }, [items]);

  const resetForm = () => {
    setItems([{ id: 'li-1', quantity: 1, unitPrice: '', discount: '', cgstRate: '', sgstRate: '' }]);
    setPatientId('');
    setNotes('');
    setError(null);
    setSuccess(null);
  };

  const submit = async () => {
    if (!valid) return;
    setSubmitting(true); setError(null); setSuccess(null);
    try {
      const apiItems = items.filter(i => i.productId && i.quantity > 0 && parseFloat(i.unitPrice || '0') > 0).map(i => ({
        productId: i.productId!,
        quantity: i.quantity,
        unitPrice: parseFloat(i.unitPrice || '0'),
        discount: i.discount ? parseFloat(i.discount) : undefined,
        cgstRate: i.cgstRate ? parseFloat(i.cgstRate) : undefined,
        sgstRate: i.sgstRate ? parseFloat(i.sgstRate) : undefined,
      }));
      const payload: Parameters<typeof StaffAPI.invoices.create>[0] = {
        items: apiItems,
        notes: notes || undefined,
      };
      if (patientId) payload.patientId = Number(patientId);
      // Paid amount / payment method will be a later enhancement (7.4 maybe). For now treat all as unpaid.
      const created = await StaffAPI.invoices.create(payload);
      setSuccess(created);
      onCreated?.(created);
    } catch (e: any) {
      setError(e?.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">New Invoice</h2>
          <p className="text-xs text-muted-foreground">Add products, adjust discounts & taxes, then create the invoice.</p>
        </div>
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert><AlertDescription>Invoice created (ID: {success?.id || '—'}). You can create another.</AlertDescription></Alert>}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">Patient ID (optional)</label>
            <Input value={patientId} onChange={e => setPatientId(e.target.value)} placeholder="e.g. 42" />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-medium">Notes</label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search product (name or id)" value={globalProductSearch} onChange={e => setGlobalProductSearch(e.target.value)} className="w-64" />
            <Button variant="outline" size="sm" onClick={addItem}>Add Line</Button>
            <Button variant="outline" size="sm" onClick={resetForm}>Reset</Button>
          </div>

          <div className="space-y-2">
            {items.map(li => {
              const product = productOptions.find(p => p.id === li.productId);
              const qty = li.quantity;
              const price = parseFloat(li.unitPrice || '0') || 0;
              const disc = parseFloat(li.discount || '0') || 0;
              const cgstRate = parseFloat(li.cgstRate || '0') || 0;
              const sgstRate = parseFloat(li.sgstRate || '0') || 0;
              const lineBase = qty * price;
              const lineTaxable = Math.max(0, lineBase - disc);
              const lineCgst = lineTaxable * (cgstRate/100);
              const lineSgst = lineTaxable * (sgstRate/100);
              const lineTotal = lineTaxable + lineCgst + lineSgst;
              return (
                <Card key={li.id} className="p-3 space-y-2 border-dashed">
                  <div className="flex flex-col md:grid md:grid-cols-10 gap-2 md:items-end">
                    <div className="col-span-3 space-y-1">
                      <label className="text-[10px] font-medium uppercase">Product</label>
                      <select className="border rounded-md p-2 text-xs w-full bg-background" value={li.productId ?? ''} onChange={e => updateItem(li.id, { productId: e.target.value ? Number(e.target.value) : undefined })}>
                        <option value="">Select…</option>
                        {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.name} {p.currentStock != null ? `(Stock:${p.currentStock})` : ''}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium uppercase">Qty</label>
                      <Input type="number" min={1} value={li.quantity} onChange={e => updateItem(li.id, { quantity: Math.max(1, Number(e.target.value)) })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium uppercase">Unit Price</label>
                      <Input type="number" min={0} step="0.01" value={li.unitPrice} onChange={e => updateItem(li.id, { unitPrice: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium uppercase">Discount (₹)</label>
                      <Input type="number" min={0} step="0.01" value={li.discount} onChange={e => updateItem(li.id, { discount: e.target.value })} placeholder="0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium uppercase">CGST %</label>
                      <Input type="number" min={0} step="0.01" value={li.cgstRate} onChange={e => updateItem(li.id, { cgstRate: e.target.value })} placeholder="0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium uppercase">SGST %</label>
                      <Input type="number" min={0} step="0.01" value={li.sgstRate} onChange={e => updateItem(li.id, { sgstRate: e.target.value })} placeholder="0" />
                    </div>
                    <div className="col-span-2 space-y-1 text-right md:text-left">
                      <label className="text-[10px] font-medium uppercase">Line Total</label>
                      <div className="text-xs font-medium">₹{lineTotal.toFixed(2)}</div>
                      <div className="text-[10px] text-muted-foreground">Base ₹{lineBase.toFixed(2)}</div>
                    </div>
                    <div className="space-y-1 flex md:block justify-end">
                      <Button variant="ghost" size="sm" onClick={() => removeItem(li.id)} disabled={items.length === 1}>Remove</Button>
                    </div>
                  </div>
                  {product && <div className="text-[10px] text-muted-foreground flex gap-4 flex-wrap">{product.barcode && <span>BC: {product.barcode}</span>}{product.currentStock != null && <span>Stock: {product.currentStock}</span>}</div>}
                </Card>
              );
            })}
          </div>
        </div>

        <Separator />
        <div className="grid gap-2 md:grid-cols-5 text-xs">
          <div className="p-2 bg-muted rounded flex items-center justify-between col-span-2"><span>Subtotal</span><span>₹{totals.sub.toFixed(2)}</span></div>
          <div className="p-2 bg-muted rounded flex items-center justify-between"><span>Discount</span><span>₹{totals.discountTotal.toFixed(2)}</span></div>
          <div className="p-2 bg-muted rounded flex items-center justify-between"><span>CGST</span><span>₹{totals.cgst.toFixed(2)}</span></div>
          <div className="p-2 bg-muted rounded flex items-center justify-between"><span>SGST</span><span>₹{totals.sgst.toFixed(2)}</span></div>
          <div className="p-2 bg-primary/10 rounded flex items-center justify-between col-span-2 md:col-span-5 font-semibold"><span>Grand Total</span><span>₹{totals.grand.toFixed(2)}</span></div>
        </div>

        <div className="flex gap-2 justify-end pt-2 flex-wrap">
          {!success && <Button onClick={submit} disabled={!valid || submitting}>{submitting ? 'Creating...' : 'Create Invoice'}</Button>}
          {success && (
            <>
              <Button variant="outline" onClick={() => window.location.href = `/staff-dashboard/invoices/${success.id}`}>View (Coming Soon)</Button>
              <Button variant="outline" onClick={() => resetForm()}>Create Another</Button>
              <Button onClick={() => window.location.href = '/staff-dashboard/invoices'}>Back to List</Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InvoiceCreateForm;
