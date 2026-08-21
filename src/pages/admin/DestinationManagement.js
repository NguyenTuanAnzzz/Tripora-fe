import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';

const DestinationManagement = () => {
    const { token } = useAuth();
    const [destinations, setDestinations] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page')) || 0;
    const searchKeyword = searchParams.get('keyword') || "";
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const getAllDestinations = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", page);
            params.set("size", size);

            if (searchKeyword) {
                params.set("keyword", searchKeyword);
            }

            // Note: Update URL based on your actual backend API
            const url = `http://localhost:8080/api/destinations?${params.toString()}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Assuming backend returns a paginated structure { content: [...], totalPages: N }
                if (data.content !== undefined) {
                    setDestinations(data.content);
                    setTotalPages(data.totalPages);
                } else {
                    // Fallback if backend returns list directly
                    setDestinations(data);
                    setTotalPages(1);
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Lỗi tải dữ liệu");
            }
        } catch (error) {
            setError("Không thể kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            getAllDestinations();
        }
    }, [page, size, searchKeyword, token]);

    const handleSearch = (keyword) => {
        if (keyword.trim()) {
            setSearchParams({ page: 0, keyword: keyword.trim() }); 
        } else {
            setSearchParams({ page: 0 });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa điểm đến này?")) return;
        
        try {
            const response = await fetch(`http://localhost:8080/api/destinations/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                getAllDestinations(); // reload
            } else {
                alert("Lỗi khi xóa điểm đến");
            }
        } catch (err) {
            alert("Lỗi kết nối server");
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            {/* Page Header */}
            <div className="bg-carbon-black rounded-[20px] p-[32px] md:p-[40px] mb-8 relative overflow-hidden shadow-md">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80')" }}
                ></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-[32px] font-bold text-canvas-white mb-2 leading-tight">Quản lý Điểm đến</h1>
                        <p className="text-[16px] text-canvas-white/80 font-regular max-w-lg">
                            Thêm, sửa, xóa thông tin các địa điểm du lịch.
                        </p>
                    </div>

                    <button 
                        onClick={() => alert("Chức năng thêm mới đang được phát triển hoặc bạn có thể tạo trang riêng")}
                        className="flex items-center gap-2 bg-ember-orange text-canvas-white px-[24px] py-[14px] rounded-full font-medium hover:bg-orange-600 transition-all shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0" />
                        <span>Thêm điểm đến mới</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper p-5 mb-6 flex flex-col lg:flex-row gap-5 justify-between items-center transition-all hover:shadow-md">
                <div className="w-full lg:w-[450px]">
                    <SearchBar
                        compact={true}
                        className="w-full"
                        placeholder="Tìm theo tên điểm đến..."
                        initialValue={searchKeyword}
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

            {/* Table Card */}
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper overflow-hidden mb-[40px]">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-paper">
                        <thead className="bg-pearl/50">
                            <tr>
                                <th scope="col" className="px-6 py-5 text-left text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    Điểm đến
                                </th>
                                <th scope="col" className="px-6 py-5 text-left text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    Mô tả
                                </th>
                                <th scope="col" className="px-6 py-5 text-center text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    Cập nhật lần cuối
                                </th>
                                <th scope="col" className="px-6 py-5 text-center text-[12px] font-bold text-pewter uppercase tracking-wider w-[160px]">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-canvas-white divide-y divide-paper">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-pewter">Đang tải...</td>
                                </tr>
                            ) : destinations.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-pewter">Không có dữ liệu điểm đến.</td>
                                </tr>
                            ) : (
                                destinations.map((item) => (
                                    <tr key={item.id} className="hover:bg-pearl/40 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap align-middle">
                                            <div className="flex items-center gap-4">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="h-12 w-16 object-cover rounded-md shadow-sm border border-paper" />
                                                ) : (
                                                    <div className="h-12 w-16 bg-gray-100 rounded-md flex items-center justify-center border border-paper">
                                                        <MapPin className="text-gray-400 w-6 h-6" />
                                                    </div>
                                                )}
                                                <div className="text-[14px] font-bold text-graphite">{item.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="text-[13px] text-pewter line-clamp-2 max-w-md">
                                                {item.description || 'Chưa có mô tả'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap align-middle text-center text-[13px] font-medium text-pewter">
                                            {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("vi-VN") : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap align-middle text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button 
                                                    onClick={() => alert('Sửa: ' + item.name)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Chỉnh sửa"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="bg-canvas-white px-8 py-5 border-t border-paper flex items-center justify-between">
                        <div className="[&>div]:!mt-0">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={(newPage) => {
                                    setSearchParams(prev => {
                                        prev.set("page", newPage.toString());
                                        return prev;
                                    });
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DestinationManagement;
