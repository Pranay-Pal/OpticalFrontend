import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const PrescriptionsList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-muted-foreground">Manage patient prescriptions and medical records</p>
        </div>
        <Link to="/staff-dashboard/prescriptions/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Prescription
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This feature is currently under development and will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionsList;