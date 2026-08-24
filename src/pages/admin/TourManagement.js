import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Plus, Edit2, Power, Calendar, DollarSign, Users, MapPin } from 'lucide-react';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';

const TourManagement = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page')) || 0;
    const searchKeyword = searchParams.get('keyword') || "";
    const [size, setSize] = useState(9);
    const [totalPages, setTotalPages] = useState(0);

    const getAllTours = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", page);
            params.set("size", size);

            if (searchKeyword) {
                params.set("keyword", searchKeyword);
            }
            params.set("all", "true");

            const url = `http://localhost:8080/api/tours?${params.toString()}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.content !== undefined) {
                    setTours(data.content);
                    setTotalPages(data.totalPages);
                } else {
                    setTours(data);
                    setTotalPages(1);
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Lỗi tải dữ liệu");
            }
        } catch (error) {
            setError("Không thể kết nối đến server (API có thể chưa được tạo)");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            getAllTours();
        }
    }, [page, size, searchKeyword, token]);

    const handleSearch = (keyword) => {
        if (keyword.trim()) {
            setSearchParams({ page: 0, keyword: keyword.trim() }); 
        } else {
            setSearchParams({ page: 0 });
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
        const actionText = newStatus === 'ACTIVE' ? 'kích hoạt lại' : 'ngừng hoạt động';
        
        if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tour này?`)) return;
        
        try {
            const response = await fetch(`http://localhost:8080/api/tours/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (response.ok) {
                alert(`Đã ${actionText} tour`);
                getAllTours(); // reload
            } else {
                alert("Lỗi khi cập nhật trạng thái");
            }
        } catch (err) {
            alert("Lỗi kết nối server");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <DashboardLayout role="ADMIN">
            {/* Page Header */}
            <div className="bg-carbon-black rounded-[20px] p-[32px] md:p-[40px] mb-8 relative overflow-hidden shadow-md">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80')" }}
                ></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-[32px] font-bold text-canvas-white mb-2 leading-tight">Quản lý Tour</h1>
                        <p className="text-[16px] text-canvas-white/80 font-regular max-w-lg">
                            Thêm, sửa, xóa và quản lý lịch trình các tour du lịch.
                        </p>
                    </div>

                    <Link 
                        to="/admin/tours/create"
                        className="flex items-center gap-2 bg-ember-orange text-canvas-white px-[24px] py-[14px] rounded-full font-medium hover:bg-orange-600 transition-all shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0" />
                        <span>Thêm tour mới</span>
                    </Link>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper p-5 mb-6 flex flex-col lg:flex-row gap-5 justify-between items-center transition-all hover:shadow-md">
                <div className="w-full lg:w-[450px]">
                    <SearchBar
                        compact={true}
                        className="w-full"
                        placeholder="Tìm theo tên tour..."
                        initialValue={searchKeyword}
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

            {/* Grid Card View */}
            <div className="mb-[40px]">
                {loading ? (
                    <div className="text-center py-12 text-pewter bg-canvas-white rounded-[20px] shadow-sm border border-paper">Đang tải...</div>
                ) : tours.length === 0 ? (
                    <div className="text-center py-12 text-pewter bg-canvas-white rounded-[20px] shadow-sm border border-paper">
                        Chưa có tour nào trong hệ thống.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.map((item) => (
                            <div key={item.id} className={`bg-canvas-white rounded-[24px] shadow-sm border border-paper overflow-hidden transition-all duration-300 group flex flex-col ${item.status === 'INACTIVE' ? 'opacity-75 grayscale-[20%]' : 'hover:shadow-xl hover:shadow-carbon-black/5'}`}>
                                {/* Image Section */}
                                <div className="relative aspect-video w-full bg-gray-100 flex-shrink-0 overflow-hidden">
                                    {item.status === 'INACTIVE' && (
                                        <div className="absolute top-3 left-3 z-30 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                                            Ngừng hoạt động
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/tours/${item.id}`); }}
                                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/50 backdrop-blur-sm" title="Chỉnh sửa"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(item.id, item.status); }}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/90 transition-all duration-300 shadow-lg backdrop-blur-sm ${item.status === 'INACTIVE' ? 'text-green-600 hover:bg-green-600 hover:text-white hover:shadow-green-500/50' : 'text-red-600 hover:bg-red-600 hover:text-white hover:shadow-red-500/50'}`}
                                            title={item.status === 'INACTIVE' ? "Kích hoạt lại" : "Ngừng hoạt động"}
                                        >
                                            <Power className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {item.imageUrls && item.imageUrls.length > 0 ? (
                                        <Gallery>
                                            {item.imageUrls.map((url, index) => (
                                                <Item key={index} original={url} thumbnail={url} width="1200" height="800">
                                                    {({ ref, open }) => (
                                                        <div 
                                                            className={`absolute inset-0 cursor-zoom-in ${index === 0 ? 'block' : 'hidden'}`}
                                                            ref={ref} 
                                                            onClick={open}
                                                        >
                                                            <img src={url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                            {item.imageUrls.length > 1 && (
                                                                <div className="absolute bottom-3 right-3 bg-carbon-black/80 text-canvas-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md">
                                                                    +{item.imageUrls.length - 1} ảnh
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Item>
                                            ))}
                                        </Gallery>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <MapPin className="text-gray-400 w-16 h-16" />
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-[20px] font-extrabold text-graphite mb-2 line-clamp-1 group-hover:text-ember-orange transition-colors">{item.name}</h3>
                                    
                                    <div className="flex items-center text-ember-orange font-bold text-lg mb-3">
                                        <DollarSign className="w-5 h-5 mr-1" />
                                        {formatCurrency(item.price)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
                                        <div className="flex items-center text-sm text-pewter">
                                            <Calendar className="w-4 h-4 mr-2 text-slate-dark" />
                                            <span className="truncate">{item.duration}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-pewter">
                                            <Users className="w-4 h-4 mr-2 text-slate-dark" />
                                            <span>Còn {item.availableSlots} chỗ</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-paper/60 mt-auto">
                                        <div className="text-[13px] text-pewter font-medium flex items-center gap-1.5">
                                            <span className="bg-pearl text-slate-dark px-2 py-1 rounded-md">Cọc: {item.depositPercent}%</span>
                                        </div>
                                        <div className="text-[12px] text-pewter font-medium">
                                            Khởi hành: {new Date(item.startDate).toLocaleDateString("vi-VN")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {totalPages > 1 && (
                    <div className="bg-canvas-white px-8 py-5 border border-paper rounded-[24px] shadow-sm mt-8 flex items-center justify-center">
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
                )}
            </div>
        </DashboardLayout>
    );
};

export default TourManagement;
