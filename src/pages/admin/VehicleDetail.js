import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ArrowLeft, Truck, FileText, Activity } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';
import InputField from '../../components/InputField';
import ButtonField from '../../components/ButtonField';

const VehicleDetail = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        const fetchVehicle = async () => {
            setFetching(true);
            try {
                const response = await fetch(`http://localhost:8080/api/vehicles/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        status: data.status || 'ACTIVE'
                    });
                } else {
                    setError("Không tìm thấy thông tin phương tiện.");
                }
            } catch (err) {
                setError("Lỗi kết nối API.");
            } finally {
                setFetching(false);
            }
        };

        if (token && id) {
            fetchVehicle();
        }
    }, [id, token]);

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
            const response = await fetch(`http://localhost:8080/api/vehicles/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Cập nhật Phương tiện thành công!");
                navigate('/admin/vehicles');
            } else {
                const data = await response.json();
                setError(data.message || "Đã xảy ra lỗi khi cập nhật Phương tiện");
                window.scrollTo(0, 0);
            }
        } catch (err) {
            setError("Lỗi kết nối đến server.");
            window.scrollTo(0, 0);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <DashboardLayout role="ADMIN">
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <svg className="animate-spin h-10 w-10 text-ember-orange mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-pewter font-medium">Đang tải dữ liệu phương tiện...</p>
                </div>
            </DashboardLayout>
        );
    }

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
                            Cập nhật Phương tiện #{id}
                        </h1>
                        <p className="text-pewter text-[15px] mt-1">
                            Chỉnh sửa thông tin phương tiện vận chuyển
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
                        <label className="text-[14px] font-bold text-slate-dark mb-2" htmlFor="status">Trạng thái</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                        >
                            <option value="ACTIVE">Đang hoạt động</option>
                            <option value="INACTIVE">Tạm dừng</option>
                        </select>
                    </div>

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
                            {loading ? "Đang lưu..." : "Cập nhật Phương Tiện"}
                        </ButtonField>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default VehicleDetail;
