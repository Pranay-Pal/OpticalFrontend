import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";
import { ShopAdminAPI } from "@/lib/api";

type StaffMember = { id: number; name: string; email: string; role: string; totalSales: number; totalOrders: number; isActive: boolean };

export default function StaffList() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    ShopAdminAPI.staff.getAll().then(data => setStaff(data));
  }, []);

  const paginated = staff.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(staff.length / pageSize);

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <h2 className="font-bold mb-2">Staff List</h2>
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
            {paginated.map((member: StaffMember) => (
              <tr key={member.id} className="border-b">
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>₹{member.totalSales}</td>
                <td>{member.totalOrders}</td>
                <td>{member.isActive ? "Yes" : "No"}</td>
                <td><Link to={`/shop-admin-dashboard/staff/${member.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  );
}
