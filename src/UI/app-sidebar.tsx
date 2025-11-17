import {
    LayoutDashboard,
    Users,
    Youtube,
    BarChart3,
    ShieldCheck,
    LogOut,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";
import LanguageSwitcher from "./LanguageSwitcher";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export function AppSidebar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { title: t("admin.sidebar.dashboard"), url: "/dashboard", icon: LayoutDashboard },
        { title: t("admin.sidebar.teamManagement"), url: "/teams", icon: Users },
        { title: t("admin.sidebar.channelManagement"), url: "/channels", icon: Youtube },
        { title: t("admin.sidebar.analytics"), url: "/analytics", icon: BarChart3 },
        { title: t("admin.sidebar.permissions"), url: "/roles", icon: ShieldCheck },
    ];

    const handleLogout = () => {

        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    const logoutText = t("auth.logout");

    return (
        <Sidebar className="bg-[#1e293b]">
            <SidebarContent className="bg-[#1e293b]">
                <div
                    className="p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-700/50 transition-colors rounded-lg mx-2"
                    onClick={() => navigate('/dashboard')}
                >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                            <Youtube className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-sm">YT Manager</h1>
                        <p className="text-slate-400 text-sm">{t("admin.sidebar.dashboard")}</p>
                    </div>
                </div>

                <SidebarGroup className="px-3 pt-6">
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {items.map((item) => {
                                const isActive = location.pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`
                                                h-12 px-4 text-slate-300 hover:text-white
                                                hover:bg-slate-700/50 transition-all duration-200
                                                ${isActive ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                                            `}
                                        >
                                            <Link to={item.url} className="flex items-center gap-3">
                                                <item.icon className="w-5 h-5" />
                                                <span className="text-[15px] font-medium">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto bg-[#1e293b] space-y-2">
                <LanguageSwitcher />

                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-slate-400 text-xs truncate">
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-red-600/20 transition-colors text-slate-300 hover:text-red-400"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">
                        {logoutText || "Đăng xuất"}
                    </span>
                </button>
            </SidebarFooter>
        </Sidebar>
    );
}
