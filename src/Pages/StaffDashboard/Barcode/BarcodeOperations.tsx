import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScanLine } from "lucide-react";
import { StaffAPI } from "@/lib/api";

const BarcodeOperations = () => {
  const [barcode, setBarcode] = useState("");
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [result, setResult] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!barcode.trim()) return;
    try {
      setError(null); setLoading(true);
      const data = await StaffAPI.inventory.getProductByBarcode(barcode.trim());
      setResult(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lookup failed";
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleStockIn = async () => {
    if (!barcode.trim() || qty <= 0 || price <= 0) return;
    try {
      setError(null); setLoading(true);
      const data = await StaffAPI.inventory.stockByBarcode({ barcode: barcode.trim(), quantity: qty, price });
      setResult(data);
    } catch (e) { const msg = e instanceof Error ? e.message : "Stock in failed"; setError(msg); }
    finally { setLoading(false); }
  };

  const handleStockOut = async () => {
    if (!barcode.trim() || qty <= 0) return;
    try {
      setError(null); setLoading(true);
      const data = await StaffAPI.inventory.stockOutByBarcode({ barcode: barcode.trim(), quantity: qty });
      setResult(data);
    } catch (e) { const msg = e instanceof Error ? e.message : "Stock out failed"; setError(msg); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Barcode Scanner</h1>
        <p className="text-gray-600">Scan barcodes for quick inventory operations</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ScanLine className="mr-2 h-5 w-5" />
            Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input placeholder="Barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
            <Input type="number" placeholder="Quantity" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            <Input type="number" placeholder="Price (for stock-in)" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            <div className="flex gap-2">
              <Button className="w-full" onClick={handleLookup} disabled={loading}>Lookup</Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleStockIn} disabled={loading}>Stock In</Button>
            <Button variant="outline" onClick={handleStockOut} disabled={loading}>Stock Out</Button>
          </div>

          {result !== null && (
            <div className="mt-4 text-sm">
              <pre className="bg-muted/50 p-3 rounded-lg overflow-auto max-h-80">{String(JSON.stringify(result, null, 2))}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeOperations;
