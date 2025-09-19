import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StockMovements = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Stock Movements</h1>
        <p className="text-muted-foreground">Track inventory changes and stock operations</p>
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

export default StockMovements;