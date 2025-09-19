import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductCreate = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
        <p className="text-muted-foreground">Add a new product to inventory</p>
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

export default ProductCreate;