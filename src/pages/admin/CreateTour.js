import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
    ArrowLeft, X, UploadCloud, MapPin, Bus, AlertCircle, 
    Calendar, Plus, Clock, Utensils, Bed, Coffee, Navigation, Camera, Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';

const CreateTour = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [destinations, setDestinations] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [policies, setPolicies] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: '',
        startDate: '',
        endDate: '',
        price: '',
        depositPercent: '30',
        remainingDueDays: '15',
        availableSlots: '',
        destinationId: '',
        cancellationPolicyId: ''
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    
    // Itinerary State
    const [itineraries, setItineraries] = useState([]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/destinations?all=true&size=100', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setDestinations(data.content || data);
                }
            } catch (err) {}
        };

        const fetchHotels = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/hotels?all=true&size=100', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setHotels(data.content || data);
                }
            } catch (err) {}
        };

        const fetchRestaurants = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/restaurants?all=true&size=100', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setRestaurants(data.content || data);
                }
            } catch (err) {}
        };

        const fetchPolicies = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/cancellation-policies?size=100', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPolicies(data.content || data);
                }
            } catch (err) {}
        };

        if (token) {
            fetchDestinations();
            fetchHotels();
            fetchRestaurants();
            fetchPolicies();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]); 
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    // --- ITINERARY LOGIC ---
    const addItineraryItem = (day = 1) => {
        setItineraries(prev => [
            ...prev,
            {
                id: Date.now().toString(), // temporary id for UI key
                dayNumber: day,
                timeOfDay: 'MORNING',
                title: '',
                description: '',
                startTime: '',
                endTime: '',
                location: '',
                activityType: 'VISIT',
                hotelId: '',
                restaurantId: ''
            }
        ]);
    };

    const removeItineraryItem = (id) => {
        setItineraries(prev => prev.filter(item => item.id !== id));
    };

    const handleItineraryChange = (id, field, value) => {
        setItineraries(prev => prev.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const getActivityIcon = (type) => {
        switch(type) {
            case 'TRANSPORT': return <Bus className="w-4 h-4" />;
            case 'MEAL': return <Utensils className="w-4 h-4" />;
            case 'VISIT': return <Camera className="w-4 h-4" />;
            case 'HOTEL': return <Bed className="w-4 h-4" />;
            case 'FREE_TIME': return <Coffee className="w-4 h-4" />;
            default: return <Navigation className="w-4 h-4" />;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.startDate || !formData.endDate || !formData.price || !formData.destinationId) {
            setError("Vui lòng điền các trường bắt buộc.");
            window.scrollTo(0, 0);
            return;
        }

        if (images.length === 0) {
            setError("Vui lòng tải lên ít nhất một hình ảnh.");
            window.scrollTo(0, 0);
            return;
        }

        setError("");
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            
            // Append basic info
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append images
            images.forEach(image => {
                formDataToSend.append('images', image);
            });

            // Append itineraries for Spring @ModelAttribute list
            const itinerariesClean = itineraries.map((item, index) => ({
                dayNumber: parseInt(item.dayNumber) || 1,
                timeOfDay: item.timeOfDay,
                displayOrder: index + 1,
                title: item.title,
                description: item.description,
                startTime: item.startTime || null,
                endTime: item.endTime || null,
                location: item.location,
                activityType: item.activityType,
                hotelId: item.hotelId || null,
                restaurantId: item.restaurantId || null
            }));
            
            itinerariesClean.forEach((itinerary, i) => {
                Object.keys(itinerary).forEach(key => {
                    if (itinerary[key] !== null) {
                        formDataToSend.append(`itineraries[${i}].${key}`, itinerary[key]);
                    }
                });
            });

            const response = await fetch('http://localhost:8080/api/tours/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (response.ok) {
                alert("Tạo Tour thành công!");
                navigate('/admin/tours');
            } else {
                const data = await response.json();
                setError(data.message || "Đã xảy ra lỗi khi tạo Tour");
                window.scrollTo(0, 0);
            }
        } catch (err) {
            setError("Lỗi kết nối đến server (API có thể chưa được tạo).");
            window.scrollTo(0, 0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/admin/tours" className="w-10 h-10 rounded-full bg-white border border-paper flex items-center justify-center text-slate-dark hover:bg-pearl hover:text-ember-orange transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-[28px] font-bold text-graphite leading-tight">Thêm Tour mới</h1>
                        <p className="text-[15px] text-pewter">Tạo lộ trình du lịch mới cho khách hàng</p>
                    </div>
                </div>

                {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* SECTION 1: BASIC INFO */}
                    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-paper">
                        <h2 className="text-xl font-bold text-graphite mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-ember-orange flex items-center justify-center text-sm">1</span>
                            Thông tin cơ bản
                        </h2>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[14px] font-medium text-slate-dark mb-2">Tên Tour <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: Tour Du lịch Đà Nẵng - Hội An 3N2Đ"
                                    className="w-full h-[52px] px-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-medium text-slate-dark mb-2">Mô tả Tour</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Giới thiệu chung về tour..."
                                    className="w-full h-[120px] p-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-[14px] font-medium text-slate-dark mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-pewter" /> Điểm đến (Destination) <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="destinationId"
                                        value={formData.destinationId}
                                        onChange={handleInputChange}
                                        className="w-full h-[52px] px-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all appearance-none"
                                        required
                                    >
                                        <option value="">-- Chọn điểm đến --</option>
                                        {destinations.map(dest => (
                                            <option key={dest.id} value={dest.id}>{dest.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: TIME & PRICE */}
                    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-paper">
                        <h2 className="text-xl font-bold text-graphite mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-ember-orange flex items-center justify-center text-sm">2</span>
                            Thời gian & Giá cả
                        </h2>
                        
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-[14px] font-medium text-slate-dark mb-2">Thời lượng</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="VD: 3 ngày 2 đêm"
                                        className="w-full h-[52px] px-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-medium text-slate-dark mb-2">Số chỗ (Slots) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="availableSlots"
                                        value={formData.availableSlots}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full h-[52px] px-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-medium text-slate-dark mb-2">Tổng Giá (VNĐ) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full h-[52px] px-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all font-bold text-ember-orange"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[14px] font-medium text-slate-dark mb-2">Ngày giờ Khởi hành <span className="text-red-500">*</span></label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="w-full h-[52px] px-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-medium text-slate-dark mb-2">Ngày giờ Kết thúc <span className="text-red-500">*</span></label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="w-full h-[52px] px-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-[14px] font-medium text-slate-dark mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4 text-ember-orange"/> Phần trăm cọc (%) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="depositPercent"
                                        value={formData.depositPercent}
                                        onChange={handleInputChange}
                                        placeholder="30"
                                        min="1" max="100"
                                        className="w-full h-[52px] px-4 rounded-xl border border-paper bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-medium text-slate-dark mb-2">Hạn thanh toán nốt (ngày) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="remainingDueDays"
                                        value={formData.remainingDueDays}
                                        onChange={handleInputChange}
                                        placeholder="15"
                                        min="1"
                                        className="w-full h-[52px] px-4 rounded-xl border border-paper bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-medium text-slate-dark mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4 text-ember-orange"/> Chính sách hủy</label>
                                    <select
                                        name="cancellationPolicyId"
                                        value={formData.cancellationPolicyId}
                                        onChange={handleInputChange}
                                        className="w-full h-[52px] px-4 rounded-xl border border-paper bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all"
                                    >
                                        <option value="">-- Mặc định --</option>
                                        {policies.map(policy => (
                                            <option key={policy.id} value={policy.id}>
                                                {policy.name} {policy.isDefault ? '(Mặc định)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: ITINERARY (Lịch trình) */}
                    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-paper">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-graphite flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-orange-100 text-ember-orange flex items-center justify-center text-sm shadow-sm">3</span>
                                Lịch trình chi tiết (Itinerary)
                            </h2>
                            <button
                                type="button"
                                onClick={() => {
                                    const maxDay = itineraries.length > 0 ? Math.max(...itineraries.map(i => i.dayNumber)) : 0;
                                    addItineraryItem(maxDay + 1);
                                }}
                                className="flex items-center gap-2 text-sm font-bold text-white bg-slate-dark px-5 py-2.5 rounded-full hover:bg-carbon-black transition-all shadow-md"
                            >
                                <Plus className="w-5 h-5" /> Thêm Ngày Mới
                            </button>
                        </div>
                        
                        {itineraries.length === 0 ? (
                            <div className="text-center py-16 border-2 border-dashed border-paper rounded-2xl bg-pearl/20 hover:bg-pearl/40 transition-colors">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                                    <Calendar className="w-10 h-10 text-pewter" />
                                </div>
                                <h3 className="text-graphite font-bold text-lg mb-1">Chưa có lịch trình nào</h3>
                                <p className="text-pewter text-sm mb-6 max-w-md mx-auto">Tạo các ngày và thêm các hoạt động tham quan, ăn uống, di chuyển để khách hàng dễ hình dung chuyến đi.</p>
                                <button 
                                    type="button" 
                                    onClick={() => addItineraryItem(1)} 
                                    className="bg-ember-orange text-white px-6 py-3 rounded-full font-bold shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:-translate-y-1 transition-all"
                                >
                                    Bắt đầu tạo lịch trình
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[35px] before:-translate-x-px before:h-full before:w-1 before:bg-pearl before:rounded-full">
                                {Array.from(new Set(itineraries.map(item => item.dayNumber))).sort((a,b) => a - b).map(day => (
                                    <div key={`day-${day}`} className="relative">
                                        {/* Day Header Badge */}
                                        <div className="relative z-10 flex items-center mb-8">
                                            <div className="bg-ember-orange text-white font-black px-6 py-3 rounded-full shadow-md text-base tracking-wide uppercase ml-2 flex items-center gap-2">
                                                <Calendar className="w-5 h-5" />
                                                Ngày {day}
                                            </div>
                                        </div>

                                        {/* Activities for this day */}
                                        <div className="space-y-8">
                                            {itineraries.filter(i => i.dayNumber === day).sort((a,b) => a.displayOrder - b.displayOrder).map((item, index) => (
                                                <div key={item.id} className="relative flex items-start group pl-[80px]">
                                                    
                                                    {/* Timeline Dot */}
                                                    <div className="absolute left-[13px] top-6 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-pearl text-slate-dark shadow-sm z-10 group-hover:bg-ember-orange group-hover:text-white transition-colors duration-300">
                                                        <div className="w-6 h-6 flex items-center justify-center">
                                                            {getActivityIcon(item.activityType)}
                                                        </div>
                                                    </div>

                                                    {/* Card Content */}
                                                    <div className="w-full bg-white border-2 border-paper rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative group-hover:border-ember-orange/50">
                                                        {/* Delete Button */}
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeItineraryItem(item.id)}
                                                            className="absolute -top-4 -right-4 w-10 h-10 bg-white text-red-500 rounded-full flex items-center justify-center border-2 border-paper shadow-md hover:bg-red-500 hover:text-white transition-all z-20"
                                                            title="Xóa hoạt động này"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>

                                                        {/* Activity Header Settings */}
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-pearl/30 p-4 rounded-xl border border-paper">
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-dark mb-1">Buổi</label>
                                                                <select
                                                                    value={item.timeOfDay}
                                                                    onChange={(e) => handleItineraryChange(item.id, 'timeOfDay', e.target.value)}
                                                                    className="w-full h-11 px-3 bg-white border border-paper rounded-lg outline-none focus:border-ember-orange text-sm font-medium text-slate-dark"
                                                                >
                                                                    <option value="MORNING">Buổi Sáng</option>
                                                                    <option value="NOON">Buổi Trưa</option>
                                                                    <option value="AFTERNOON">Buổi Chiều</option>
                                                                    <option value="EVENING">Buổi Tối</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-dark mb-1">Phân loại</label>
                                                                <select
                                                                    value={item.activityType}
                                                                    onChange={(e) => handleItineraryChange(item.id, 'activityType', e.target.value)}
                                                                    className="w-full h-11 px-3 bg-white border border-paper rounded-lg outline-none focus:border-ember-orange text-sm font-medium text-slate-dark"
                                                                >
                                                                    <option value="VISIT">Tham quan</option>
                                                                    <option value="MEAL">Ăn uống</option>
                                                                    <option value="TRANSPORT">Di chuyển</option>
                                                                    <option value="HOTEL">Khách sạn</option>
                                                                    <option value="FREE_TIME">Tự do</option>
                                                                    <option value="OTHER">Khác</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-dark mb-1">Giờ bắt đầu</label>
                                                                <div className="relative">
                                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pewter" />
                                                                    <input 
                                                                        type="time"
                                                                        value={item.startTime}
                                                                        onChange={(e) => handleItineraryChange(item.id, 'startTime', e.target.value)}
                                                                        className="w-full h-11 pl-10 pr-3 bg-white border border-paper rounded-lg outline-none focus:border-ember-orange text-sm font-medium text-slate-dark"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-dark mb-1">Giờ kết thúc</label>
                                                                <div className="relative">
                                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pewter" />
                                                                    <input 
                                                                        type="time"
                                                                        value={item.endTime}
                                                                        onChange={(e) => handleItineraryChange(item.id, 'endTime', e.target.value)}
                                                                        className="w-full h-11 pl-10 pr-3 bg-white border border-paper rounded-lg outline-none focus:border-ember-orange text-sm font-medium text-slate-dark"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Title & Location */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                            <div>
                                                                <label className="block text-sm font-bold text-slate-dark mb-2">Tiêu đề hoạt động <span className="text-red-500">*</span></label>
                                                                <input 
                                                                    type="text" required
                                                                    value={item.title}
                                                                    onChange={(e) => handleItineraryChange(item.id, 'title', e.target.value)}
                                                                    placeholder="VD: Tham quan Phố cổ Hội An"
                                                                    className="w-full h-[52px] px-4 text-base bg-white border border-paper rounded-xl outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange placeholder:font-normal placeholder:text-pewter transition-all"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-bold text-slate-dark mb-2">Địa điểm</label>
                                                                <div className="relative">
                                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pewter" />
                                                                    <input 
                                                                        type="text"
                                                                        value={item.location}
                                                                        onChange={(e) => handleItineraryChange(item.id, 'location', e.target.value)}
                                                                        placeholder="VD: Hội An, Quảng Nam"
                                                                        className="w-full h-[52px] pl-11 pr-4 text-base bg-white border border-paper rounded-xl outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange placeholder:font-normal placeholder:text-pewter transition-all"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Description */}
                                                        <div className="mb-6">
                                                            <label className="block text-sm font-bold text-slate-dark mb-2">Mô tả chi tiết</label>
                                                            <textarea
                                                                value={item.description}
                                                                onChange={(e) => handleItineraryChange(item.id, 'description', e.target.value)}
                                                                placeholder="Mô tả chi tiết hoạt động này..."
                                                                className="w-full p-4 text-base text-slate-dark bg-white border border-paper rounded-xl outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange transition-all resize-none min-h-[120px]"
                                                            ></textarea>
                                                        </div>

                                                        {/* Hotel & Restaurant Selectors */}
                                                        {item.activityType === 'HOTEL' && (
                                                            <div>
                                                                <label className="block text-sm font-bold text-slate-dark mb-2 flex items-center gap-2">
                                                                    <Bed className="w-4 h-4 text-pewter" /> Khách sạn (Tùy chọn)
                                                                </label>
                                                                <select
                                                                    value={item.hotelId}
                                                                    onChange={(e) => handleItineraryChange(item.id, 'hotelId', e.target.value)}
                                                                    className="w-full h-[52px] px-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all appearance-none"
                                                                >
                                                                    <option value="">-- Chọn khách sạn --</option>
                                                                    {hotels.map(h => (
                                                                        <option key={h.id} value={h.id}>{h.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}

                                                        {item.activityType === 'MEAL' && (
                                                            <div>
                                                                <label className="block text-sm font-bold text-slate-dark mb-2 flex items-center gap-2">
                                                                    <Utensils className="w-4 h-4 text-pewter" /> Nhà hàng (Tùy chọn)
                                                                </label>
                                                                <select
                                                                    value={item.restaurantId}
                                                                    onChange={(e) => handleItineraryChange(item.id, 'restaurantId', e.target.value)}
                                                                    className="w-full h-[52px] px-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all appearance-none"
                                                                >
                                                                    <option value="">-- Chọn nhà hàng --</option>
                                                                    {restaurants.map(r => (
                                                                        <option key={r.id} value={r.id}>{r.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Activity Button for this day */}
                                        <div className="pl-[80px] mt-6 relative z-10">
                                            <button
                                                type="button"
                                                onClick={() => addItineraryItem(day)}
                                                className="flex items-center gap-2 text-sm font-bold text-slate-dark bg-white border-2 border-dashed border-pewter px-6 py-3 rounded-xl hover:border-ember-orange hover:text-ember-orange hover:bg-orange-50 transition-all w-full justify-center"
                                            >
                                                <Plus className="w-5 h-5" /> Thêm hoạt động vào Ngày {day}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SECTION 4: IMAGES */}
                    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-paper">
                        <h2 className="text-xl font-bold text-graphite mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-ember-orange flex items-center justify-center text-sm">4</span>
                            Hình ảnh Tour <span className="text-red-500 ml-1 text-sm">*</span>
                        </h2>

                        <div className="w-full border-2 border-dashed border-paper rounded-2xl p-8 text-center hover:bg-pearl/50 transition-colors relative">
                            <input 
                                type="file" 
                                multiple 
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center pointer-events-none">
                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                    <UploadCloud className="w-8 h-8 text-ember-orange" />
                                </div>
                                <h3 className="text-graphite font-medium text-lg mb-1">Kéo thả hoặc click để tải ảnh lên</h3>
                                <p className="text-pewter text-sm">Hỗ trợ JPG, PNG. Khuyên dùng ảnh chất lượng cao.</p>
                            </div>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-slate-dark mb-3">Đã chọn {imagePreviews.length} hình ảnh:</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imagePreviews.map((url, index) => (
                                        <div key={index} className="relative aspect-video rounded-xl overflow-hidden group border border-paper shadow-sm">
                                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-carbon-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeImage(index)}
                                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            {index === 0 && (
                                                <div className="absolute top-2 left-2 bg-ember-orange text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                                                    Ảnh bìa
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link 
                            to="/admin/tours"
                            className="px-6 py-3 rounded-full font-medium text-slate-dark hover:bg-pearl transition-colors"
                        >
                            Hủy bỏ
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-full font-bold text-white bg-ember-orange hover:bg-orange-600 transition-all shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Đang tạo...
                                </>
                            ) : (
                                "Tạo Tour Mới"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateTour;
