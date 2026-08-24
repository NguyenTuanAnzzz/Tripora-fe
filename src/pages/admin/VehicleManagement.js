import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Plus, Edit, XCircle, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';

const VehicleManagement = () => {
    const { token } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/vehicles?page=${page}&size=${size}&search=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setVehicles(data.content || data);
                setTotalPages(data.totalPages || 1);
            } else {
                setError("Không thể tải danh sách phương tiện");
            }
        } catch (err) {
            setError("Lỗi kết nối đến server (API có thể chưa được tạo).");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchVehicles();
        }
    }, [token, page, searchQuery]);

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        if (!window.confirm(`Bạn có chắc muốn ${newStatus === 'ACTIVE' ? 'bật' : 'tắt'} phương tiện này?`)) return;

        try {
            const res = await fetch(`http://localhost:8080/api/vehicles/${id}/status?status=${newStatus}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (res.ok) {
                fetchVehicles();
            } else {
                alert("Lỗi khi cập nhật trạng thái");
            }
        } catch (err) {
            alert("Lỗi kết nối đến server");
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            {/* Page Header (Rich Banner) */}
            <div className="bg-carbon-black rounded-[20px] p-[32px] md:p-[40px] mb-8 relative overflow-hidden shadow-md">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=1200&q=80')" }}
                ></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-[32px] font-bold text-canvas-white mb-2 leading-tight">Quản lý Phương tiện</h1>
                        <p className="text-[16px] text-canvas-white/80 font-regular max-w-lg">
                            Kiểm soát và cập nhật danh sách các phương tiện di chuyển trong hệ thống.
                        </p>
                    </div>

                    <Link 
                        to="/admin/vehicles/create"
                        className="flex items-center gap-2 bg-ember-orange text-canvas-white px-[24px] py-[14px] rounded-full font-medium hover:bg-orange-600 transition-all shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0" />
                        <span>Thêm Phương tiện</span>
                    </Link>
                </div>
            </div>

            {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

            <div className="bg-white rounded-[24px] shadow-sm border border-paper overflow-hidden">
                <div className="p-6 border-b border-paper flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-[350px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pewter w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm phương tiện..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(0);
                            }}
                            className="w-full pl-11 pr-4 py-3 bg-pearl/30 border border-paper rounded-full outline-none focus:border-ember-orange focus:bg-white transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-pearl/50 text-pewter text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-bold border-b border-paper w-16">ID</th>
                                <th className="px-6 py-4 font-bold border-b border-paper">Tên phương tiện</th>
                                <th className="px-6 py-4 font-bold border-b border-paper">Mô tả</th>
                                <th className="px-6 py-4 font-bold border-b border-paper">Ngày tạo/Cập nhật</th>
                                <th className="px-6 py-4 font-bold border-b border-paper text-center">Trạng thái</th>
                                <th className="px-6 py-4 font-bold border-b border-paper text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10">
                                        <div className="flex justify-center items-center gap-2 text-pewter">
                                            <svg className="animate-spin h-5 w-5 text-ember-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Đang tải dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12">
                                        <div className="w-16 h-16 bg-pearl rounded-full flex items-center justify-center mx-auto mb-3">
                                            <AlertCircle className="w-8 h-8 text-pewter" />
                                        </div>
                                        <p className="text-graphite font-medium">Không tìm thấy phương tiện nào</p>
                                        <p className="text-pewter text-sm mt-1">Vui lòng thử tìm kiếm khác hoặc thêm mới.</p>
                                    </td>
                                </tr>
                            ) : (
                                vehicles.map(vehicle => (
                                    <tr key={vehicle.id} className="border-b border-paper hover:bg-pearl/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-graphite">#{vehicle.id}</td>
                                        <td className="px-6 py-4 font-bold text-slate-dark">{vehicle.name}</td>
                                        <td className="px-6 py-4 text-pewter max-w-xs truncate">{vehicle.description || 'Không có mô tả'}</td>
                                        <td className="px-6 py-4 text-pewter text-xs">
                                            {vehicle.updatedAt ? (
                                                <span>Cập nhật: {new Date(vehicle.updatedAt).toLocaleDateString('vi-VN')}</span>
                                            ) : vehicle.createdAt ? (
                                                <span>Tạo: {new Date(vehicle.createdAt).toLocaleDateString('vi-VN')}</span>
                                            ) : (
                                                <span>N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                String(vehicle.status || '').toUpperCase() === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {String(vehicle.status || '').toUpperCase() === 'ACTIVE' ? 'ĐANG HOẠT ĐỘNG' : 'TẠM DỪNG'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link 
                                                    to={`/admin/vehicles/${vehicle.id}`}
                                                    className="w-10 h-10 rounded-full bg-pearl flex items-center justify-center text-slate-dark hover:bg-white hover:text-blue-500 hover:shadow-sm transition-all"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:shadow-sm transition-all ${
                                                        String(vehicle.status || '').toUpperCase() === 'ACTIVE' 
                                                            ? 'bg-pearl text-slate-dark hover:bg-white hover:text-red-500' 
                                                            : 'bg-pearl text-slate-dark hover:bg-white hover:text-green-500'
                                                    }`}
                                                    title={String(vehicle.status || '').toUpperCase() === 'ACTIVE' ? "Khóa hoạt động" : "Bật hoạt động"}
                                                >
                                                    {String(vehicle.status || '').toUpperCase() === 'ACTIVE' ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="p-6 border-t border-paper flex justify-center">
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                        page === i 
                                            ? 'bg-ember-orange text-white shadow-md' 
                                            : 'bg-white border border-paper text-slate-dark hover:border-ember-orange hover:text-ember-orange'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default VehicleManagement;
