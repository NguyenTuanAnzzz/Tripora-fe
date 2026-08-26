import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Plus, Edit2, Power, MapPin, Utensils, Phone, Mail, DollarSign } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';

const RestaurantManagement = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page')) || 0;
    const searchKeyword = searchParams.get('keyword') || "";
    const [size, setSize] = useState(9);
    const [totalPages, setTotalPages] = useState(0);

    const getAllRestaurants = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", page);
            params.set("size", size);

            if (searchKeyword) {
                params.set("keyword", searchKeyword);
            }

            // Optional: if the backend supports "all=true" like destinations, pass it. Otherwise, it will just be ignored.
            const url = `http://localhost:8080/api/restaurants?${params.toString()}`;

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
                    setRestaurants(data.content);
                    setTotalPages(data.totalPages);
                } else {
                    setRestaurants(data);
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
            getAllRestaurants();
        }
    }, [page, size, searchKeyword, token]);

    const handleSearch = (keyword) => {
        if (keyword.trim()) {
            setSearchParams({ page: 0, keyword: keyword.trim() }); 
        } else {
            setSearchParams({ page: 0 });
        }
    };

    const handleToggleStatus = (id, currentStatus) => {
        alert("Chức năng cập nhật trạng thái nhà hàng chưa được hỗ trợ.");
    };

    return (
        <DashboardLayout role="ADMIN">
            {/* Header Banner */}
            <div className="bg-carbon-black rounded-[20px] p-[32px] md:p-[40px] mb-8 relative overflow-hidden shadow-md">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80')" }}
                ></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-[32px] font-bold text-canvas-white mb-2 leading-tight">Quản lý Nhà hàng</h1>
                        <p className="text-[16px] text-canvas-white/80 font-regular max-w-lg">
                            Quản lý danh sách nhà hàng, loại hình ẩm thực và mức giá trong hệ thống.
                        </p>
                    </div>

                    <Link 
                        to="/admin/restaurants/create"
                        className="flex items-center gap-2 bg-ember-orange text-canvas-white px-[24px] py-[14px] rounded-full font-medium hover:bg-orange-600 transition-all shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0" />
                        <span>Thêm Nhà hàng mới</span>
                    </Link>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper p-5 mb-6 flex flex-col lg:flex-row gap-5 justify-between items-center transition-all hover:shadow-md">
                <div className="w-full lg:w-[450px]">
                    <SearchBar
                        compact={true}
                        className="w-full"
                        placeholder="Tìm kiếm theo tên nhà hàng..."
                        initialValue={searchKeyword}
                        onSearch={handleSearch}
                    />
                </div>
                
                <div className="flex gap-4">
                    <select className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ember-orange bg-white text-gray-700">
                        <option>Tất cả loại hình</option>
                        <option>Buffet</option>
                        <option>A La Carte</option>
                    </select>
                </div>
            </div>

            {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

            {/* Grid Card View */}
            <div className="mb-[40px]">
                {loading ? (
                    <div className="text-center py-12 text-pewter bg-canvas-white rounded-[20px] shadow-sm border border-paper">Đang tải...</div>
                ) : restaurants.length === 0 ? (
                    <div className="text-center py-12 text-pewter bg-canvas-white rounded-[20px] shadow-sm border border-paper">
                        Không có dữ liệu nhà hàng.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {restaurants.map((item) => (
                            <div key={item.id} className={`bg-canvas-white rounded-[24px] shadow-sm border border-paper overflow-hidden transition-all duration-300 group flex flex-col ${item.status === 'INACTIVE' ? 'opacity-75 grayscale-[20%]' : 'hover:shadow-xl hover:shadow-carbon-black/5'}`}>
                                {/* Image Section - Large 16:9 Aspect Ratio */}
                                <div className="relative aspect-video w-full bg-gray-100 flex-shrink-0 overflow-hidden">
                                    {item.status === 'INACTIVE' && (
                                        <div className="absolute top-3 left-3 z-30 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                                            Đóng cửa
                                        </div>
                                    )}
                                    {/* Edit and Delete Actions - Hidden until hover */}
                                    <div className="absolute top-3 right-3 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                                        <button 
                                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/50 backdrop-blur-sm" title="Chỉnh sửa"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleToggleStatus(item.id, item.status)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/90 transition-all duration-300 shadow-lg backdrop-blur-sm ${item.status === 'INACTIVE' ? 'text-green-600 hover:bg-green-600 hover:text-white hover:shadow-green-500/50' : 'text-red-600 hover:bg-red-600 hover:text-white hover:shadow-red-500/50'}`}
                                            title={item.status === 'INACTIVE' ? "Mở cửa lại" : "Đóng cửa"}
                                        >
                                            <Power className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <h3 className="text-[20px] font-bold text-carbon-black line-clamp-1 group-hover:text-ember-orange transition-colors">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md shrink-0">
                                            <Utensils className="w-3.5 h-3.5" />
                                            {item.cuisineType}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                        {item.description}
                                    </p>
                                    
                                    <div className="mt-auto pt-4 space-y-2 border-t border-gray-100">
                                        <div className="flex items-center text-sm font-medium text-carbon-black">
                                            <MapPin className="w-4 h-4 mr-2 text-pewter" />
                                            <span className="truncate">{item.address}</span>
                                        </div>
                                        {item.phone && (
                                            <div className="flex items-center text-sm font-medium text-carbon-black">
                                                <Phone className="w-4 h-4 mr-2 text-pewter" />
                                                <span>{item.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-sm font-medium text-carbon-black">
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-pewter" />
                                                <span className="truncate max-w-[120px]">{item.email || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center text-ember-orange font-bold">
                                                <DollarSign className="w-4 h-4" />
                                                <span>{item.priceRange}</span>
                                            </div>
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

export default RestaurantManagement;
