import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/UI/app-sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import Teams from "@/pages/teams";
import ChannelManagement from "@/pages/channel";
import DetailedAnalytics from "@/pages/analytics";
import PermissionsManagement from "@/pages/roles";
import LoginPage from "@/[locale]/login/page";
import SignupPage from "@/[locale]/signup/page";
import { PrivateRoute } from "@/pages/auth/PrivateRoute";
import './i18n';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Teams />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/channels"
        element={
          <PrivateRoute>
            <AdminLayout>
              <ChannelManagement />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <AdminLayout>
              <DetailedAnalytics />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <PrivateRoute>
            <AdminLayout>
              <PermissionsManagement />
            </AdminLayout>
          </PrivateRoute>
        }
      />


      <Route path="/" element={<Navigate to="/login" replace />} />


      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
