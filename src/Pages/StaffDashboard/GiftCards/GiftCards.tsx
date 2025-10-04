import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StaffAPI } from "@/lib/api";

type IssueState = { patientId: string; balance: string };
type RedeemState = { code: string; amount: string };
type CheckState = { code: string };
export default function GiftCards() {
  const [issue, setIssue] = useState<IssueState>({ patientId: "", balance: "" });
  const [redeem, setRedeem] = useState<RedeemState>({ code: "", amount: "" });
  const [check, setCheck] = useState<CheckState>({ code: "" });
  const [result, setResult] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gift Cards</h1>
        <p className="text-gray-600">Issue, redeem, and check gift card balance</p>
      </div>
  {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <Card className="glass-card">
        <CardHeader><CardTitle>Issue Gift Card</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Input placeholder="Patient ID" value={issue.patientId} onChange={(e) => setIssue({ ...issue, patientId: e.target.value })} />
          <Input placeholder="Balance" type="number" value={issue.balance} onChange={(e) => setIssue({ ...issue, balance: e.target.value })} />
          <Button onClick={async () => { try { setError(null); setResult(await StaffAPI.giftCards.issue({ patientId: Number(issue.patientId), balance: Number(issue.balance) })); } catch (e) { const msg = e instanceof Error ? e.message : String(e); setError(msg); } }}>Issue</Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Redeem Gift Card</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Input placeholder="Code" value={redeem.code} onChange={(e) => setRedeem({ ...redeem, code: e.target.value })} />
          <Input placeholder="Amount" type="number" value={redeem.amount} onChange={(e) => setRedeem({ ...redeem, amount: e.target.value })} />
          <Button onClick={async () => { try { setError(null); setResult(await StaffAPI.giftCards.redeem({ code: redeem.code, amount: Number(redeem.amount) })); } catch (e) { const msg = e instanceof Error ? e.message : String(e); setError(msg); } }}>Redeem</Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Check Balance</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Input placeholder="Code" value={check.code} onChange={(e) => setCheck({ ...check, code: e.target.value })} />
          <Button variant="outline" onClick={async () => { try { setError(null); setResult(await StaffAPI.giftCards.getBalance(check.code)); } catch (e) { const msg = e instanceof Error ? e.message : String(e); setError(msg); } }}>Check</Button>
        </CardContent>
      </Card>

      {result !== null && (
        <pre className="bg-muted/50 p-3 rounded-lg overflow-auto max-h-80 text-sm">
          {String(JSON.stringify(result, null, 2))}
        </pre>
      )}
    </div>
  );
}
