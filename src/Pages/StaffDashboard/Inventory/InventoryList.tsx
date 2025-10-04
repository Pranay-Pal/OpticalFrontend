import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ScanLine } from "lucide-react";
import { TrendingUp as TrendingUpIcon } from "lucide-react";
import { Link } from "react-router";
import { StaffAPI } from "@/lib/api";

type InventoryRow = {
  id: number;
  product?: { name?: string; sku?: string; barcode?: string; eyewearType?: string; company?: { name?: string } } | null;
  quantity?: number;
};
type InventoryResponse = { inventory?: InventoryRow[]; summary?: unknown };
const InventoryList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InventoryResponse>({ inventory: [], summary: null });
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
  const res = (await StaffAPI.inventory.getAll()) as InventoryResponse;
      setData(res || { inventory: [], summary: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load inventory";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage products and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Link to="/staff-dashboard/barcode/generate">
            <Button variant="outline">
              <ScanLine className="mr-2 h-4 w-4" />
              Generate Barcode
            </Button>
          </Link>
          <Link to="/staff-dashboard/inventory/quick-stock">
            <Button variant="outline">
              <TrendingUpIcon className="mr-2 h-4 w-4" />
              Quick Stock
            </Button>
          </Link>
          <Link to="/staff-dashboard/inventory/stock-out">
            <Button variant="outline">
              <TrendingUpIcon className="mr-2 h-4 w-4" />
              Stock Out
            </Button>
          </Link>
          <Link to="/staff-dashboard/barcode/assign">
            <Button variant="outline">
              <ScanLine className="mr-2 h-4 w-4" />
              Assign Barcodes
            </Button>
          </Link>
          <Link to="/staff-dashboard/barcode/sku">
            <Button variant="outline">
              <ScanLine className="mr-2 h-4 w-4" />
              Generate SKU
            </Button>
          </Link>
          <Link to="/staff-dashboard/barcode/missing">
            <Button variant="outline">
              <ScanLine className="mr-2 h-4 w-4" />
              Missing
            </Button>
          </Link>
          <Link to="/staff-dashboard/inventory/products/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="Search name, SKU or barcode" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button variant="outline" onClick={() => fetchData()}>Refresh</Button>
          </div>
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Company</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Barcode</th>
                    <th className="py-2 pr-4">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.inventory ?? [])
                    .filter((row: InventoryRow) => {
                      if (!search.trim()) return true;
                      const p = row.product || {};
                      const s = search.toLowerCase();
                      return (
                        p.name?.toLowerCase?.().includes(s) ||
                        p.sku?.toLowerCase?.().includes(s) ||
                        p.barcode?.toLowerCase?.().includes(s)
                      );
                    })
                    .map((row: InventoryRow) => (
                    <tr key={row.id} className="border-t">
                      <td className="py-2 pr-4">
                        {row.product?.name ? (
                          <Link to={`/staff-dashboard/inventory/products/${row.id}`} className="text-blue-600 hover:underline">
                            {row.product.name}
                          </Link>
                        ) : null}
                      </td>
                      <td className="py-2 pr-4">{row.product?.company?.name}</td>
                      <td className="py-2 pr-4">{row.product?.eyewearType}</td>
                      <td className="py-2 pr-4">{row.product?.barcode}</td>
                      <td className="py-2 pr-4">{row.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryList;
