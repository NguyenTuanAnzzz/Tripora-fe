import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FileText, Clock, AlertCircle, Ticket, MessageSquare, RotateCcw } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StaffDashboard = () => {
    // Mock data based on setting.md requirements
    const stats = {
        totalBookings: 450,
        holdingBookings: 12,
        awaitingRemaining: 45,
        pendingTickets: 8,
        pendingRefunds: 5,
        activeInquiries: 15
    };

    const bookingVolumeData = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
            {
                label: 'Số lượng Booking mới',
                data: [12, 19, 15, 25, 22, 40, 35],
                backgroundColor: 'rgba(249, 115, 22, 0.8)', // ember-orange
                borderRadius: 4,
            },
        ],
    };

    const bookingStatusData = {
        labels: ['Đang HOLD', 'Chờ trả nốt (AWAITING)', 'Chờ xuất vé', 'Đã xuất vé (Hoàn tất)'],
        datasets: [
            {
                data: [stats.holdingBookings, stats.awaitingRemaining, stats.pendingTickets, 150],
                backgroundColor: [
                    'rgba(249, 115, 22, 0.8)', // orange
                    'rgba(59, 130, 246, 0.8)', // blue
                    'rgba(168, 85, 247, 0.8)', // purple
                    'rgba(34, 197, 94, 0.8)', // green
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <DashboardLayout role="STAFF">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-sm text-gray-500">Hôm nay: {new Date().toLocaleDateString('vi-VN')}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:border-ember-orange/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Tổng Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:border-orange-500/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Đang HOLD (chờ cọc)</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-gray-900">{stats.holdingBookings}</p>
                            <span className="text-xs text-orange-600 font-medium">Cần theo dõi</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:border-blue-500/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Sắp đến hạn trả nốt</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-gray-900">{stats.awaitingRemaining}</p>
                            <span className="text-xs text-blue-600 font-medium">AWAITING_REMAINING</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:border-green-500/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Chờ xuất Ticket</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingTickets}</p>
                            <span className="text-xs text-green-600 font-medium">FULLY_PAID</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:border-red-500/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                        <RotateCcw className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Yêu cầu hoàn tiền</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingRefunds}</p>
                            <span className="text-xs text-red-600 font-medium">Chờ duyệt</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:border-purple-500/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Khiếu nại / Hỗ trợ mới</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeInquiries}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Bar Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Tốc độ tăng trưởng Booking tuần qua</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Bar 
                            data={bookingVolumeData} 
                            options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
                        />
                    </div>
                </div>

                {/* Doughnut Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Tỷ trọng trạng thái xử lý Booking</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Doughnut 
                            data={bookingStatusData} 
                            options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} 
                        />
                    </div>
                </div>
            </div>

            {/* Recent Action Needed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Cần xử lý gấp</h3>
                    <button className="text-sm text-ember-orange font-medium hover:underline">Xem tất cả</button>
                </div>
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex gap-4 items-start">
                                <div className="w-2 h-2 mt-2 rounded-full bg-red-500"></div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Yêu cầu hoàn tiền - Booking #B100{i}</h4>
                                    <p className="text-sm text-gray-500 mt-1">Khách hàng Nguyễn Văn A yêu cầu hủy tour Phú Quốc (báo trước 10 ngày). Phí hủy dự kiến: 30%.</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-ember-orange transition-colors">
                                Xử lý ngay
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StaffDashboard;
