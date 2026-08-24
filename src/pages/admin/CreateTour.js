import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ArrowLeft, X, UploadCloud, MapPin, Bus, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';

const CreateTour = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Dependencies
    const [destinations, setDestinations] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    
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
        vehicleId: ''
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

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

        const fetchVehicles = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/vehicles?size=100', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setVehicles(data.content || data);
                }
            } catch (err) {}
        };

        if (token) {
            fetchDestinations();
            fetchVehicles();
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
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            images.forEach(image => {
                formDataToSend.append('images', image);
            });

            const response = await fetch('http://localhost:8080/api/tours', {
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
                                    placeholder="Giới thiệu về lịch trình, điểm nổi bật..."
                                    className="w-full h-[120px] p-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                <div>
                                    <label className="block text-[14px] font-medium text-slate-dark mb-2 flex items-center gap-2">
                                        <Bus className="w-4 h-4 text-pewter" /> Phương tiện di chuyển
                                    </label>
                                    <select
                                        name="vehicleId"
                                        value={formData.vehicleId}
                                        onChange={handleInputChange}
                                        className="w-full h-[52px] px-4 rounded-xl border border-paper bg-pearl/30 focus:bg-white focus:border-ember-orange focus:ring-1 focus:ring-ember-orange outline-none transition-all appearance-none"
                                    >
                                        <option value="">-- Chọn phương tiện (Tùy chọn) --</option>
                                        {vehicles.map(veh => (
                                            <option key={veh.id} value={veh.id}>{veh.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

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

                            <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                    <p className="text-xs text-pewter mt-1">VD: 30% tổng giá trị tour</p>
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
                                    <p className="text-xs text-pewter mt-1">Số ngày trước khởi hành phải thanh toán 100%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-paper">
                        <h2 className="text-xl font-bold text-graphite mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-ember-orange flex items-center justify-center text-sm">3</span>
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
