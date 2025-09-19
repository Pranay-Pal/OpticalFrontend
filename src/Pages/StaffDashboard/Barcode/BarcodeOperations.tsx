import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanLine } from "lucide-react";

const BarcodeOperations = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Barcode Scanner</h1>
        <p className="text-muted-foreground">Scan barcodes for quick inventory operations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ScanLine className="mr-2 h-5 w-5" />
            Feature Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This feature is currently under development and will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeOperations;