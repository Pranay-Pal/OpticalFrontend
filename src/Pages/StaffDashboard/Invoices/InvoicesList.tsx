import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const InvoicesList = () => {
  const [query, setQuery] = useState("");

  // No list endpoint documented; we'll derive basic list from patients invoices via PatientsList links later.
  // For now, keep placeholder with create link.

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage billing and payment records</p>
        </div>
        <Link to="/staff-dashboard/invoices/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </Link>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Search (coming soon)" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="text-sm text-muted-foreground">Listing endpoint not provided; create invoices from the Create page or patient details.</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesList;