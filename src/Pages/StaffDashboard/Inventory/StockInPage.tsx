import React from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import StockInForm from './_components/StockInForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const StockInPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const productIdParam = params.get('productId');
  const defaultProductId = productIdParam ? Number(productIdParam) : undefined;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <div className="text-sm text-muted-foreground">Inventory / Stock In</div>
      </div>
      <StockInForm defaultProductId={defaultProductId} />
    </div>
  );
};

export default StockInPage;
