import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../../components/InputField';

const CreatePolicy = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [isDefault, setIsDefault] = useState(false);
    const [tiers, setTiers] = useState([
        { daysBefore: 0, cancellationFeePercent: 0 }
    ]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTierChange = (index, field, value) => {
        const newTiers = [...tiers];
        newTiers[index][field] = Number(value);
        setTiers(newTiers);
    };

    const addTier = () => {
        setTiers([...tiers, { daysBefore: 0, cancellationFeePercent: 0 }]);
    };

    const removeTier = (index) => {
        const newTiers = tiers.filter((_, i) => i !== index);
        setTiers(newTiers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            name,
            isDefault,
            tiers
        };

        try {
            const response = await fetch("http://localhost:8080/api/cancellation-policies/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/admin/policies');
            } else {
                const data = await response.json();
                setError(data.message || "Đã xảy ra lỗi khi tạo chính sách");
            }
        } catch (err) {
            setError("Không thể kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="mb-6">
                <Link to="/admin/policies" className="flex items-center gap-2 text-pewter hover:text-carbon-black transition-colors w-fit">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại danh sách</span>
                </Link>
            </div>

            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper p-8 max-w-3xl">
                <h1 className="text-2xl font-bold text-carbon-black mb-6">Thêm chính sách mới</h1>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div>
                            <InputField
                                label="Tên chính sách"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập tên chính sách (VD: Tiêu chuẩn)"
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2 pb-3">
                            <input 
                                type="checkbox" 
                                id="isDefault" 
                                checked={isDefault}
                                onChange={(e) => setIsDefault(e.target.checked)}
                                className="w-5 h-5 text-ember-orange focus:ring-ember-orange rounded border-gray-300"
                            />
                            <label htmlFor="isDefault" className="text-sm font-medium text-carbon-black cursor-pointer">
                                Đặt làm mặc định
                            </label>
                        </div>
                    </div>
                    
                    <div className="border-t border-paper pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-carbon-black">Các điều kiện (Tiers)</h2>
                            <button
                                type="button"
                                onClick={addTier}
                                className="flex items-center gap-1 text-sm font-medium text-ember-orange hover:text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm điều kiện
                            </button>
                        </div>

                        <div className="space-y-4">
                            {tiers.map((tier, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-pearl/30 p-4 rounded-xl border border-paper">
                                    <div className="flex-1">
                                        <InputField
                                            label="Số ngày trước khởi hành"
                                            type="number"
                                            min="0"
                                            value={tier.daysBefore}
                                            onChange={(e) => handleTierChange(index, 'daysBefore', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputField
                                            label="Phí hủy (%)"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={tier.cancellationFeePercent}
                                            onChange={(e) => handleTierChange(index, 'cancellationFeePercent', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {tiers.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTier(index)}
                                            className="p-3 mb-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                            title="Xóa điều kiện"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-paper mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-ember-orange text-canvas-white px-[24px] py-[12px] rounded-xl font-medium hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            <span>{loading ? 'Đang lưu...' : 'Lưu chính sách'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreatePolicy;
