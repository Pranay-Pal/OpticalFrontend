import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RetailerAPI } from "@/lib/retailerApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RetailerReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<any>({ reports: [], pagination: null });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await RetailerAPI.reports({ page: 1, limit: 10 });
        if (!mounted) return;
        setReports(data || { reports: [] });
      } catch (e: any) {
        setError(e.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card className="glass-card" key={i}>
            <CardHeader><CardTitle className="text-sm"><Skeleton className="h-4 w-40"/></CardTitle></CardHeader>
            <CardContent><Skeleton className="h-16 w-full"/></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-brand-gradient">Reports</h2>
        <p className="text-muted-foreground">Previously generated reports</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Generate Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Button
              onClick={async () => {
                if (!startDate || !endDate) return;
                try { await RetailerAPI.profitLoss({ startDate, endDate, format: 'json' });
                  const data = await RetailerAPI.reports({ page: 1, limit: 10 });
                  setReports(data);
                } catch (e) {}
              }}
            >Profit & Loss</Button>
            <Button
              variant="secondary"
              onClick={async () => {
                if (!startDate || !endDate) return;
                try { await RetailerAPI.taxReport({ startDate, endDate, format: 'json' });
                  const data = await RetailerAPI.reports({ page: 1, limit: 10 });
                  setReports(data);
                } catch (e) {}
              }}
            >Tax Report</Button>
            <Button
              variant="outline"
              onClick={async () => {
                try { await RetailerAPI.stockValuation();
                  const data = await RetailerAPI.reports({ page: 1, limit: 10 });
                  setReports(data);
                } catch (e) {}
              }}
            >Stock Valuation</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Generated</th>
                  <th className="py-2 pr-4">Summary</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(reports?.reports ?? []).map((r: any) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2 pr-4">{r.type}</td>
                    <td className="py-2 pr-4">{new Date(r.generatedAt).toLocaleString()}</td>
                    <td className="py-2 pr-4">₹{r.summary?.totalRevenue?.toLocaleString?.()} revenue</td>
                    <td className="py-2 pr-4">
                      <Button size="sm" variant="outline" onClick={async () => {
                        try {
                          await RetailerAPI.deleteReport(r.id);
                          const data = await RetailerAPI.reports({ page: 1, limit: 10 });
                          setReports(data);
                        } catch (e) {}
                      }}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
