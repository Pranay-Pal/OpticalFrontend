import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, RefreshCw, FileText, ExternalLink } from "lucide-react";

interface InvoiceRow { id?: string; total?: number; amount?: number; grandTotal?: number; status?: string; createdAt?: string; date?: string; [k: string]: any }
interface CustomerData {
  id?: number;
  name?: string;
  phone?: string;
  address?: string;
  invoices?: InvoiceRow[];
  [k: string]: any;
}

const pickDate = (row: InvoiceRow) => row.date || row.createdAt || row.created_at || row.created || '';
const pickTotal = (row: InvoiceRow) => row.grandTotal || row.total || row.amount || 0;

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (!id) return;
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const res = await StaffAPI.customers.getById(Number(id));
      // Flexible: may return { customer, invoices } or combined
      let customer: CustomerData;
      if (res?.customer) customer = { ...res.customer, invoices: res.invoices || res.customer?.invoices || [] };
      else customer = { ...res, invoices: res?.invoices || res?.customerInvoices || res?.customer?.invoices || [] };
      // Normalize invoices array
      if (!Array.isArray(customer.invoices)) customer.invoices = [];
      setData(customer);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load customer";
      setError(msg);
    } finally {
      if (isRefresh) setRefreshing(false); else setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  const invoices = data?.invoices || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
          <p className="text-gray-600">View customer profile and related invoices</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchData(true)} disabled={refreshing || loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin':''}`} /> Refresh
          </Button>
          <Link to="/staff-dashboard/invoices/create" state={data ? { customerId: data.id, customerName: data.name } : undefined}>
            <Button size="sm" variant="secondary">
              <FileText className="h-4 w-4 mr-1" /> New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Customer Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !data ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-52" />
            </div>
          ) : !data ? (
            <p className="text-sm text-muted-foreground">No data available</p>
          ) : (
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Name:</span> {data.name || <span className="text-muted-foreground">(unknown)</span>}</div>
              <div><span className="font-medium">Phone:</span> {data.phone || <span className="text-muted-foreground">—</span>}</div>
              <div><span className="font-medium">Address:</span> {data.address || <span className="text-muted-foreground">—</span>}</div>
              <div className="text-xs text-muted-foreground pt-2">ID: {data.id}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !data ? (
            <Skeleton className="h-32 w-full" />
          ) : invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices found for this customer.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="py-2 px-3">Invoice ID</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 w-12" aria-label="Actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id || Math.random()} className="border-t hover:bg-muted/40">
                      <td className="py-2 px-3 font-mono text-xs">{inv.id || '—'}</td>
                      <td className="py-2 px-3">{pickDate(inv) || '—'}</td>
                      <td className="py-2 px-3">₹{pickTotal(inv)}</td>
                      <td className="py-2 px-3">{inv.status || <span className="text-muted-foreground">—</span>}</td>
                      <td className="py-2 px-3">
                        <Link to={`/staff-dashboard/invoices/${inv.id}`}> 
                          <Button variant="ghost" size="sm" aria-label="View Invoice"><ExternalLink className="h-4 w-4" /></Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetails;
