import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Package, FileText } from "lucide-react";
import { MetricCard } from "@/components/MetricCard"; // Keep MetricCard import
import { Badge } from "@/components/ui/badge"; // Keep Badge import
import { Calendar, Target, AlertTriangle } from "lucide-react"; // Keep these icons

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to your staff dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Patients"
          value={147}
          description="+12% from last month"
          icon={Users}
          className="border-mimi-pink/20 bg-mimi-pink/10"
        />
        <MetricCard
          title="Inventory Items"
          value={1234}
          description="+5% from last week"
          icon={Package}
          className="border-lavender-pink/20 bg-lavender-pink/10"
        />
        <MetricCard
          title="Today's Invoices"
          value={23}
          description="+18% from yesterday"
          icon={FileText}
          className="border-celeste/20 bg-celeste/10"
        />
        <MetricCard
          title="Active Sessions"
          value={8}
          description="Current active users"
          icon={Activity}
          className="border-non-photo-blue/20 bg-non-photo-blue/10"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="p-4 border rounded-lg hover:bg-mint-cream transition-colors">
              <Users className="h-8 w-8 mx-auto mb-2 text-non-photo-blue" />
              <p className="text-sm font-medium">Add Patient</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-mint-cream transition-colors">
              <Package className="h-8 w-8 mx-auto mb-2 text-celeste" />
              <p className="text-sm font-medium">Scan Barcode</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-mint-cream transition-colors">
              <FileText className="h-8 w-8 mx-auto mb-2 text-mimi-pink" />
              <p className="text-sm font-medium">Create Invoice</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-mint-cream transition-colors">
              <Activity className="h-8 w-8 mx-auto mb-2 text-lavender-pink" />
              <p className="text-sm font-medium">Stock Movement</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;