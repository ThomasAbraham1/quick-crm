import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Send, BarChart3, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

const SidebarItem = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) => (
    <NavLink
        to={to}
        onClick={onClick}
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50 flex items-center px-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <Menu size={24} className="text-gray-700" />
                </button>
                <div className="flex items-center gap-2 ml-4">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Send className="text-white w-4 h-4" />
                    </div>
                    <h1 className="text-lg font-bold text-gray-900">Quick CRM</h1>
                </div>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "w-64 bg-white border-r border-gray-100 p-6 flex flex-col fixed h-full z-50 transition-transform duration-300",
                "lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Close Button (Mobile) */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
                >
                    <X size={20} className="text-gray-600" />
                </button>

                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Send className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Quick CRM</h1>
                </div>

                <nav className="space-y-2 flex-1">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem to="/templates" icon={FileText} label="Templates" onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem to="/contacts" icon={Users} label="Contacts" onClick={() => setIsSidebarOpen(false)} />
                    <SidebarItem to="/campaigns" icon={BarChart3} label="Campaigns" onClick={() => setIsSidebarOpen(false)} />
                </nav>

                <div className="mt-auto px-4 py-4 bg-blue-50 rounded-xl">
                    <div className="text-xs font-semibold text-blue-800 mb-1">PRO PLAN</div>
                    <div className="text-xs text-blue-600">50/50 Emails Sent</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0 min-w-0">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
