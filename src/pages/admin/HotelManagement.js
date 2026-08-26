import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Plus, Edit2, Power, MapPin, Star, Globe, Mail, Phone } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';

const HotelManagement = () => {
    const navigate = useNavigate();
    const {token} = useAuth();
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();


    const page = parseInt(searchParams.get('page')) || 0;
    const searchKeyword = searchParams.get('keyword') || "";
    const [size, setSize] = useState(9);
    const [totalPages, setTotalPages] = useState(0);

    const getAllHotels = async() =>{
        try{
            setLoading(true);
            const params = new URLSearchParams();
            params.set("page", page);
            params.set("size", size);
            if (searchKeyword) {
                params.set("keyword", searchKeyword);
            }
            const url = `http://localhost:8080/api/hotels?${params.toString()}&all=true`;

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
                    setHotels(data.content);
                    setTotalPages(data.totalPages);
                } else {
               
                    setHotels(data);
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
    }
    useEffect(() => {
            if (token) {
                getAllHotels();
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
        
        if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} khách sạn này?`)) return;
        
        try {
            const response = await fetch(`http://localhost:8080/api/hotels/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (response.ok) {
                alert(`Đã ${actionText} điểm đến`);
                getAllHotels(); 
            } else {
                alert("Lỗi khi cập nhật trạng thái");
            }
        } catch (err) {
            alert("Lỗi kết nối server");
        }
    };
    

    return (
        <DashboardLayout role="ADMIN">
            {/* Header Banner */}
            <div className="bg-carbon-black rounded-[20px] p-[32px] md:p-[40px] mb-8 relative overflow-hidden shadow-md">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80')" }}
                ></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-[32px] font-bold text-canvas-white mb-2 leading-tight">Quản lý Khách sạn</h1>
                        <p className="text-[16px] text-canvas-white/80 font-regular max-w-lg">
                            Thêm mới, theo dõi trạng thái và quản lý thông tin các khách sạn trên hệ thống.
                        </p>
                    </div>

                    <Link 
                        to="/admin/hotels/create"
                        className="flex items-center gap-2 bg-ember-orange text-canvas-white px-[24px] py-[14px] rounded-full font-medium hover:bg-orange-600 transition-all shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0" />
                        <span>Thêm Khách sạn mới</span>
                    </Link>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper p-5 mb-6 flex flex-col lg:flex-row gap-5 justify-between items-center transition-all hover:shadow-md">
                <div className="w-full lg:w-[450px] relative">
                    <SearchBar  
                        compact={true}
                        className="w-full"
                        placeholder="Tìm theo tên điểm đến..."
                        initialValue={searchKeyword}
                        onSearch={handleSearch}
                    />
                </div>
                
                <div className="flex gap-4">
                    <select className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ember-orange bg-white text-gray-700">
                        <option>Tất cả địa điểm</option>
                        <option>Hà Nội</option>
                        <option>Đà Nẵng</option>
                    </select>
                </div>
            </div>

            {/* Grid Card View */}
            <div className="mb-[40px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hotels.map((item) => (
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
                                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md shrink-0">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        {item.starRating}
                                    </div>
                                </div>
                                
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {item.description}
                                </p>
                                
                                <div className="mt-auto space-y-2 pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-sm font-medium text-carbon-black">
                                        <MapPin className="w-4 h-4 mr-2 text-pewter" />
                                        <span className="truncate">{item.address}</span>
                                    </div>
                                    <div className="flex items-center text-sm font-medium text-carbon-black">
                                        <Phone className="w-4 h-4 mr-2 text-pewter" />
                                        <span>{item.phone}</span>
                                    </div>
                                    <div className="flex items-center text-sm font-medium text-carbon-black">
                                        <Mail className="w-4 h-4 mr-2 text-pewter" />
                                        <span className="truncate">{item.email}</span>
                                    </div>
                                    {item.website && (
                                        <div className="flex items-center text-sm font-medium text-carbon-black">
                                            <Globe className="w-4 h-4 mr-2 text-pewter" />
                                            <a href={item.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">{item.website}</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HotelManagement;
