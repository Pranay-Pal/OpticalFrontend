import Login from "./Pages/Login";
import StaffDashboard from "./Pages/StaffDashboard/index";
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./hooks/useAuth";
import ShopAdminDashboard from "./Pages/ShopAdminDashboard/index";

function ProtectedRoute({ children, type }: { children: React.ReactNode; type: string }) {
  const { token, type: userType } = useAuth();
  if (!token || userType !== type) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/staff-dashboard/*"
        element={
          <ProtectedRoute type="staff">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop-admin-dashboard/*"
        element={
          <ProtectedRoute type="shopAdmin">
            <ShopAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
