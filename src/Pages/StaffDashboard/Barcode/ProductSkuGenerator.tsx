import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StaffAPI } from '@/lib/api';
import { Hash, Loader2, RefreshCw, CheckCircle2, AlertTriangle, Link as LinkIcon, ScanLine, Clipboard } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router';

interface ProductRow { id: number; name?: string; sku?: string | null; barcode?: string | null; }
interface Result { id: number; status: 'success' | 'error'; sku?: string; message?: string; }

const ProductSkuGenerator = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [onlyMissing, setOnlyMissing] = useState(true);
  const [allowRegenerate, setAllowRegenerate] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<Result[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [progressIndex, setProgressIndex] = useState(-1);
  const [generating, setGenerating] = useState(false);

  const fetchProducts = async () => {
    setError(null); setLoading(true);
    try {
      // Reuse inventory products endpoint; could add dedicated missing SKU endpoint later
      const res = await StaffAPI.inventory.getProducts({ page: 1, limit: 100, search: search || undefined });
      const arr = res?.products || res || [];
      setProducts(arr.map((p: any) => ({ id: p.id, name: p.name, sku: p.sku, barcode: p.barcode })));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load products';
      setError(msg);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search.trim()) {
        const s = search.toLowerCase();
        if (!(p.name||'').toLowerCase().includes(s) && !(p.sku||'').toLowerCase().includes(s)) return false;
      }
      if (onlyMissing) return !p.sku; else return true;
    });
  }, [products, search, onlyMissing]);

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(filtered.map(f => f.id)));
  const clearSelection = () => setSelected(new Set());

  const startGenerate = () => {
    if (selected.size === 0) return;
    if (allowRegenerate) setConfirmOpen(true); else setConfirmOpen(true); // same dialog either way
  };

  const copySku = async (sku?: string) => { if (!sku) return; try { await navigator.clipboard.writeText(sku); } catch {} };

  const generate = async () => {
    setConfirmOpen(false);
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setGenerating(true); setResults([]); setProgressIndex(0);
    const newResults: Result[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      setProgressIndex(i);
      const product = products.find(p => p.id === id);
      if (product?.sku && !allowRegenerate) {
        newResults.push({ id, status: 'error', message: 'Already has SKU' });
        setResults([...newResults]);
        continue;
      }
      try {
        const res = await StaffAPI.barcode.generateSku(id);
        const sku = res?.sku || res?.data?.sku || res?.generatedSku;
        newResults.push({ id, status: 'success', sku, message: res?.message || 'Generated' });
        setProducts(prev => prev.map(p => p.id === id ? { ...p, sku } : p));
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed';
        newResults.push({ id, status: 'error', message: msg });
      }
      setResults([...newResults]);
    }
    setGenerating(false); setProgressIndex(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Generate / Assign SKUs</h1>
          <p className="text-gray-600">Assign SKUs to products lacking one; optionally regenerate.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/staff-dashboard/barcode/assign" className="text-sm inline-flex items-center gap-1 text-primary hover:underline"><LinkIcon className="h-4 w-4" />Barcode Assign</Link>
          <Link to="/staff-dashboard/barcode/generate" className="text-sm inline-flex items-center gap-1 text-primary hover:underline"><ScanLine className="h-4 w-4" />Label Generator</Link>
          <Button variant="outline" onClick={fetchProducts} disabled={loading}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center"><Hash className="mr-2 h-5 w-5" />Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input placeholder="Search name or SKU" value={search} onChange={(e) => setSearch(e.target.value)} />
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} /> Only Missing
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={allowRegenerate} onChange={(e) => setAllowRegenerate(e.target.checked)} /> Allow Regenerate
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
                  <th className="py-2 px-3">Copy</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No products found</td></tr>
                ) : (
                  filtered.map(p => {
                    const res = results.find(r => r.id === p.id);
                    return (
                      <tr key={p.id} className="border-t">
                        <td className="py-1 px-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                        <td className="py-1 px-3">{p.name}</td>
                        <td className="py-1 px-3 font-mono text-xs">{p.sku || <span className="text-xs text-muted-foreground">(none)</span>}</td>
                        <td className="py-1 px-3 font-mono text-xs">{p.barcode || <span className="text-xs text-muted-foreground">—</span>}</td>
                        <td className="py-1 px-3">
                          {res ? res.status === 'success' ? (
                            <span className="inline-flex items-center text-green-600"><CheckCircle2 className="h-4 w-4 mr-1" />OK</span>
                          ) : (
                            <span className="inline-flex items-center text-red-600"><AlertTriangle className="h-4 w-4 mr-1" />Err</span>
                          ) : p.sku ? <span className="text-muted-foreground">Existing</span> : <span className="text-orange-600">Missing</span>}
                        </td>
                        <td className="py-1 px-3">
                          {p.sku && <Button variant="ghost" size="sm" onClick={() => copySku(p.sku || undefined)}><Clipboard className="h-4 w-4" /></Button>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button onClick={startGenerate} disabled={generating || selected.size === 0}>
              {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate SKU{selected.size>1?'s':''} ({selected.size})
            </Button>
            {generating && progressIndex >= 0 && (
              <div className="text-xs text-muted-foreground">{progressIndex + 1} / {selected.size}</div>
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
            <DialogTitle>Generate {selected.size} SKU{selected.size>1?'s':''}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">This will assign new SKUs to selected products{allowRegenerate? ', replacing any existing SKUs.':' that currently lack them.'}</p>
          {allowRegenerate && <Alert variant="destructive"><AlertDescription>Regenerating will overwrite existing SKUs. Ensure downstream systems are updated.</AlertDescription></Alert>}
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={generate} disabled={generating}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductSkuGenerator;
