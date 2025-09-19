import { Routes, Route, Navigate } from "react-router";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardOverview from "./DashboardOverview";
import PatientsList from "./Patients/PatientsList";
import PatientCreate from "./Patients/PatientCreate";
import PatientDetails from "./Patients/PatientDetails";
import PatientEdit from "./Patients/PatientEdit";
import CustomersList from "./Customers/CustomersList";
import CustomerCreate from "./Customers/CustomerCreate";
import CustomerDetails from "./Customers/CustomerDetails";
import InventoryList from "./Inventory/InventoryList";
import ProductCreate from "./Inventory/ProductCreate";
import StockMovements from "./Inventory/StockMovements";
import BarcodeOperations from "./Barcode/BarcodeOperations";
import InvoicesList from "./Invoices/InvoicesList";
import InvoiceCreate from "./Invoices/InvoiceCreate";
import PrescriptionsList from "./Prescriptions/PrescriptionsList";
import PrescriptionCreate from "./Prescriptions/PrescriptionCreate";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Package, 
  ScanLine, 
  FileText, 
  Stethoscope, 
  Plus, 
  TrendingUp, 
  ShoppingCart, 
  Activity
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth"; // Added useAuth import

const navItems = [
  {
    label: "Dashboard",
    to: "/staff-dashboard",
    icon: LayoutDashboard,
    description: "Dashboard overview"
  },
  {
    category: "Patients",
    items: [
      { label: "All Patients", to: "/staff-dashboard/patients", icon: Users, description: "View all patients" },
      { label: "Add Patient", to: "/staff-dashboard/patients/create", icon: UserPlus, description: "Create a new patient" },
    ],
  },
  {
    category: "Customers",
    items: [
      { label: "All Customers", to: "/staff-dashboard/customers", icon: Users, description: "View all customers" },
      { label: "Add Customer", to: "/staff-dashboard/customers/create", icon: UserPlus, description: "Create a new customer" },
    ],
  },
  {
    category: "Inventory",
    items: [
      { label: "Product Catalog", to: "/staff-dashboard/inventory", icon: Package, description: "View all products" },
      { label: "Add Product", to: "/staff-dashboard/inventory/products/create", icon: Plus, description: "Add a new product" },
      { label: "Stock Movements", to: "/staff-dashboard/inventory/stock-movements", icon: TrendingUp, description: "Track stock changes" },
    ],
  },
  {
    label: "Barcode Scanner",
    to: "/staff-dashboard/barcode",
    icon: ScanLine,
    description: "Scan product barcodes",
    badge: "New",
  },
  {
    category: "Invoices",
    items: [
        { label: "All Invoices", to: "/staff-dashboard/invoices", icon: FileText, description: "View all invoices" },
        { label: "Create Invoice", to: "/staff-dashboard/invoices/create", icon: Plus, description: "Create a new invoice" },
    ]
  },
  {
    category: "Prescriptions",
    items: [
        { label: "All Prescriptions", to: "/staff-dashboard/prescriptions", icon: Stethoscope, description: "View all prescriptions" },
        { label: "Create Prescription", to: "/staff-dashboard/prescriptions/create", icon: Plus, description: "Create a new prescription" },
    ]
  },
];

const StaffDashboard = () => {
  const { user } = useAuth(); // Assuming useAuth provides user object

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const staffSidebarLogo = (
    <Activity className="h-5 w-5 text-white" />
  );

  const staffQuickStats = (
    <div className="px-3">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Today's Patients</span>
            <span className="font-medium">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pending Orders</span>
            <span className="font-medium">5</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Low Stock Items</span>
            <span className="font-medium text-orange-600">3</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      navItems={navItems}
      title="Staff Dashboard"
      sidebarLogo={staffSidebarLogo}
      sidebarTitle="OpticStaff"
      sidebarActiveLinkClassName="bg-blue-50 text-blue-700 border-r-2 border-blue-600"
      sidebarQuickStats={staffQuickStats}
      headerUserAvatarFallback={user?.name ? getUserInitials(user.name) : 'ST'}
    >
      <Routes>
        {/* Dashboard Overview */}
        <Route index element={<DashboardOverview />} />
        
        {/* Patient Management */}
        <Route path="patients" element={<PatientsList />} />
        <Route path="patients/create" element={<PatientCreate />} />
        <Route path="patients/:id" element={<PatientDetails />} />
        <Route path="patients/:id/edit" element={<PatientEdit />} />
        
        {/* Customer Management */}
        <Route path="customers" element={<CustomersList />} />
        <Route path="customers/create" element={<CustomerCreate />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        
        {/* Inventory Management */}
        <Route path="inventory" element={<InventoryList />} />
        <Route path="inventory/products/create" element={<ProductCreate />} />
        <Route path="inventory/stock-movements" element={<StockMovements />} />
        
        {/* Barcode Operations */}
        <Route path="barcode" element={<BarcodeOperations />} />
        
        {/* Invoice Management */}
        <Route path="invoices" element={<InvoicesList />} />
        <Route path="invoices/create" element={<InvoiceCreate />} />
        
        {/* Prescription Management */}
        <Route path="prescriptions" element={<PrescriptionsList />} />
        <Route path="prescriptions/create" element={<PrescriptionCreate />} />
        
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/staff-dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StaffDashboard;
