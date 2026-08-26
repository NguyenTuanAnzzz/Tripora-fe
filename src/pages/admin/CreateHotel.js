import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';

const CreateHotel = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        starRating: "",
        website: "",
        description: ""
    });

    // Hotel chỉ có 1 ảnh
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImageFile(file);

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

        // Cho phép chọn lại cùng file
        e.target.value = null;
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();

        setImageFile(null);
        setImagePreview(null);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setSuccessMessage("");

        // Hotel bắt buộc phải có ảnh
        if (!imageFile) {
            setMessage("Vui lòng tải lên hình ảnh khách sạn.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("address", form.address);
            formData.append("phone", form.phone);
            formData.append("email", form.email);
            formData.append("starRating", form.starRating);
            formData.append("website", form.website);
            formData.append("description", form.description);

            // Chỉ có 1 ảnh
            formData.append("image", imageFile);

            const response = await fetch(
                "http://localhost:8080/api/hotels/create",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            if (response.ok) {
                setSuccessMessage("Thêm khách sạn thành công");

                setTimeout(() => {
                    navigate("/admin/hotels");
                }, 1500);
            } else {
                const data = await response.json();

                setMessage(
                    data.message || "Lỗi khi thêm khách sạn"
                );
            }

        } catch (error) {
            console.error(error);
            setMessage("Không thể kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="ADMIN">

            <div className="max-w-4xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">

                    <button
                        type="button"
                        onClick={() => navigate('/admin/hotels')}
                        className="p-3 bg-canvas-white hover:bg-paper rounded-full transition-colors shadow-sm text-carbon-black"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div>
                        <h1 className="text-[32px] font-bold text-carbon-black leading-tight">
                            Thêm Khách Sạn Mới
                        </h1>

                        <p className="text-[16px] text-pewter mt-1">
                            Tạo khách sạn mới để hiển thị trên hệ thống.
                        </p>
                    </div>

                </div>

                {/* FORM */}
                <div className="bg-canvas-white rounded-[24px] shadow-sm border border-paper p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* NAME */}
                        <div className="flex flex-col">

                            <label
                                className="text-[14px] font-bold text-slate-dark mb-2"
                                htmlFor="name"
                            >
                                Tên khách sạn
                                <span className="text-red-500"> *</span>
                            </label>

                            <input
                                type="text"
                                id="name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name: e.target.value
                                    })
                                }
                                className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                                placeholder="Nhập tên khách sạn"
                                required
                            />

                        </div>

                        {/* ADDRESS */}
                        <div className="flex flex-col">

                            <label
                                className="text-[14px] font-bold text-slate-dark mb-2"
                                htmlFor="address"
                            >
                                Địa chỉ chi tiết
                                <span className="text-red-500"> *</span>
                            </label>

                            <input
                                type="text"
                                id="address"
                                value={form.address}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        address: e.target.value
                                    })
                                }
                                className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                                placeholder="123 Đường ABC, Phường X, Quận Y, Tỉnh/TP Z"
                                required
                            />

                        </div>

                        {/* PHONE + EMAIL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="flex flex-col">

                                <label
                                    className="text-[14px] font-bold text-slate-dark mb-2"
                                    htmlFor="phone"
                                >
                                    Số điện thoại liên hệ
                                </label>

                                <input
                                    type="text"
                                    id="phone"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value
                                        })
                                    }
                                    className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                                    placeholder="0123 456 789"
                                />

                            </div>

                            <div className="flex flex-col">

                                <label
                                    className="text-[14px] font-bold text-slate-dark mb-2"
                                    htmlFor="email"
                                >
                                    Email liên hệ
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value
                                        })
                                    }
                                    className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                                    placeholder="contact@hotel.com"
                                />

                            </div>

                        </div>

                        {/* STAR + WEBSITE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="flex flex-col">

                                <label
                                    className="text-[14px] font-bold text-slate-dark mb-2"
                                    htmlFor="starRating"
                                >
                                    Hạng sao (1-5)
                                </label>

                                <input
                                    type="number"
                                    id="starRating"
                                    min="1"
                                    max="5"
                                    value={form.starRating}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            starRating: e.target.value
                                        })
                                    }
                                    className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                                    placeholder="Ví dụ: 4 hoặc 5"
                                />

                            </div>

                            <div className="flex flex-col">

                                <label
                                    className="text-[14px] font-bold text-slate-dark mb-2"
                                    htmlFor="website"
                                >
                                    Website
                                </label>

                                <input
                                    type="text"
                                    id="website"
                                    value={form.website}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            website: e.target.value
                                        })
                                    }
                                    className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                                    placeholder="https://www.hotel.com"
                                />

                            </div>

                        </div>

                        {/* DESCRIPTION */}
                        <div className="flex flex-col">

                            <label
                                className="text-[14px] font-bold text-slate-dark mb-2"
                                htmlFor="description"
                            >
                                Mô tả chi tiết
                            </label>

                            <textarea
                                id="description"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        description: e.target.value
                                    })
                                }
                                className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                                placeholder="Nhập mô tả chi tiết về khách sạn..."
                                rows="5"
                            />

                        </div>

                        {/* IMAGE */}
                        <div className="flex flex-col">

                            <label
                                className="text-[14px] font-bold text-slate-dark mb-2"
                                htmlFor="image"
                            >
                                Hình ảnh khách sạn
                                <span className="text-red-500"> *</span>
                            </label>

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

                            {/* PREVIEW */}
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
                                                <div className="relative w-full h-96">

                                                    <img
                                                        ref={ref}
                                                        onClick={open}
                                                        src={imagePreview.src}
                                                        alt="Preview khách sạn"
                                                        className="w-full h-full object-cover rounded-xl border border-paper cursor-pointer"
                                                    />

                                                    {/* XÓA */}
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-2 right-2 w-9 h-9 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition"
                                                    >
                                                        ×
                                                    </button>

                                                </div>
                                            )}
                                        </Item>

                                    </Gallery>

                                    <p className="text-xs text-pewter mt-2">
                                        Click vào ảnh để xem ảnh lớn.
                                    </p>

                                </div>
                            )}

                        </div>

                        {/* MESSAGE */}
                        {message && (
                            <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-100">
                                {message}
                            </div>
                        )}

                        {successMessage && (
                            <div className="p-4 rounded-xl bg-green-50 text-green-700 border border-green-100">
                                {successMessage}
                            </div>
                        )}

                        {/* BUTTON */}
                        <div className="pt-6 border-t border-paper flex gap-4">

                            <button
                                type="button"
                                onClick={() => navigate('/admin/hotels')}
                                className="flex-1 py-[14px] rounded-full text-[16px] font-bold border-2 border-paper text-slate-dark hover:bg-paper transition-all"
                            >
                                Hủy bỏ
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-[14px] rounded-full text-[16px] font-bold bg-ember-orange text-canvas-white shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:shadow-[0_6px_15px_rgba(255,90,47,0.4)] hover:-translate-y-1 transition-all disabled:opacity-50"
                            >
                                {loading ? "Đang xử lý..." : "Lưu Khách Sạn"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default CreateHotel;