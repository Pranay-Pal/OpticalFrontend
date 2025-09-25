import { useEffect, useMemo, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { Card } from "@/components/ui/card";
import { ShopAdminAPI } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ProductSalesItem = {
  product: { id: number; name: string; sku?: string; category?: string; company?: string };
  totalQuantitySold: number; totalRevenue: number; totalTransactions: number; avgPricePerUnit: number
};

type ProductSalesSummary = {
  totalProducts: number;
  totalRevenue: number;
  topSellingProduct?: { id?: number; name?: string } | null;
};

type ProductSalesResponse = {
  summary?: ProductSalesSummary;
  productSales?: ProductSalesItem[];
  period?: { startDate?: string; endDate?: string };
  [key: string]: any;
};

export default function ProductSalesReport() {
  const [data, setData] = useState<ProductSalesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [productId, setProductId] = useState<string>("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const pid = productId ? Number(productId) : undefined;
      const res = await ShopAdminAPI.reports.getProductSales(startDate, endDate, pid);
      const items: ProductSalesItem[] = Array.isArray(res.productSales)
        ? res.productSales
        : Array.isArray(res.items)
          ? res.items
          : Array.isArray(res.data)
            ? res.data
            : Object.values(res.productSales || {}).filter(Boolean);
      setData({ ...res, productSales: items });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products: ProductSalesItem[] = data?.productSales ?? [];
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, page]);
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="mb-4 p-4">
        <h2 className="font-bold mb-3">Product Sales Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm text-muted-foreground">Product ID (optional)</label>
            <Input type="number" value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="e.g. 123" />
          </div>
          <div className="md:col-span-1">
            <Button onClick={() => { setPage(1); load(); }} disabled={loading}>
              {loading ? "Loading..." : "Apply"}
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="mb-4 p-4 text-red-600">{error}</Card>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Products</div>
          <div className="text-2xl font-semibold">{data?.summary?.totalProducts ?? products.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-semibold">₹{data?.summary?.totalRevenue ?? products.reduce((s, p) => s + (p.totalRevenue || 0), 0)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Top Selling</div>
          <div className="text-2xl font-semibold">{data?.summary?.topSellingProduct?.name ?? "—"}</div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Sales by Product</h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Company</th>
              <th>Quantity Sold</th>
              <th>Revenue</th>
              <th>Transactions</th>
              <th>Avg Price/Unit</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item: ProductSalesItem) => (
              <tr key={item.product.id} className="border-b">
                <td>{item.product.name}</td>
                <td>{item.product.sku ?? "—"}</td>
                <td>{item.product.category ?? "—"}</td>
                <td>{item.product.company ?? "—"}</td>
                <td>{item.totalQuantitySold}</td>
                <td>₹{item.totalRevenue}</td>
                <td>{item.totalTransactions}</td>
                <td>₹{item.avgPricePerUnit}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted-foreground py-6">No data</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
