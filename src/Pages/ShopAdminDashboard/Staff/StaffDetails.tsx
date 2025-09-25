import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Card } from "@/components/ui/card";
import { ShopAdminAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Attendance = { id: number; checkIn: string; checkOut?: string | null };
type Invoice = { id: number; totalAmount: number; patient: { name: string } ; createdAt: string };
type Prescription = { id: number; patient: { name: string }; createdAt: string };
type StaffDetail = { id: number; name: string; email: string; role: string; isActive: boolean; createdAt: string; attendance: Attendance[]; invoices: Invoice[]; prescriptions: Prescription[] };

export default function StaffDetails() {
  const { staffId } = useParams();
  const [details, setDetails] = useState<StaffDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!staffId) return;
    (async () => {
      setError(null);
      try {
        const data = await ShopAdminAPI.staff.getById(parseInt(staffId));
        // Normalize lists to avoid map on undefined
        const attendance = Array.isArray((data as any)?.attendance) ? (data as any).attendance : [];
        const invoices = Array.isArray((data as any)?.invoices) ? (data as any).invoices : [];
        const prescriptions = Array.isArray((data as any)?.prescriptions) ? (data as any).prescriptions : [];
        setDetails({
          id: (data as any)?.id,
          name: (data as any)?.name ?? "",
          email: (data as any)?.email ?? "",
          role: (data as any)?.role ?? "",
          isActive: Boolean((data as any)?.isActive),
          createdAt: (data as any)?.createdAt ?? new Date().toISOString(),
          attendance,
          invoices,
          prescriptions,
        } as StaffDetail);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [staffId]);

  if (!details && !error) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      {error && <Card className="mb-4 p-4 text-red-600">{error}</Card>}
      {details && (
      <Card className="mb-4 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">Staff Details</h2>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/shop-admin-dashboard/staff">Back to list</Link>
            </Button>
            {details?.id && (
              <Button asChild size="sm">
                <Link to={`/shop-admin-dashboard/staff/${details.id}/activities`}>View Activities</Link>
              </Button>
            )}
          </div>
        </div>
        <div>Name: {details.name}</div>
        <div>Email: {details.email}</div>
        <div>Role: {details.role}</div>
        <div>Status: {details.isActive ? "Active" : "Inactive"}</div>
        <div>Joined: {new Date(details.createdAt).toLocaleDateString()}</div>
      </Card>
      )}
      {details && (
      <Card className="mb-4 p-4">
        <h2 className="font-bold mb-2">Attendance</h2>
        <ul>
          {(details.attendance ?? []).map((att: Attendance) => (
            <li key={att.id} className="mb-1">
              Check-in: {new Date(att.checkIn).toLocaleString()} | Check-out: {att.checkOut ? new Date(att.checkOut).toLocaleString() : "-"}
            </li>
          ))}
        </ul>
      </Card>
      )}
      {details && (
      <Card className="mb-4 p-4">
        <h2 className="font-bold mb-2">Invoices</h2>
        <ul>
          {(details.invoices ?? []).map((inv: Invoice) => (
            <li key={inv.id} className="mb-1">
              Invoice #{inv.id} - ₹{inv.totalAmount} ({inv.patient.name}) on {new Date(inv.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </Card>
      )}
      {details && (
      <Card className="p-4">
        <h2 className="font-bold mb-2">Prescriptions</h2>
        <ul>
          {(details.prescriptions ?? []).map((pres: Prescription) => (
            <li key={pres.id} className="mb-1">
              Prescription #{pres.id} ({pres.patient.name}) on {new Date(pres.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </Card>
      )}
    </div>
  );
}
