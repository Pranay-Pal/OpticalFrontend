import { useEffect, useState, useMemo } from 'react';
import { ShopAdminAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';
import Pagination from '../Pagination/Pagination';

// Shapes based on POSTMAN_TESTING_TODO inventory/status expected response
// { summary: { totalProducts, inStock, lowStock, outOfStock }, inventory: [] }

interface InventoryStatusSummary {
  totalProducts?: number;
  inStock?: number;
  lowStock?: number;
  outOfStock?: number;
  [k: string]: any;
}

interface InventoryStatusItem {
  id?: number;
  productId?: number;
  name?: string;
  sku?: string;
  category?: string;
  quantity?: number;
  minQuantity?: number;
  status?: string; // derived: IN_STOCK | LOW_STOCK | OUT_OF_STOCK
  [k: string]: any;
}

interface InventoryStatusResponse {
  summary?: InventoryStatusSummary;
  inventory?: InventoryStatusItem[];
  data?: any; // fallback envelope
  [k: string]: any;
}

export default function InventoryStatusReport() {
  const [data, setData] = useState<InventoryStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ShopAdminAPI.reports.getInventoryStatus();
      const inventory: InventoryStatusItem[] = Array.isArray(res.inventory)
        ? res.inventory
        : Array.isArray(res.data?.inventory)
          ? res.data.inventory
          : Array.isArray(res.data)
            ? res.data
            : [];
      setData({ ...res, inventory });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const inventory = data?.inventory ?? [];
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return inventory.slice(start, start + pageSize);
  }, [inventory, page]);
  const totalPages = Math.max(1, Math.ceil(inventory.length / pageSize));

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Inventory Status</h2>
          <button onClick={() => load()} disabled={loading} className="text-sm underline disabled:opacity-50">{loading ? 'Refreshing...' : 'Refresh'}</button>
        </div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Total Products</div>
            <div className="text-2xl font-semibold">{data?.summary?.totalProducts ?? inventory.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">In Stock</div>
            <div className="text-2xl font-semibold">{data?.summary?.inStock ?? inventory.filter(i => (i.status || '').includes('IN_STOCK')).length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">Low Stock</div>
            <div className="text-2xl font-semibold">{data?.summary?.lowStock ?? inventory.filter(i => (i.status || '').includes('LOW')).length}</div>
          </Card>
            <Card className="p-4">
            <div className="text-xs text-muted-foreground">Out of Stock</div>
            <div className="text-2xl font-semibold">{data?.summary?.outOfStock ?? inventory.filter(i => (i.status || '').includes('OUT')).length}</div>
          </Card>
        </div>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Min Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(item => (
                <tr key={item.id || item.productId || item.sku} className="border-b">
                  <td>{item.name ?? '—'}</td>
                  <td>{item.sku ?? '—'}</td>
                  <td>{item.category ?? '—'}</td>
                  <td>{item.quantity ?? '—'}</td>
                  <td>{item.minQuantity ?? '—'}</td>
                  <td>{item.status ?? (item.quantity === 0 ? 'OUT_OF_STOCK' : (item.quantity || 0) < (item.minQuantity || 0) ? 'LOW_STOCK' : 'IN_STOCK')}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted-foreground py-6">No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
