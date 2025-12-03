// src/App.tsx - UPDATED VERSION
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import UsersManagementPage from "@/pages/roles/UsersManagementPage";
import LoginPage from "@/[locale]/login/page";
import SignupPage from "@/[locale]/signup/page";
import { PrivateRoute } from "@/pages/auth/PrivateRoute";
import { AppSidebar } from "@/layouts/components/app-sidebar";
import { SiteHeader } from "@/layouts/components/site-header";
import DetailedAnalytics from "@/pages/analytics/page";
import CreateVideoPage from "@/pages/videos/create/page";
import MyVideosPage from "@/pages/videos/my/page";
import AllVideosPage from "@/pages/videos/all/page";
import MyChannelsPage from "@/pages/channels/my/page";
import TeamsManagementPage from "@/pages/teams/TeamsManagementPage";
import BranchManagementPage from "@/pages/brand/BranchManagementPage";
import ChannelManagementPage from '@/pages/channel/ChannelManagementPage';
import ChannelDetailPage from '@/pages/channel/ChannelDetailPage';

// New Dashboard Pages
import DashboardOverviewPage from "@/dashboard/DashboardOverviewPage";
import AdminStatsPage from "@/dashboard/AdminStatsPage";
import BranchDetailPage from "@/dashboard/BranchDetailPage";
import TeamDetailPage from "@/dashboard/TeamDetailPage";
import ChannelAnalyticsPage from "@/dashboard/ChannelAnalyticsPage";

//
import HomePage from "@/pages/HomePage"
import BranchDetailPageEnhanced from "@/pages/brand_chi_nhanh/BranchDetailPageEnhanced"
import TeamDetailPagee from "@/pages/teams_chi_nhanh/TeamDetailPage"

import './i18n';
import "./style/App.css";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden p-2 gap-2" style={{ backgroundColor: '#F7F7F7' }}>
        {/* Sidebar column (fixed) */}
        <div className="w-60 h-[calc(100vh-1rem)] overflow-y-auto" style={{ backgroundColor: '#F7F7F7' }}>
          <AppSidebar />
        </div>

        {/* Main panel */}
        <div className="flex-1 rounded-2xl border shadow-sm overflow-hidden flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
          {/* <SiteHeader /> */}
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
              <ChannelManagementPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/channels/:channelId"
        element={
          <PrivateRoute>
            <AdminLayout>
              <ChannelDetailPage />
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
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/branches/:branchId"
        element={
          <PrivateRoute>
            <AdminLayout>
              <BranchDetailPageEnhanced />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/teams/:teamId"
        element={
          <PrivateRoute>
            <AdminLayout>
              <TeamDetailPagee />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
