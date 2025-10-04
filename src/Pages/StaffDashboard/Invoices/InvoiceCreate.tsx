import React from 'react';
import { useNavigate } from 'react-router';
import InvoiceCreateForm from './_components/InvoiceCreateForm';

const InvoiceCreate: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 space-y-4">
      <InvoiceCreateForm onCreated={(inv) => { if (inv?.id != null) { navigate(`/staff-dashboard/invoices/${inv.id}`); } }} />
    </div>
  );
};

export default InvoiceCreate;
