// import AuthenticationPage from "@/pages/examples/authentication/page"
// import PlaygroundPage from "@/pages/examples/playground/page"
// import TaskPage from "@/pages/examples/tasks/page"
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import PermissionsManagement from "@/pages/examples/roles/page";
import LoginPage from "@/[locale]/login/page";
import SignupPage from "@/[locale]/signup/page";
import { PrivateRoute } from "@/pages/auth/PrivateRoute";
import Page from "@/pages/examples/dashboard/page"
import { AppSidebar } from "@/pages/examples/dashboard/components/app-sidebar"
import TeamsManagement from "@/pages/examples/teams/page"
import ChannelManagement from "@/pages/examples/channel/page"
import DetailedAnalytics from "@/pages/examples/analytics/page"
import './i18n';
import "./style/App.css"

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <div className="h-screen overflow-y flex-shrink-0">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="bg-white border-b border-gray-200 flex-shrink-0">
            {/* <UserAccountSelector /> */}
          </div>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
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
              <Page />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <AdminLayout>
              <TeamsManagement />
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