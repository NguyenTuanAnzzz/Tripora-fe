import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HomeLayout from '../layouts/HomeLayout';
import { MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 0;
    const searchKeyword = searchParams.get('keyword') || "";
    const [size, setSize] = useState(9);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState("");
    
    const { token } = useAuth(); 

    const getDestinations = async () => {
        try {
            const url = `http://localhost:8080/api/destinations?page=${page}&size=${size}${searchKeyword ? `&keyword=${encodeURIComponent(searchKeyword)}` : ""}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
 
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDestinations(data.content);
                setTotalPages(data.totalPages); // Lấy tổng số trang từ backend trả về
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Lỗi tải dữ liệu");
            }
        } catch (error) {
            setError("Không thể kết nối đến server");
        }
    };

    useEffect(() => {
        getDestinations();
    }, [page, size, searchKeyword]);

    const handleSearch = (keyword) => {
        if (keyword.trim()) {
            setSearchParams({ page: 0, keyword: keyword.trim() }); 
        } else {
            setSearchParams({ page: 0 }); // Xóa keyword khỏi URL nếu search rỗng
        }
    };

    return (
        <HomeLayout>
            {/* Hero Section có kèm Thanh Tìm Kiếm */}
            <div className="w-full bg-pearl py-[60px]">
                <div className="max-w-[1200px] mx-auto px-6 text-center">
                    <h1 className="text-heading font-light text-graphite mb-4">Khám phá các điểm đến tuyệt vời</h1>
                    <p className="text-subheading font-regular text-slate-dark max-w-2xl mx-auto mb-10">
                        Từ những bãi biển cát trắng nắng vàng đến những vùng núi cao hùng vĩ, hãy chọn điểm dừng chân tiếp theo cho hành trình của bạn.
                    </p>
                    
                    {/* Render Component SearchBar */}
                    <SearchBar 
                        placeholder="Tìm tên điểm đến, thành phố..." 
                        onSearch={handleSearch} 
                        initialValue={searchKeyword}
                    />
                </div>
            </div>

            {/* Destinations Grid */}
            <div className="max-w-[1200px] mx-auto px-6 py-[60px] min-h-[500px]">
                {error && <div className="text-center text-red-500 mb-6">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest) => (
                        <div key={dest.id} className="bg-canvas-white border border-paper rounded-cards overflow-hidden flex flex-col group cursor-pointer transition-shadow hover:shadow-lg hover:border-ember-orange/30">
                            <div className="h-[240px] relative overflow-hidden">
                                <img 
                                    src={dest.image} 
                                    alt={dest.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <div className="absolute top-4 left-4 bg-canvas-white/90 backdrop-blur-sm text-graphite text-caption font-medium px-3 py-1 rounded-badges flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-ember-orange" />
                                    Việt Nam
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-heading-sm font-medium text-graphite mb-2">{dest.name}</h3>
                                <p className="text-body font-regular text-pewter line-clamp-3 mb-4 flex-1">
                                    {dest.description}
                                </p>
                                <button className="text-ember-orange font-medium text-body hover:underline flex items-center gap-2 mt-auto">
                                    Xem các tour
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Render Component Pagination */}
                <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={(newPage) => {
                        setSearchParams(prev => {
                            prev.set('page', newPage);
                            return prev;
                        });
                    }} 
                />
            </div>
        </HomeLayout>
    );
};

export default Destinations;
