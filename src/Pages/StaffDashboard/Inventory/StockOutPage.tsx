import React from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import StockOutForm from './_components/StockOutForm';
import StockOutByBarcode from './StockOutByBarcode';

const StockOutPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const defaultProductId = params.get('productId') ? Number(params.get('productId')) : undefined;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <div className="text-sm text-muted-foreground">Inventory / Stock Out</div>
      </div>
      <Tabs defaultValue="barcode" className="w-full">
        <TabsList>
          <TabsTrigger value="barcode">Barcode</TabsTrigger>
          <TabsTrigger value="manual">Manual / Batch</TabsTrigger>
        </TabsList>
        <TabsContent value="barcode">
          <StockOutByBarcode />
        </TabsContent>
        <TabsContent value="manual">
          <StockOutForm defaultProductId={defaultProductId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockOutPage;
