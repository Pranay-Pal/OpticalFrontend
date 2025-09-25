import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";
import { ShopAdminAPI } from "@/lib/api";

type StaffMember = { id: number; name: string; email: string; role: string; totalSales: number; totalOrders: number; isActive: boolean };

export default function StaffList() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ShopAdminAPI.staff.getAll();
        if (!cancelled) setStaff(Array.isArray(data) ? data : (Array.isArray((data as any)?.staff) ? (data as any).staff : []));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const paginated = staff.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(staff.length / pageSize);

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-4">
        <h2 className="font-bold mb-3">Staff List</h2>
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Sales</th>
              <th>Orders</th>
              <th>Active</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">Loading...</td></tr>
            )}
            {!loading && paginated.map((member: StaffMember) => (
              <tr key={member.id} className="border-b">
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>₹{member.totalSales ?? 0}</td>
                <td>{member.totalOrders}</td>
                <td>{member.isActive ? "Yes" : "No"}</td>
                <td><Link to={`/shop-admin-dashboard/staff/${member.id}`}>View</Link></td>
              </tr>
            ))}
            {!loading && paginated.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">No staff found</td></tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  );
}
