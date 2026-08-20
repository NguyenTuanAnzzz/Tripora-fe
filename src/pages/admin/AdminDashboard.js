import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { DollarSign, CreditCard, Clock, XCircle, TrendingUp } from 'lucide-react';
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
import { Line, Doughnut, Bar } from 'react-chartjs-2';

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

const AdminDashboard = () => {
    // Mock data based on setting.md requirements
    const stats = {
        totalRevenue: 1250000000,
        revenueByStatus: {
            deposit: 350000000,
            fullyPaid: 850000000,
            refunded: 50000000
        },
        pendingRevenue: 450000000, // AWAITING_REMAINING
        cancelRates: {
            holdExpired: 15, // %
            underpaid: 5,    // %
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Chart Data Configs
    const revenueTrendData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
        datasets: [
            {
                label: 'Doanh thu',
                data: [450, 520, 480, 710, 890, 1250],
                borderColor: 'rgb(249, 115, 22)', // ember-orange
                backgroundColor: 'rgba(249, 115, 22, 0.5)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const revenueStatusData = {
        labels: ['Đã trả đủ (FULLY_PAID)', 'Mới cọc (DEPOSIT_PAID)', 'Đã hoàn (REFUNDED)'],
        datasets: [
            {
                data: [stats.revenueByStatus.fullyPaid, stats.revenueByStatus.deposit, stats.revenueByStatus.refunded],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)', // green-500
                    'rgba(59, 130, 246, 0.8)', // blue-500
                    'rgba(239, 68, 68, 0.8)', // red-500
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <DashboardLayout role="ADMIN">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Tổng doanh thu thực tế</h3>
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> +12.5% so với tháng trước
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Tiền đang "treo" (Chờ trả nốt)</h3>
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingRevenue)}</p>
                    <p className="text-sm text-gray-500 mt-2">Booking trạng thái AWAITING_REMAINING</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Tỷ lệ hủy do hết hạn Hold</h3>
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.cancelRates.holdExpired}%</p>
                    <p className="text-sm text-gray-500 mt-2">Chưa cọc kịp thời gian</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Tỷ lệ hủy do quá hạn trả nốt</h3>
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.cancelRates.underpaid}%</p>
                    <p className="text-sm text-gray-500 mt-2">Chưa trả nốt phần còn lại</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Line Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Biểu đồ doanh thu 6 tháng qua (Triệu VNĐ)</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Line 
                            data={revenueTrendData} 
                            options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
                        />
                    </div>
                </div>

                {/* Doughnut Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Cơ cấu doanh thu theo trạng thái</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Doughnut 
                            data={revenueStatusData} 
                            options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} 
                        />
                    </div>
                </div>
            </div>

            {/* Popular Tours */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Top Tours Thịnh Hành</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                            <div className="h-32 bg-gray-200 relative">
                                <img src={`https://placehold.co/300x150?text=Tour+${i}`} alt="Tour" className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-white/90 text-ember-orange font-bold text-xs px-2 py-1 rounded">
                                    Top {i}
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="text-sm font-bold text-gray-900">Đà Nẵng - Hội An 4N3Đ</h4>
                                <p className="text-xs text-gray-500 mt-1">120 Bookings tháng này</p>
                                <p className="text-sm font-medium text-ember-orange mt-2">Doanh thu: {formatCurrency(450000000)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
