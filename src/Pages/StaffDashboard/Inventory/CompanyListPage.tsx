import React from 'react';
import CompaniesList from './_components/CompaniesList';

const CompanyListPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <CompaniesList />
    </div>
  );
};

export default CompanyListPage;
