import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StaffAPI } from '@/lib/api';
import { useNavigate, Link } from 'react-router';
import { Plus, Trash2, Loader2, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ProductOption { id: number; name?: string; basePrice?: number; barcode?: string; sku?: string }
interface LineItem { id: string; productId?: number; quantity: number; unitPrice: number; productName?: string }

const newLine = (): LineItem => ({ id: crypto.randomUUID(), quantity: 1, unitPrice: 0 });

const CustomerInvoiceCreate = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [lineItems, setLineItems] = useState<LineItem[]>([newLine()]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [productsLoading, setProductsLoading] = useState(false);
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ invoiceId?: string; customerId?: number } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch a batch of products (simple first page) with optional search
  const fetchProducts = async (q?: string) => {
    try {
      setProductsLoading(true);
      const res = await StaffAPI.inventory.getProducts({ page: 1, limit: 50, search: q || undefined });
      const list = (res?.products || res || []).map((p: any) => ({ id: p.id, name: p.name, basePrice: p.basePrice, barcode: p.barcode, sku: p.sku }));
      setProducts(list);
    } catch {
      // ignore fetch error here
    } finally { setProductsLoading(false); }
  };

  useEffect(() => { fetchProducts(); firstInputRef.current?.focus(); }, []);
  useEffect(() => { const id = setTimeout(()=> fetchProducts(productSearch), 350); return () => clearTimeout(id); }, [productSearch]);

  const updateCustomer = (field: string, value: string) => setCustomer(c => ({ ...c, [field]: value }));

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    setLineItems(items => items.map(li => li.id === id ? { ...li, ...patch } : li));
  };

  const addLine = () => setLineItems(items => [...items, newLine()]);
  const removeLine = (id: string) => setLineItems(items => items.length > 1 ? items.filter(li => li.id !== id) : items);

  const selectedProductsMap = useMemo(() => Object.fromEntries(products.map(p => [p.id, p])), [products]);

  // Auto fill unit price & name when product selected if not overridden
  useEffect(() => {
    setLineItems(items => items.map(li => {
      if (li.productId && selectedProductsMap[li.productId]) {
        const prod = selectedProductsMap[li.productId];
        return { ...li, productName: prod.name, unitPrice: li.unitPrice || prod.basePrice || 0 };
      }
      return li;
    }));
  }, [selectedProductsMap]);

  const subtotal = useMemo(() => lineItems.reduce((s, li) => s + (li.quantity > 0 && li.unitPrice >= 0 ? li.quantity * li.unitPrice : 0), 0), [lineItems]);
  const paid = Number(paidAmount) || 0;
  const remaining = Math.max(subtotal - paid, 0);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!customer.name.trim()) errs.push('Customer name is required');
    if (!customer.phone.trim()) errs.push('Customer phone is required');
    if (!customer.address.trim()) errs.push('Customer address is required');
    const validLines = lineItems.filter(li => li.productId && li.quantity > 0 && li.unitPrice >= 0);
    if (validLines.length === 0) errs.push('At least one valid line item is required');
    setValidationErrors(errs);
    return errs.length === 0;
  };

  const resetForm = () => {
    setCustomer({ name: '', phone: '', address: '' });
    setLineItems([newLine()]);
    setPaidAmount('');
    setPaymentMethod('cash');
    setValidationErrors([]);
    setError(null);
    setSuccess(null);
    firstInputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true); setError(null); setSuccess(null);
      const payload = {
        customer: { name: customer.name.trim(), phone: customer.phone.trim(), address: customer.address.trim() },
        items: lineItems.filter(li => li.productId && li.quantity > 0).map(li => ({ productId: li.productId!, quantity: li.quantity, unitPrice: li.unitPrice })),
        paidAmount: paid,
        paymentMethod,
      };
      const res = await StaffAPI.customers.createWithInvoice(payload);
      const invoiceId = res?.invoiceId || res?.id || res?.invoice?.id;
      const customerId = res?.customerId || res?.customer?.id;
      setSuccess({ invoiceId, customerId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create invoice';
      setError(msg);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Create Customer + Invoice</h1>
          <p className="text-gray-600">Register a customer and generate their invoice in one step</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map(v => <li key={v}>{v}</li>)}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        {success && !error && (
          <Alert className="border-green-500/40">
            <AlertDescription className="flex flex-col gap-1 text-green-700">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Created successfully.</span>
              <div className="flex gap-2 flex-wrap text-sm">
                {success.invoiceId && <Link to={`/staff-dashboard/invoices/${success.invoiceId}`} className="underline">View Invoice</Link>}
                {success.customerId && <Link to={`/staff-dashboard/customers/${success.customerId}`} className="underline">Customer Profile</Link>}
                <button type="button" className="underline" onClick={resetForm}>Create Another</button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card className="glass-card">
          <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium" htmlFor="cust-name">Name *</label>
              <Input id="cust-name" ref={firstInputRef} value={customer.name} onChange={(e)=> updateCustomer('name', e.target.value)} placeholder="Customer name" />
            </div>
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium" htmlFor="cust-phone">Phone *</label>
              <Input id="cust-phone" value={customer.phone} onChange={(e)=> updateCustomer('phone', e.target.value)} placeholder="Phone" />
            </div>
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium" htmlFor="cust-address">Address *</label>
              <Textarea id="cust-address" rows={2} value={customer.address} onChange={(e)=> updateCustomer('address', e.target.value)} placeholder="Address" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Invoice Items</CardTitle>
            <div className="flex gap-2 items-center">
              <Input placeholder="Search products" value={productSearch} onChange={(e)=> setProductSearch(e.target.value)} className="h-8 w-48" />
              <Button type="button" variant="outline" size="sm" onClick={()=> fetchProducts(productSearch)} disabled={productsLoading}><RefreshCw className={`h-4 w-4 ${productsLoading? 'animate-spin':''}`} /></Button>
              <Button type="button" size="sm" onClick={addLine}><Plus className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="py-2 px-2">Product</th>
                    <th className="py-2 px-2 w-28">Quantity</th>
                    <th className="py-2 px-2 w-32">Unit Price</th>
                    <th className="py-2 px-2 w-32">Line Total</th>
                    <th className="py-2 px-2 w-10">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map(li => {
                    const prod = li.productId ? selectedProductsMap[li.productId] : undefined;
                    const lineTotal = li.quantity > 0 && li.unitPrice >= 0 ? (li.quantity * li.unitPrice) : 0;
                    return (
                      <tr key={li.id} className="border-t align-top">
                        <td className="py-2 px-2 min-w-[220px]">
                          <div className="space-y-1">
                            <select className="w-full border rounded-md bg-background px-2 py-1 h-9" value={li.productId || ''} onChange={(e)=> updateLine(li.id, { productId: e.target.value ? Number(e.target.value): undefined })}>
                              <option value="">Select product</option>
                              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            {productsLoading && <div className="text-xs text-muted-foreground">Loading...</div>}
                            {prod && <p className="text-xs text-muted-foreground flex gap-2"><span>{prod.sku || prod.barcode || ''}</span>{prod.basePrice ? <span>Base: ₹{prod.basePrice}</span>: null}</p>}
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <Input type="number" min={1} value={li.quantity} onChange={(e)=> updateLine(li.id, { quantity: Math.max(1, Number(e.target.value)) })} />
                        </td>
                        <td className="py-2 px-2">
                          <Input type="number" min={0} value={li.unitPrice} onChange={(e)=> updateLine(li.id, { unitPrice: Math.max(0, Number(e.target.value)) })} />
                        </td>
                        <td className="py-2 px-2 font-mono text-xs">₹{lineTotal}</td>
                        <td className="py-2 px-2">
                          <Button type="button" variant="ghost" size="sm" onClick={()=> removeLine(li.id)} disabled={lineItems.length === 1}><Trash2 className="h-4 w-4" /></Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-end text-sm pt-2">
              <div className="space-y-1 min-w-[200px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span>₹{paid}</span></div>
                <div className="flex justify-between font-medium"><span>Remaining</span><span>₹{remaining}</span></div>
              </div>
              <div className="space-y-3 w-full max-w-xs">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="paid">Paid Amount</label>
                  <Input id="paid" type="number" min={0} value={paidAmount} onChange={(e)=> setPaidAmount(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="paymentMethod">Payment Method</label>
                  <select id="paymentMethod" className="w-full border rounded-md bg-background px-2 py-2 h-10" value={paymentMethod} onChange={(e)=> setPaymentMethod(e.target.value)}>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting} className="min-w-[160px]">{submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Create Invoice</Button>
          <Button type="button" variant="outline" disabled={submitting} onClick={resetForm}>Reset</Button>
        </div>
        <p className="text-xs text-muted-foreground">All fields marked * are required. Each line item must have a product and quantity &gt; 0.</p>
      </form>
    </div>
  );
};

export default CustomerInvoiceCreate;
