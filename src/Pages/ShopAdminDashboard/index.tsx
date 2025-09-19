import { Routes, Route, Navigate } from "react-router";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardOverview from "./DashboardOverview";
import GrowthChart from "./GrowthChart";
import RecentActivities from "./RecentActivities";
import SalesReport from "./Reports/SalesReport";
import ProductSalesReport from "./Reports/ProductSalesReport";
import InventoryReport from "./Reports/InventoryReport";
import LowStockAlerts from "./Reports/LowStockAlerts";
import PatientReport from "./Reports/PatientReport";
import PatientVisitHistory from "./Reports/PatientVisitHistory";
import StaffList from "./Staff/StaffList";
import StaffDetails from "./Staff/StaffDetails";
import StaffActivities from "./Staff/StaffActivities";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  BarChart3, 
  Package, 
  AlertTriangle, 
  Users, 
  FileText,
  Calendar,
  ShoppingCart
} from "lucide-react";

const navItems = [
  { 
    label: "Overview", 
    to: "/shop-admin-dashboard", 
    icon: LayoutDashboard,
    description: "Dashboard overview"
  },
  { 
    label: "Growth", 
    to: "/shop-admin-dashboard/growth", 
    icon: TrendingUp,
    description: "Growth analytics"
  },
  { 
    label: "Activities", 
    to: "/shop-admin-dashboard/activities", 
    icon: Activity,
    description: "Recent activities"
  },
  {
    category: "Reports",
    items: [
      { 
        label: "Sales Report", 
        to: "/shop-admin-dashboard/reports/sales", 
        icon: BarChart3,
        description: "Sales analytics"
      },
      { 
        label: "Product Sales", 
        to: "/shop-admin-dashboard/reports/products", 
        icon: ShoppingCart,
        description: "Product performance"
      },
      { 
        label: "Inventory", 
        to: "/shop-admin-dashboard/reports/inventory", 
        icon: Package,
        description: "Stock management"
      },
      { 
        label: "Low Stock Alerts", 
        to: "/shop-admin-dashboard/reports/low-stock", 
        icon: AlertTriangle,
        description: "Stock alerts",
        badge: "3"
      },
      { 
        label: "Patients", 
        to: "/shop-admin-dashboard/reports/patients", 
        icon: FileText,
        description: "Patient reports"
      },
      { 
        label: "Patient Visits", 
        to: "/shop-admin-dashboard/reports/patients/visits", 
        icon: Calendar,
        description: "Visit history"
      },
    ]
  },
  {
    category: "Staff Management",
    items: [
      { 
        label: "Staff List", 
        to: "/shop-admin-dashboard/staff", 
        icon: Users,
        description: "Manage staff"
      },
    ]
  }
];

export default function ShopAdminDashboard() {
  return (
    <DashboardLayout
      navItems={navItems}
      title="Admin Dashboard"
      sidebarTitle="OpticalShop"
      headerUserAvatarFallback={<User className="h-4 w-4" />}
    >
      <Routes>
        <Route path="" element={<DashboardOverview />} />
        <Route path="growth" element={<GrowthChart />} />
        <Route path="activities" element={<RecentActivities />} />
        <Route path="reports/sales" element={<SalesReport />} />
        <Route path="reports/products" element={<ProductSalesReport />} />
        <Route path="reports/inventory" element={<InventoryReport />} />
        <Route path="reports/low-stock" element={<LowStockAlerts />} />
        <Route path="reports/patients" element={<PatientReport />} />
        <Route path="reports/patients/visits" element={<PatientVisitHistory />} />
        <Route path="staff" element={<StaffList />} />
        <Route path="staff/:staffId" element={<StaffDetails />} />
        <Route path="staff/:staffId/activities" element={<StaffActivities />} />
        <Route path="*" element={<Navigate to="." />} />
      </Routes>
    </DashboardLayout>
  );
}
