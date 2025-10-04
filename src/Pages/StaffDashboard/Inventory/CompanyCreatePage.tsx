import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CompanyCreateForm from './_components/CompanyCreateForm';

const CompanyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <div className="text-sm text-muted-foreground">Inventory / Companies / New</div>
      </div>
      <CompanyCreateForm />
    </div>
  );
};

export default CompanyCreatePage;
