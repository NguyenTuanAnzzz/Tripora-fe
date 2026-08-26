import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Map, Truck, FileText, Settings, LogOut, Ticket, MessageSquare, Building2, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, role }) => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const adminLinks = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/tours', icon: Map, label: 'Quản lý Tour' },
        { path: '/admin/destinations', icon: Map, label: 'Điểm đến' },
        { path: '/admin/hotels', icon: Building2, label: 'Khách sạn' },
        { path: '/admin/restaurants', icon: Utensils, label: 'Nhà hàng' },
        { path: '/admin/vehicles', icon: Truck, label: 'Phương tiện' },
        { path: '/admin/bookings', icon: FileText, label: 'Bookings' },
        { path: '/admin/users', icon: Users, label: 'Người dùng' },
        { path: '/admin/vouchers', icon: Ticket, label: 'Vouchers' },
        { path: '/admin/policies', icon: Settings, label: 'Chính sách hủy' },
    ];

    const staffLinks = [
        { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/staff/bookings', icon: FileText, label: 'Xử lý Bookings' },
        { path: '/staff/refunds', icon: FileText, label: 'Yêu cầu hoàn tiền' },
        { path: '/staff/tickets', icon: Ticket, label: 'Quản lý Ticket' },
        { path: '/staff/complaints', icon: MessageSquare, label: 'Hỗ trợ & Khiếu nại' },
    ];

    const links = role === 'ADMIN' ? adminLinks : staffLinks;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-ember-orange">Tripora</h1>
                    <p className="text-sm text-gray-500 mt-1">{role === 'ADMIN' ? 'Admin Portal' : 'Staff Portal'}</p>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname.startsWith(link.path);
                            return (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                            isActive 
                                                ? 'bg-ember-orange text-white' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
