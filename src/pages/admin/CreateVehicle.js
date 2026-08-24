import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ArrowLeft, Truck, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';
import InputField from '../../components/InputField';
import ButtonField from '../../components/ButtonField';

const CreateVehicle = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name) {
            setError("Vui lòng điền tên phương tiện.");
            window.scrollTo(0, 0);
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/vehicles/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Tạo Phương tiện thành công!");
                navigate('/admin/vehicles');
            } else {
                const data = await response.json();
                setError(data.message || "Đã xảy ra lỗi khi tạo Phương tiện");
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
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper p-[32px] md:p-[40px] max-w-3xl mx-auto mt-6">
                <div className="flex items-center mb-8 gap-4">
                    <Link to="/admin/vehicles" className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-pearl border border-paper text-slate-dark hover:bg-ember-orange hover:text-canvas-white hover:border-ember-orange transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-[28px] font-bold text-graphite flex items-center gap-2">
                            <Truck className="w-7 h-7 text-ember-orange" />
                            Thêm Phương Tiện Mới
                        </h1>
                        <p className="text-pewter text-[15px] mt-1">
                            Tạo danh mục phương tiện vận chuyển cho các Tour
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        label="Tên phương tiện"
                        id="name"
                        name="name"
                        placeholder="Ví dụ: Xe khách giường nằm 45 chỗ..."
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />

                    <div className="flex flex-col">
                        <label className="text-[14px] font-bold text-slate-dark mb-2" htmlFor="description">Mô tả phương tiện</label>
                        <textarea
                            id="description"
                            name="description"
                            className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium min-h-[150px]"
                            placeholder="Cung cấp chi tiết về tiện ích, đặc điểm của phương tiện này..."
                            value={formData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

                    <div className="pt-4 flex justify-end gap-4 border-t border-paper mt-8">
                        <ButtonField 
                            type="button" 
                            variant="outline"
                            onClick={() => navigate("/admin/vehicles")}
                        >
                            Hủy
                        </ButtonField>
                        <ButtonField 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Đang tạo..." : "Lưu Phương Tiện"}
                        </ButtonField>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateVehicle;
