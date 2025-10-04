import React from 'react';
import { useParams, useNavigate } from 'react-router';
import ProductEditForm from './_components/ProductEditForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProductEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <div className="text-sm text-muted-foreground">Inventory / Products / {productId} / Edit</div>
      </div>
      {productId ? <ProductEditForm productId={productId} /> : <p className="text-sm text-red-500">Invalid product id</p>}
    </div>
  );
};

export default ProductEdit;
