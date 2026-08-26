import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../components/InputField';
import ButtonField from '../../components/ButtonField';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Utensils } from 'lucide-react';
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';

const CreateRestaurant = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        cuisineType: "Buffet Hải Sản",
        priceRange: "$ (Giá rẻ)",
        description: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    setImagePreview({
                        src: reader.result,
                        width: img.width,
                        height: img.height
                    });
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
        // Reset the input value so the user can select the same file again if they want
        e.target.value = null;
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation(); // prevent opening the gallery
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setSuccessMessage("");
        
        if (!imageFile) {
            setMessage("Vui lòng tải lên ảnh bìa nhà hàng.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("address", form.address);
            if (form.phone) formData.append("phone", form.phone);
            if (form.email) formData.append("email", form.email);
            formData.append("cuisineType", form.cuisineType);
            formData.append("priceRange", form.priceRange);
            if (form.description) formData.append("description", form.description);
            formData.append("image", imageFile);

            const response = await fetch("http://localhost:8080/api/restaurants/create", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setSuccessMessage("Thêm nhà hàng thành công");
                setTimeout(() => {
                    navigate("/admin/restaurants");
                }, 1500);
            } else {
                const data = await response.json();
                setMessage(data.message || "Lỗi khi thêm nhà hàng");
            }
        } catch (error) {
            setMessage("Không thể kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper p-[32px] md:p-[40px] max-w-3xl mx-auto mt-6">
                <div className="flex items-center mb-8 gap-4">
                    <Link to="/admin/restaurants" className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-pearl border border-paper text-slate-dark hover:bg-ember-orange hover:text-canvas-white hover:border-ember-orange transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-[28px] font-bold text-graphite flex items-center gap-2">
                            <Utensils className="w-7 h-7 text-ember-orange" />
                            Thêm Nhà Hàng Mới
                        </h1>
                        <p className="text-pewter text-[15px] mt-1">
                            Khởi tạo thông tin nhà hàng hoặc quán cafe vào hệ thống.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        label={<span>Tên nhà hàng <span className="text-red-500">*</span></span>}
                        id="name"
                        placeholder="Nhập tên nhà hàng"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <InputField
                        label={<span>Địa chỉ chi tiết <span className="text-red-500">*</span></span>}
                        id="address"
                        placeholder="VD: Tầng 1 - Cạnh sảnh chính"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Số điện thoại liên hệ"
                            id="phone"
                            placeholder="0123 456 789"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                        <InputField
                            type="email"
                            label="Email liên hệ"
                            id="email"
                            placeholder="contact@restaurant.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="text-[14px] font-bold text-slate-dark mb-2" htmlFor="cuisineType">Loại hình ẩm thực (Cuisine Type)</label>
                            <select 
                                id="cuisineType"
                                value={form.cuisineType}
                                onChange={(e) => setForm({ ...form, cuisineType: e.target.value })}
                                className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                            >
                                <option value="Buffet Hải Sản">Buffet Hải Sản</option>
                                <option value="Ẩm thực Việt Nam">Ẩm thực Việt Nam</option>
                                <option value="Châu Âu">Châu Âu</option>
                                <option value="Châu Á">Châu Á</option>
                                <option value="Cafe & Bar">Cafe & Bar</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[14px] font-bold text-slate-dark mb-2" htmlFor="priceRange">Mức giá (Price Range)</label>
                            <select
                                id="priceRange"
                                value={form.priceRange}
                                onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
                                className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                            >
                                <option value="$ (Giá rẻ)">$ (Giá rẻ)</option>
                                <option value="$$ (Tầm trung)">$$ (Tầm trung)</option>
                                <option value="$$$ (Cao cấp)">$$$ (Cao cấp)</option>
                                <option value="$$$$ (Siêu sang)">$$$$ (Siêu sang)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[14px] font-bold text-slate-dark mb-2" htmlFor="description">Mô tả phong cách ẩm thực</label>
                        <textarea
                            id="description"
                            className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                            placeholder="Viết mô tả ngắn về ẩm thực nhà hàng..."
                            rows="4"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        ></textarea>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-[14px] font-bold text-slate-dark mb-2" htmlFor="image">Ảnh bìa nhà hàng <span className="text-red-500">*</span></label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-slate-dark text-[15px] font-medium
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-ember-orange file:text-canvas-white
                            hover:file:bg-orange-600 focus:outline-none cursor-pointer"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <Gallery>
                                    <Item
                                        original={imagePreview.src}
                                        thumbnail={imagePreview.src}
                                        width={imagePreview.width}
                                        height={imagePreview.height}
                                    >
                                        {({ ref, open }) => (
                                            <div 
                                                className="w-full aspect-video rounded-2xl overflow-hidden border border-paper relative group cursor-zoom-in shadow-sm hover:shadow-md transition-shadow"
                                                ref={ref} 
                                                onClick={open}
                                            >
                                                <img src={imagePreview.src} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                
                                                {/* Hover Overlay with Magnifying Glass */}
                                                <div className="absolute inset-0 bg-carbon-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-canvas-white bg-carbon-black/50 p-3 rounded-full backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                                                    </span>
                                                </div>

                                                {/* Remove Button */}
                                                <button 
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    title="Xóa ảnh"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                </button>
                                            </div>
                                        )}
                                    </Item>
                                </Gallery>
                            </div>
                        )}
                    </div>

                    {message && <ErrorMessage message={message} />}
                    {successMessage && (
                        <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-100">
                            {successMessage}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-4 border-t border-paper mt-8">
                        <ButtonField 
                            type="button" 
                            variant="outline"
                            onClick={() => navigate("/admin/restaurants")}
                        >
                            Hủy bỏ
                        </ButtonField>
                        <ButtonField 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Lưu Nhà Hàng"}
                        </ButtonField>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateRestaurant;

