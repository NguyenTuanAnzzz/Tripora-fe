import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';

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

            // Pass all=true so the Admin can see both ACTIVE and INACTIVE destinations
            const url = `http://localhost:8080/api/destinations?${params.toString()}&all=true`;

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
        if (!window.confirm("Bạn có chắc chắn muốn ngừng hoạt động điểm đến này?")) return;
        
        try {
            const response = await fetch(`http://localhost:8080/api/destinations/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                alert("Đã ngừng hoạt động điểm đến");
                getAllDestinations(); // reload
            } else {
                alert("Lỗi khi cập nhật trạng thái");
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

                    <Link 
                        to="/admin/destinations/create"
                        className="flex items-center gap-2 bg-ember-orange text-canvas-white px-[24px] py-[14px] rounded-full font-medium hover:bg-orange-600 transition-all shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0" />
                        <span>Thêm điểm đến mới</span>
                    </Link>
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

            {/* Grid Card View */}
            <div className="mb-[40px]">
                {loading ? (
                    <div className="text-center py-12 text-pewter bg-canvas-white rounded-[20px] shadow-sm border border-paper">Đang tải...</div>
                ) : destinations.length === 0 ? (
                    <div className="text-center py-12 text-pewter bg-canvas-white rounded-[20px] shadow-sm border border-paper">
                        Không có dữ liệu điểm đến.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((item) => (
                            <div key={item.id} className={`bg-canvas-white rounded-[24px] shadow-sm border border-paper overflow-hidden transition-all duration-300 group flex flex-col ${item.status === 'INACTIVE' ? 'opacity-75 grayscale-[20%]' : 'hover:shadow-xl hover:shadow-carbon-black/5'}`}>
                                {/* Image Section - Large 16:9 Aspect Ratio */}
                                <div className="relative aspect-video w-full bg-gray-100 flex-shrink-0 overflow-hidden">
                                    {item.status === 'INACTIVE' && (
                                        <div className="absolute top-3 left-3 z-30 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                                            Ngừng hoạt động
                                        </div>
                                    )}
                                    {/* Edit and Delete Actions - Hidden until hover */}
                                    <div className="absolute top-3 right-3 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); alert('Sửa: ' + item.name); }}
                                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/50 backdrop-blur-sm" title="Chỉnh sửa"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        {item.status !== 'INACTIVE' && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-red-500/50 backdrop-blur-sm" title="Ngừng hoạt động"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
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
                                                            <div className="absolute inset-0 bg-gradient-to-t from-carbon-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-canvas-white opacity-0 group-hover:opacity-100 transition-all duration-300 bg-carbon-black/50 p-4 rounded-full backdrop-blur-md transform scale-75 group-hover:scale-100 shadow-2xl">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                                                                </span>
                                                            </div>
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
                                    <h3 className="text-[22px] font-extrabold text-graphite mb-3 line-clamp-1 group-hover:text-ember-orange transition-colors">{item.name}</h3>
                                    <p className="text-[15px] text-pewter line-clamp-3 mb-6 flex-grow leading-relaxed">
                                        {item.description || 'Chưa có mô tả cho điểm đến này.'}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-5 border-t border-paper/60 mt-auto">
                                        <div className="text-[13px] text-pewter font-medium flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("vi-VN") : "N/A"}
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

export default DestinationManagement;
