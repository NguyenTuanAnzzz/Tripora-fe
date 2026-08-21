import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../components/InputField';
import ButtonField from '../../components/ButtonField';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, UserPlus } from 'lucide-react';

const CreateUser = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "CUSTOMER",
        status: "ACTIVE"
    });
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/users/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                setSuccessMessage("Tạo người dùng thành công");
                setTimeout(() => {
                    navigate("/admin/users");
                }, 1500);
            } else {
                const data = await response.json();
                setMessage(data.message || "Lỗi khi tạo người dùng");
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
                    <Link to="/admin/users" className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-pearl border border-paper text-slate-dark hover:bg-ember-orange hover:text-canvas-white hover:border-ember-orange transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-[28px] font-bold text-graphite flex items-center gap-2">
                            <UserPlus className="w-7 h-7 text-ember-orange" />
                            Thêm Người Dùng Mới
                        </h1>
                        <p className="text-pewter text-[15px] mt-1">
                            Tạo tài khoản mới và cấp quyền truy cập vào hệ thống.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Họ và tên"
                            id="name"
                            placeholder="Nhập họ và tên"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <InputField
                            label="Số điện thoại"
                            id="phone"
                            placeholder="Nhập số điện thoại"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            required
                        />
                    </div>
                    
                    <InputField
                        label="Địa chỉ email"
                        type="email"
                        id="email"
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Mật khẩu"
                            type="password"
                            id="password"
                            placeholder="Mật khẩu đăng nhập"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        
                        <div className="flex flex-col">
                            <label className="text-[14px] font-bold text-slate-dark mb-2">Vai trò</label>
                            <select
                                className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            >
                                <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
                                <option value="STAFF">Nhân viên (STAFF)</option>
                                <option value="ADMIN">Quản trị viên (ADMIN)</option>
                            </select>
                        </div>
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
                            onClick={() => navigate("/admin/users")}
                        >
                            Hủy
                        </ButtonField>
                        <ButtonField 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Đang tạo..." : "Tạo tài khoản"}
                        </ButtonField>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateUser;
