// src/App.tsx - UPDATED VERSION
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import UsersManagementPage from "@/pages/examples/roles/UsersManagementPage";
import LoginPage from "@/[locale]/login/page";
import SignupPage from "@/[locale]/signup/page";
import { PrivateRoute } from "@/pages/auth/PrivateRoute";
import { AppSidebar } from "@/pages/examples/dashboard/components/app-sidebar";
import TeamsManagement from "@/pages/examples/brand/page";
import ChannelManagement from "@/pages/examples/channel/page";
import DetailedAnalytics from "@/pages/examples/analytics/page";
import CreateVideoPage from "@/pages/examples/videos/create/page";
import MyVideosPage from "@/pages/examples/videos/my/page";
import AllVideosPage from "@/pages/examples/videos/all/page";
import MyChannelsPage from "@/pages/examples/channels/my/page";
import TeamsManagementPage from "@/pages/examples/teams/TeamsManagementPage";
import BranchManagementPage from "@/pages/examples/brand/BranchManagementPage";

// New Dashboard Pages
import DashboardOverviewPage from "@/dashboard/DashboardOverviewPage";
import AdminStatsPage from "@/dashboard/AdminStatsPage";
import BranchDetailPage from "@/dashboard/BranchDetailPage";
import TeamDetailPage from "@/dashboard/TeamDetailPage";
import ChannelAnalyticsPage from "@/dashboard/ChannelAnalyticsPage";

import './i18n';
import "./style/App.css";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <div className="h-screen overflow-y">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="bg-white border-b border-gray-200">
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

      {/* Original Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AdminLayout>
              <DashboardOverviewPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* NEW: Dashboard Overview */}
      <Route
        path="/dashboard/overview"
        element={
          <PrivateRoute>
            <AdminLayout>
              <DashboardOverviewPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* NEW: Admin Statistics */}
      <Route
        path="/dashboard/admin-stats"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminStatsPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* NEW: Branch Detail */}
      <Route
        path="/dashboard/branch/:branchId"
        element={
          <PrivateRoute>
            <AdminLayout>
              <BranchDetailPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* NEW: Team Detail */}
      <Route
        path="/dashboard/teams/:teamId"
        element={
          <PrivateRoute>
            <AdminLayout>
              <TeamDetailPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* NEW: Channel Analytics */}
      <Route
        path="/dashboard/channels/:channelId/analytics"
        element={
          <PrivateRoute>
            <AdminLayout>
              <ChannelAnalyticsPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* Existing Routes */}
      <Route
        path="/brand"
        element={
          <PrivateRoute>
            <AdminLayout>
              <BranchManagementPage />
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
        path="/teams"
        element={
          <PrivateRoute>
            <AdminLayout>
              <TeamsManagementPage />
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
              <UsersManagementPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/videos/create"
        element={
          <PrivateRoute>
            <AdminLayout>
              <CreateVideoPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/videos/my"
        element={
          <PrivateRoute>
            <AdminLayout>
              <MyVideosPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/videos/all"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AllVideosPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/channels/my"
        element={
          <PrivateRoute>
            <AdminLayout>
              <MyChannelsPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
