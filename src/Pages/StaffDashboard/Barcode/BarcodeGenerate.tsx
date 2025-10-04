import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StaffAPI } from '@/lib/api';
import { ScanLine, Download, Printer, Clipboard, RefreshCw } from 'lucide-react';

interface ProductOption { id: number; name: string; sku?: string; }

const PRESETS = [
  { label: 'Small (150×50)', w: 150, h: 50 },
  { label: 'Medium (300×100)', w: 300, h: 100 },
  { label: 'Large (450×150)', w: 450, h: 150 },
];

const BarcodeGenerate = () => {
  const [productId, setProductId] = useState<number | undefined>();
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [search, setSearch] = useState('');
  const [format, setFormat] = useState<'png' | 'svg'>('png');
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [imgBlob, setImgBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch product list minimal (first page) - could add pagination later
  const fetchProducts = useCallback(async (q?: string) => {
    try {
      setFetchingProducts(true);
      const res = await StaffAPI.inventory.getProducts({ page: 1, limit: 25, search: q });
      // Expect shape maybe { products: [] } or array fallback
      const list = (res?.products || res || []).map((p: any) => ({ id: p.id, name: p.name, sku: p.sku }));
      setProducts(list);
    } catch (e) {
      // Silent product fetch error
    } finally { setFetchingProducts(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const generate = async () => {
    try {
      setLoading(true); setError(null); setImgBlob(null);
      const blob = await StaffAPI.barcode.generateLabel({ productId, format, width, height });
      setImgBlob(blob);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Generate failed';
      setError(msg);
    } finally { setLoading(false); }
  };

  const dataUrl = useMemo(() => {
    if (!imgBlob) return null;
    return URL.createObjectURL(imgBlob);
  }, [imgBlob]);

  const download = () => {
    if (!imgBlob) return;
    const url = URL.createObjectURL(imgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode${productId ? '-' + productId : ''}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!imgBlob) return;
    try {
      await navigator.clipboard.write([ new ClipboardItem({ [imgBlob.type]: imgBlob }) ]);
    } catch {
      // Fallback: copy URL
      if (dataUrl) navigator.clipboard.writeText(dataUrl);
    }
  };

  const handlePreset = (w: number, h: number) => { setWidth(w); setHeight(h); };

  const filteredProducts = products.filter(p => !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku||'').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Generate Barcode Label</h1>
        <p className="text-gray-600">Create printable barcode labels (PNG/SVG).</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center"><ScanLine className="mr-2 h-5 w-5" />Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Product (optional)</label>
              <div className="border rounded-md p-2 space-y-2">
                <Input placeholder="Search products" value={search} onChange={(e) => { setSearch(e.target.value); fetchProducts(e.target.value); }} />
                <div className="max-h-40 overflow-y-auto text-sm space-y-1">
                  {fetchingProducts && <div className="text-muted-foreground animate-pulse">Loading...</div>}
                  {!fetchingProducts && filteredProducts.map(p => (
                    <button key={p.id} type="button" onClick={() => setProductId(p.id === productId ? undefined : p.id)}
                      className={`w-full text-left px-2 py-1 rounded hover:bg-muted/60 ${p.id === productId ? 'bg-primary/10 text-primary' : ''}`}>
                      {p.name} {p.sku ? <span className="text-xs text-muted-foreground">({p.sku})</span> : null}
                    </button>
                  ))}
                  {!fetchingProducts && filteredProducts.length === 0 && <div className="text-xs text-muted-foreground">No results</div>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Leave blank to generate a generic label.</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Format</label>
              <Select value={format} onValueChange={(v: string) => setFormat(v as 'png' | 'svg')}>
                <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Size (width × height)</label>
              <div className="flex gap-2">
                <Input type="number" value={width} min={50} onChange={(e) => setWidth(Number(e.target.value))} />
                <Input type="number" value={height} min={20} onChange={(e) => setHeight(Number(e.target.value))} />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {PRESETS.map(p => (
                  <Button key={p.label} type="button" variant="outline" size="sm" onClick={() => handlePreset(p.w, p.h)}>{p.label}</Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button disabled={loading} onClick={generate}>
              {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
            <Button type="button" variant="secondary" disabled={!imgBlob} onClick={download}><Download className="mr-2 h-4 w-4" />Download</Button>
            <Button type="button" variant="outline" disabled={!imgBlob} onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Print</Button>
            <Button type="button" variant="ghost" disabled={!imgBlob} onClick={copyToClipboard}><Clipboard className="mr-2 h-4 w-4" />Copy</Button>
          </div>

          {dataUrl && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div className="p-4 rounded-lg border inline-block bg-white">
                {format === 'svg' ? (
                  <img src={dataUrl} alt="Barcode preview" className="max-w-full h-auto" />
                ) : (
                  <img src={dataUrl} alt="Barcode preview" className="max-w-full h-auto" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Right-click the image to save or use the action buttons above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeGenerate;
