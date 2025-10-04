import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { StaffAPI } from '@/lib/api';
import { RefreshCw, MapPin, BarChart2, FileDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

interface HotspotRow { address?: string; count?: number; total?: number; [k: string]: any }

const normalizeData = (raw: any): HotspotRow[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(r => ({ address: r.address || r.location || r.name, count: r.count || r.total || r.value || 0 }));
  if (raw.hotspots) return normalizeData(raw.hotspots);
  return [];
};

const CustomerHotspots = () => {
  const [data, setData] = useState<HotspotRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true); setError(null);
      const res = await StaffAPI.customers.getHotspots();
      setData(normalizeData(res));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load hotspots';
      setError(msg);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const total = useMemo(() => data.reduce((sum, r) => sum + (r.count || 0), 0), [data]);
  const top10 = useMemo(() => [...data].sort((a,b)=> (b.count||0)-(a.count||0)).slice(0,10), [data]);

  const exportCsv = () => {
    const rows: string[][] = [["Address","Count","Share(%)"]];
    for (const r of data) {
      const share = total ? ((r.count||0)/total*100).toFixed(2) : '0.00';
      rows.push([r.address || '', String(r.count || 0), share]);
    }
    const csv = rows.map(r => r.map(v => `"${v.replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'customer-hotspots.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customer Hotspots</h1>
          <p className="text-gray-600">Top recurring customer address clusters</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={fetchData} disabled={loading}><RefreshCw className={`h-4 w-4 mr-2 ${loading? 'animate-spin':''}`} />Refresh</Button>
          <Button variant="outline" onClick={exportCsv} disabled={!data.length}><FileDown className="h-4 w-4 mr-2" />Export CSV</Button>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Address Hotspots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_,i)=><Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : !data.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No hotspot data available</div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="py-2 px-3">Address</th>
                    <th className="py-2 px-3">Count</th>
                    <th className="py-2 px-3">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(r => {
                    const share = total ? ((r.count||0)/total*100).toFixed(2) : '0.00';
                    return (
                      <tr key={r.address} className="border-t hover:bg-muted/40">
                        <td className="py-2 px-3 max-w-[320px] truncate" title={r.address}>{r.address || <span className='text-muted-foreground'>(unknown)</span>}</td>
                        <td className="py-2 px-3">{r.count || 0}</td>
                        <td className="py-2 px-3">{share}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5" /> Top 10 Chart</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-56 w-full" /> : !top10.length ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No data to visualize</div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top10} margin={{ top: 8, right: 16, left: 0, bottom: 32 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="address" interval={0} tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(val: any) => [val, 'Count']} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerHotspots;
