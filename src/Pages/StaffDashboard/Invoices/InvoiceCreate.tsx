import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StaffAPI } from "@/lib/api";

const InvoiceCreate = () => {
  const [patientId, setPatientId] = useState<string>("");
  const [items, setItems] = useState<Array<{ productId: string; quantity: number; discount?: number; cgst?: number; sgst?: number }>>([
    { productId: "", quantity: 1 }
  ]);
  const [result, setResult] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addItem = () => setItems((arr) => [...arr, { productId: "", quantity: 1 }]);
  const updateItem = (idx: number, patch: Partial<{ productId: string; quantity: number; discount?: number; cgst?: number; sgst?: number }>) =>
    setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const submit = async () => {
    try {
      setLoading(true); setError(null);
  const payload: Parameters<typeof StaffAPI.invoices.create>[0] = {
        patientId: patientId ? Number(patientId) : undefined,
        items: items.map((it) => ({
          productId: Number(it.productId),
          quantity: Number(it.quantity),
          discount: it.discount ? Number(it.discount) : undefined,
          cgst: it.cgst ? Number(it.cgst) : undefined,
          sgst: it.sgst ? Number(it.sgst) : undefined,
        })),
        totalIgst: 0,
      };
  const res = await StaffAPI.invoices.create(payload);
      setResult(res);
    } catch (e) { const msg = e instanceof Error ? e.message : "Create failed"; setError(msg); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
        <p className="text-gray-600">Generate new invoice for customer</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="text-xs text-muted-foreground">Patient ID (optional)</label>
              <Input value={patientId} onChange={(e) => setPatientId(e.target.value)} />
            </div>
          </div>
          <div className="space-y-3">
            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <Input placeholder="Product ID" value={it.productId} onChange={(e) => updateItem(idx, { productId: e.target.value })} />
                <Input type="number" placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} />
                <Input type="number" placeholder="Discount" value={it.discount ?? ''} onChange={(e) => updateItem(idx, { discount: Number(e.target.value) })} />
                <Input type="number" placeholder="CGST" value={it.cgst ?? ''} onChange={(e) => updateItem(idx, { cgst: Number(e.target.value) })} />
                <Input type="number" placeholder="SGST" value={it.sgst ?? ''} onChange={(e) => updateItem(idx, { sgst: Number(e.target.value) })} />
              </div>
            ))}
            <Button variant="outline" onClick={addItem}>Add Item</Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={submit} disabled={loading}>Create Invoice</Button>
          </div>
          {result !== null && (
            <div className="text-sm mt-4">
              <pre className="bg-muted/50 p-3 rounded-lg overflow-auto max-h-80">{String(JSON.stringify(result, null, 2))}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceCreate;
