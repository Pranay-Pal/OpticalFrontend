import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomerCreate = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add New Customer</h1>
        <p className="text-muted-foreground">Create a new customer account</p>
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

export default CustomerCreate;