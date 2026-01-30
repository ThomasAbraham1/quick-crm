import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Send, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
            )
        }
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </NavLink>
);

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col fixed h-full z-10">
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Send className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Quick CRM</h1>
                </div>

                <nav className="space-y-2 flex-1">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/templates" icon={FileText} label="Templates" />
                    <SidebarItem to="/contacts" icon={Users} label="Contacts" />
                    <SidebarItem to="/campaigns" icon={BarChart3} label="Campaigns" />
                </nav>

                <div className="mt-auto px-4 py-4 bg-blue-50 rounded-xl">
                    <div className="text-xs font-semibold text-blue-800 mb-1">PRO PLAN</div>
                    <div className="text-xs text-blue-600">50/50 Emails Sent</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
