import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StaffAPI } from "@/lib/api";

type YearMonth = { year: string; month: string };
type Range = { start: string; end: string };
export default function Reports() {
  const [date, setDate] = useState("");
  const [ym, setYm] = useState<YearMonth>({ year: "", month: "" });
  const [range, setRange] = useState<Range>({ start: "", end: "" });
  const [result, setResult] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Daily, monthly, and sales analytics</p>
      </div>

  {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <Card className="glass-card">
        <CardHeader><CardTitle>Daily Report</CardTitle></CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Button onClick={async () => { try { setError(null); setResult(await StaffAPI.dailyReport(date)); } catch (e) { const msg = e instanceof Error ? e.message : String(e); setError(msg); } }}>Fetch</Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Monthly Report</CardTitle></CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Input placeholder="Year" inputMode="numeric" value={ym.year} onChange={(e) => setYm({ ...ym, year: e.target.value })} />
          <Input placeholder="Month" inputMode="numeric" value={ym.month} onChange={(e) => setYm({ ...ym, month: e.target.value })} />
          <Button onClick={async () => { try { setError(null); setResult(await StaffAPI.monthlyReport(Number(ym.year), Number(ym.month))); } catch (e) { const msg = e instanceof Error ? e.message : String(e); setError(msg); } }}>Fetch</Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Sales Reports</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 items-center">
            <Input type="date" value={range.start} onChange={(e) => setRange({ ...range, start: e.target.value })} />
            <Input type="date" value={range.end} onChange={(e) => setRange({ ...range, end: e.target.value })} />
            <Button onClick={async () => { try { setError(null); setResult(await StaffAPI.staffSalesReport(range.start, range.end)); } catch (e) { const msg = e instanceof Error ? e.message : String(e); setError(msg); } }}>Staff Sales</Button>
            <Button variant="outline" onClick={async () => { try { setError(null); setResult(await StaffAPI.salesByPriceTier(range.start, range.end)); } catch (e) { const msg = e instanceof Error ? e.message : String(e); setError(msg); } }}>By Price Tier</Button>
            <Button variant="secondary" onClick={async () => { try { setError(null); setResult(await StaffAPI.bestSellersByPriceTier(range.start, range.end, 5)); } catch (e) { const msg = e instanceof Error ? e.message : String(e); setError(msg); } }}>Best Sellers</Button>
          </div>
        </CardContent>
      </Card>

      {result !== null && (
        <Card className="glass-card">
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent>
            <pre className="bg-muted/50 p-3 rounded-lg overflow-auto max-h-96 text-sm">{String(JSON.stringify(result, null, 2))}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
