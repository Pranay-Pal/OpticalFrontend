import { useEffect, useMemo, useState } from "react";
import { ShopAdminAPI } from "@/lib/api";
import Pagination from "../Pagination/Pagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

type PatientSummary = { totalPatients: number; newPatients: number; totalVisits: number; avgSpendPerPatient: number };
type Patient = {
  id: number; name: string; age: number; gender: string; phone: string;
  registrationDate: string; totalSpent: number; totalOrders: number; totalPrescriptions: number; lastVisit: string
};
type PatientReportResponse = { summary: PatientSummary; patients: Patient[] };

export default function PatientReport() {
  const [report, setReport] = useState<PatientReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [type, setType] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().slice(0,10));

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // API expects type: 'active' | 'new' | 'all'
      const res = await ShopAdminAPI.reports.getPatients(type, startDate, endDate);
      // Normalize: allow envelope variants like { patients: [], summary: {} }
      const patients: Patient[] = Array.isArray((res as any)?.patients) ? (res as any).patients : (Array.isArray(res) ? (res as any) : []);
      const summary: PatientSummary = (res as any)?.summary ?? {
        totalPatients: patients.length,
        newPatients: 0,
        totalVisits: 0,
        avgSpendPerPatient: 0,
      };
      setReport({ patients, summary });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const patients = report?.patients ?? [];
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return patients.slice(start, start + pageSize);
  }, [patients, page]);
  const totalPages = Math.max(1, Math.ceil(patients.length / pageSize));

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-4 p-4">
        <h2 className="font-bold mb-3">Patient Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Type</label>
            <div className="flex gap-2">
              <Button variant={type === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setType('all')}>All</Button>
              <Button variant={type === 'active' ? 'default' : 'outline'} size="sm" onClick={() => setType('active')}>Active</Button>
              <Button variant={type === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setType('new')}>New</Button>
            </div>
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => { setPage(1); load(); }} disabled={loading}>{loading ? 'Loading...' : 'Apply'}</Button>
          </div>
        </div>
      </Card>

      {error && <Card className="mb-4 p-4 text-red-600">{error}</Card>}

      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Patients</div>
          <div className="text-2xl font-semibold">{report?.summary.totalPatients ?? patients.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">New Patients</div>
          <div className="text-2xl font-semibold">{report?.summary.newPatients ?? 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Visits</div>
          <div className="text-2xl font-semibold">{report?.summary.totalVisits ?? 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Spend/Patient</div>
          <div className="text-2xl font-semibold">₹{report?.summary.avgSpendPerPatient ?? 0}</div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Patients</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Registration Date</th>
                <th>Total Spent</th>
                <th>Total Orders</th>
                <th>Total Prescriptions</th>
                <th>Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={9} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
              )}
              {!loading && paginated.map((patient: Patient) => (
                <tr key={patient.id} className="border-b">
                  <td>
                    <Link className="text-primary hover:underline"
                      to={`/shop-admin-dashboard/reports/patients/visits?patientId=${patient.id}&startDate=${startDate}&endDate=${endDate}`}>
                      {patient.name}
                    </Link>
                  </td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : '—'}</td>
                  <td>₹{patient.totalSpent ?? 0}</td>
                  <td>{patient.totalOrders ?? 0}</td>
                  <td>{patient.totalPrescriptions ?? 0}</td>
                  <td>{patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
              {!loading && paginated.length === 0 && (
                <tr><td colSpan={9} className="py-6 text-center text-muted-foreground">No patients</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
