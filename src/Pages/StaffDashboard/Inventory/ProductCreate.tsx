import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StaffAPI } from "@/lib/api";

const ProductCreate = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    barcode: "",
    sku: "",
    basePrice: 0,
    eyewearType: "SUNGLASSES",
    frameType: "FULL",
    companyId: 1,
    material: "",
    color: "",
    size: "",
    model: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async () => {
    try {
      setLoading(true); setError(null); setSuccess(null);
  const payload: Parameters<typeof StaffAPI.inventory.addProduct>[0] = {
        ...form,
        basePrice: Number(form.basePrice),
        companyId: Number(form.companyId),
      };
  await StaffAPI.inventory.addProduct(payload);
      setSuccess("Product created successfully");
    } catch (e) { const msg = e instanceof Error ? e.message : "Create failed"; setError(msg); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600">Add a new product to inventory</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {error && <div className="sm:col-span-2"><Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert></div>}
          {success && <div className="sm:col-span-2"><Alert><AlertDescription>{success}</AlertDescription></Alert></div>}
          <div>
            <label className="text-xs text-muted-foreground">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Barcode</label>
            <Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">SKU</label>
            <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Base Price</label>
            <Input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Eyewear Type</label>
            <select className="border rounded-md p-2 w-full" value={form.eyewearType} onChange={(e) => setForm({ ...form, eyewearType: e.target.value })}>
              <option value="GLASSES">GLASSES</option>
              <option value="SUNGLASSES">SUNGLASSES</option>
              <option value="LENSES">LENSES</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Frame Type</label>
            <Input value={form.frameType} onChange={(e) => setForm({ ...form, frameType: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Company ID</label>
            <Input type="number" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Material</label>
            <Input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Color</label>
            <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Size</label>
            <Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Model</label>
            <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button onClick={submit} disabled={loading}>Create Product</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCreate;
