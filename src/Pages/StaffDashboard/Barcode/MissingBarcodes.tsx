import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StaffAPI } from '@/lib/api';
import { ScanLine, Hash, Layers, RefreshCw, Loader2, CheckCircle2, AlertTriangle, FileDown, Cpu } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router';

interface MissingProduct { id: number; name?: string; sku?: string | null; barcode?: string | null; }
interface Result { id: number; type: 'barcode' | 'sku'; status: 'success' | 'error'; value?: string; message?: string; }

const MissingBarcodes = () => {
  const [products, setProducts] = useState<MissingProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<Result[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [operation, setOperation] = useState<'barcode' | 'sku' | null>(null);
  const [progressIndex, setProgressIndex] = useState(-1);
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    setError(null); setLoading(true);
    try {
      const res = await StaffAPI.barcode.getMissing();
      const list = Array.isArray(res) ? res : [];
      setProducts(list.map((p: any) => ({ id: p.id, name: p.name, sku: p.sku ?? null, barcode: p.barcode ?? null })));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load missing products';
      setError(msg);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const s = search.toLowerCase();
    return products.filter(p => (p.name||'').toLowerCase().includes(s) || (p.sku||'').toLowerCase().includes(s));
  }, [products, search]);

  const toggleSelect = (id: number) => setSelected(prev => { const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const selectAll = () => setSelected(new Set(filtered.map(f => f.id)));
  const clearSelection = () => setSelected(new Set());

  const openGenerate = (type: 'barcode' | 'sku') => {
    if (selected.size === 0) return;
    setOperation(type);
    setConfirmOpen(true);
  };

  const exportCsv = () => {
    const rows: string[][] = [
      ['ID','Name','SKU','Barcode'],
      ...filtered.map(p => [String(p.id), p.name || '', p.sku || '', p.barcode || ''])
    ];
    const csv = rows.map(r => r.map(v => `"${v.replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'missing-barcodes.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const generate = async () => {
    if (!operation) return;
    setConfirmOpen(false);
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setGenerating(true); setResults([]); setProgressIndex(0);
    const newResults: Result[] = [];
    for (let i=0;i<ids.length;i++) {
      const id = ids[i];
      setProgressIndex(i);
      try {
        if (operation === 'barcode') {
          const res = await StaffAPI.barcode.generate(id); // reuse generate method
          const val = res?.barcode || res?.data?.barcode || res?.barcodeNumber;
          newResults.push({ id, type: 'barcode', status: 'success', value: val, message: res?.message || 'Generated' });
          setProducts(prev => prev.map(p => p.id === id ? { ...p, barcode: val } : p));
        } else {
          const res = await StaffAPI.barcode.generateSku(id);
          const val = res?.sku || res?.data?.sku || res?.generatedSku;
          newResults.push({ id, type: 'sku', status: 'success', value: val, message: res?.message || 'Generated' });
          setProducts(prev => prev.map(p => p.id === id ? { ...p, sku: val } : p));
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed';
        newResults.push({ id, type: operation, status: 'error', message: msg });
      }
      setResults([...newResults]);
    }
    setProgressIndex(-1); setGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Missing Barcodes / SKUs</h1>
          <p className="text-gray-600">Products without assigned barcodes or SKUs.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/staff-dashboard/barcode/assign" className="text-sm inline-flex items-center gap-1 text-primary hover:underline"><ScanLine className="h-4 w-4" />Assign</Link>
          <Link to="/staff-dashboard/barcode/sku" className="text-sm inline-flex items-center gap-1 text-primary hover:underline"><Hash className="h-4 w-4" />SKU</Link>
          <Link to="/staff-dashboard/barcode/generate" className="text-sm inline-flex items-center gap-1 text-primary hover:underline"><Cpu className="h-4 w-4" />Labels</Link>
          <Button variant="outline" onClick={fetchData} disabled={loading}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
          <Button variant="outline" onClick={exportCsv} disabled={filtered.length===0}><FileDown className="mr-2 h-4 w-4" />Export CSV</Button>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center"><Layers className="mr-2 h-5 w-5" />Missing Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input placeholder="Search name or SKU" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button variant="outline" onClick={selectAll} disabled={filtered.length===0}>Select All</Button>
            <Button variant="ghost" onClick={clearSelection} disabled={selected.size===0}>Clear</Button>
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
                  <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No missing items</td></tr>
                ) : (
                  filtered.map(p => {
                    const barcodeRes = results.find(r => r.id === p.id && r.type==='barcode');
                    const skuRes = results.find(r => r.id === p.id && r.type==='sku');
                    const statusEl = () => {
                      if (p.barcode && p.sku) return <span className="text-muted-foreground">Completed</span>;
                      if (barcodeRes?.status==='error' || skuRes?.status==='error') return <span className="inline-flex items-center text-red-600"><AlertTriangle className="h-4 w-4 mr-1" />Error</span>;
                      if (barcodeRes?.status==='success' || skuRes?.status==='success') return <span className="inline-flex items-center text-green-600"><CheckCircle2 className="h-4 w-4 mr-1" />Updated</span>;
                      return <span className="text-orange-600">Missing</span>;
                    };
                    return (
                      <tr key={p.id} className="border-t">
                        <td className="py-1 px-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                        <td className="py-1 px-3">{p.name}</td>
                        <td className="py-1 px-3 font-mono text-xs">{p.sku || <span className="text-xs text-muted-foreground">(none)</span>}</td>
                        <td className="py-1 px-3 font-mono text-xs">{p.barcode || <span className="text-xs text-muted-foreground">(none)</span>}</td>
                        <td className="py-1 px-3">{statusEl()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button onClick={() => openGenerate('barcode')} disabled={generating || selected.size===0}>
              {generating && operation==='barcode' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Barcodes ({selected.size})
            </Button>
            <Button variant="secondary" onClick={() => openGenerate('sku')} disabled={generating || selected.size===0}>
              {generating && operation==='sku' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate SKUs ({selected.size})
            </Button>
            {generating && progressIndex >= 0 && <div className="text-xs text-muted-foreground">{progressIndex + 1} / {selected.size}</div>}
          </div>
          {results.length>0 && (
            <div className="text-xs text-muted-foreground">
              {results.filter(r=>r.status==='success').length} succeeded / {results.filter(r=>r.status==='error').length} failed.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate {operation==='barcode'?'Barcodes':'SKUs'} for {selected.size} item{selected.size>1?'s':''}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">This will sequentially process each selected product. Already populated values will be updated only for the chosen type.</p>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={()=>setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={generate} disabled={generating}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MissingBarcodes;
