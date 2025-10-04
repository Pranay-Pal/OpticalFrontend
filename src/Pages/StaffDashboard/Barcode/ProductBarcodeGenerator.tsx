import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StaffAPI } from '@/lib/api';
import { ScanLine, CheckCircle2, AlertTriangle, Loader2, Hash, Layers, Link as LinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Link } from 'react-router';

// Simple inline checkbox (since no existing component). Replace if a shadcn checkbox exists.
interface ProductRow {
  id: number;
  name?: string;
  sku?: string | null;
  barcode?: string | null;
}

interface GenerationResult { id: number; status: 'success' | 'error'; barcode?: string; message?: string; }

const ProductBarcodeGenerator = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [progressIndex, setProgressIndex] = useState<number>(-1);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [onlyMissing, setOnlyMissing] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<GenerationResult[]>([]);

  const fetchProducts = async () => {
    setError(null); setLoading(true);
    try {
      // Try dedicated missing endpoint first if filtering missing
      if (onlyMissing) {
        try {
          const miss = await StaffAPI.barcode.getMissing();
          // Expect array of { id, name }
          const mapped = (Array.isArray(miss) ? miss : []).map((p: any) => ({ id: p.id, name: p.name, barcode: p.barcode ?? null, sku: p.sku ?? null }));
          setProducts(mapped);
        } catch {
          // fallback to generic list
          const res = await StaffAPI.inventory.getProducts({ page: 1, limit: 100 });
          const arr = res?.products || res || [];
          setProducts(arr.map((p: any) => ({ id: p.id, name: p.name, barcode: p.barcode, sku: p.sku })));
        }
      } else {
        const res = await StaffAPI.inventory.getProducts({ page: 1, limit: 100, search: search || undefined });
        const arr = res?.products || res || [];
        setProducts(arr.map((p: any) => ({ id: p.id, name: p.name, barcode: p.barcode, sku: p.sku })));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load products';
      setError(msg);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [onlyMissing]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search.trim()) {
        const s = search.toLowerCase();
        if (!(p.name||'').toLowerCase().includes(s) && !(p.sku||'').toLowerCase().includes(s)) return false;
      }
      if (onlyMissing) return !p.barcode; // ensure still missing
      return true;
    });
  }, [products, search, onlyMissing]);

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(filtered.map(f => f.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const startGenerate = () => {
    if (selected.size === 0) return;
    setConfirmOpen(true);
  };

  const generate = async () => {
    setConfirmOpen(false);
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setGenLoading(true); setResults([]);
    const newResults: GenerationResult[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      setProgressIndex(i);
      try {
        const res = await StaffAPI.barcode.generate(id);
        const barcode = res?.barcode || res?.data?.barcode || res?.barcodeNumber;
        newResults.push({ id, status: 'success', barcode, message: res?.message || 'Generated' });
        // Update local product list
        setProducts(prev => prev.map(p => p.id === id ? { ...p, barcode } : p));
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed';
        newResults.push({ id, status: 'error', message: msg });
      }
      setResults([...newResults]);
    }
    setProgressIndex(-1);
    setGenLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Assign / Generate Barcodes</h1>
          <p className="text-gray-600">Generate barcodes for products missing one.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/staff-dashboard/barcode/generate" className="text-sm inline-flex items-center gap-1 text-primary hover:underline"><LinkIcon className="h-4 w-4" />Label Generator</Link>
          <Button variant="outline" onClick={fetchProducts} disabled={loading}><Layers className="mr-2 h-4 w-4" />Refresh</Button>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center"><ScanLine className="mr-2 h-5 w-5" />Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input placeholder="Search name or SKU" value={search} onChange={(e) => setSearch(e.target.value)} />
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} />
              Only Missing
            </label>
            <Button variant="outline" onClick={selectAll} disabled={filtered.length === 0}>Select All</Button>
            <Button variant="ghost" onClick={clearSelection} disabled={selected.size === 0}>Clear</Button>
          </div>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="py-2 px-3 w-8">Sel</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">SKU</th>
                  <th className="py-2 px-3">Barcode</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No products found</td></tr>
                ) : (
                  filtered.map(p => {
                    const res = results.find(r => r.id === p.id);
                    return (
                      <tr key={p.id} className="border-t">
                        <td className="py-1 px-3">
                          <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} />
                        </td>
                        <td className="py-1 px-3">{p.name}</td>
                        <td className="py-1 px-3">{p.sku || <span className="text-xs text-muted-foreground">—</span>}</td>
                        <td className="py-1 px-3 font-mono text-xs">{p.barcode || <span className="text-xs text-muted-foreground">(none)</span>}</td>
                        <td className="py-1 px-3">
                          {res ? (
                            res.status === 'success' ? <span className="inline-flex items-center text-green-600"><CheckCircle2 className="h-4 w-4 mr-1" />OK</span>
                              : <span className="inline-flex items-center text-red-600"><AlertTriangle className="h-4 w-4 mr-1" />Err</span>
                          ) : p.barcode ? <span className="inline-flex items-center text-muted-foreground"><Hash className="h-4 w-4 mr-1" />Existing</span> : <span className="text-orange-600">Missing</span>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={startGenerate} disabled={genLoading || selected.size === 0}>
              {genLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Barcode{selected.size > 1 ? 's' : ''} ({selected.size})
            </Button>
            {genLoading && progressIndex >= 0 && (
              <div className="text-xs text-muted-foreground self-center">{progressIndex + 1} / {selected.size}</div>
            )}
          </div>
          {results.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {results.filter(r => r.status === 'success').length} succeeded / {results.filter(r => r.status === 'error').length} failed.
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate {selected.size} barcode{selected.size>1?'s':''}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will assign new barcodes to all selected products that currently lack one. Existing barcodes are left unchanged.</p>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={generate} disabled={genLoading}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductBarcodeGenerator;
