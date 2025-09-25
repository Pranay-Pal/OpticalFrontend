import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StaffAPI } from "@/lib/api";

export default function Royalty() {
  const [patientId, setPatientId] = useState("");
  const [result, setResult] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Royalty</h1>
        <p className="text-gray-600">Add and view patient royalty points</p>
      </div>
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      <Card className="glass-card">
        <CardHeader><CardTitle>Manage Points</CardTitle></CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Input placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
          <Button onClick={async () => { try { setError(null); setResult(await StaffAPI.addRoyaltyPoints(Number(patientId))); } catch (e) { const msg = e instanceof Error ? e.message : String(e); setError(msg); } }}>Add +10</Button>
          <Button variant="outline" onClick={async () => { try { setError(null); setResult(await StaffAPI.getRoyaltyPoints(Number(patientId))); } catch (e) { const msg = e instanceof Error ? e.message : String(e); setError(msg); } }}>View</Button>
        </CardContent>
      </Card>
      {result !== null && <pre className="bg-muted/50 p-3 rounded-lg overflow-auto max-h-80 text-sm">{String(JSON.stringify(result, null, 2))}</pre>}
    </div>
  );
}
