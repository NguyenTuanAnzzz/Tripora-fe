import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import ButtonField from '../../components/ButtonField';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, User as UserIcon, Shield, Star, Edit2 } from 'lucide-react';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // For editing role
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState("");
    const [updateError, setUpdateError] = useState("");

    useEffect(() => {
        fetchUserDetail();
    }, [id, token]);

    const fetchUserDetail = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setSelectedRole(data.role);
            } else {
                setError("Không thể lấy thông tin người dùng");
            }
        } catch (err) {
            setError("Lỗi kết nối server");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async () => {
        setUpdateError("");
        setUpdateSuccess("");
        setUpdateLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/users/${id}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ role: selectedRole })
            });

            if (response.ok) {
                setUpdateSuccess("Cập nhật vai trò thành công!");
                setUser({ ...user, role: selectedRole });
                setIsEditingRole(false);
            } else {
                const data = await response.json();
                setUpdateError(data.message || "Lỗi khi cập nhật vai trò");
            }
        } catch (err) {
            setUpdateError("Không thể kết nối đến server");
        } finally {
            setUpdateLoading(false);
        }
    };

    const getRoleIcon = (role) => {
        if (role === 'ADMIN') return <Shield className="w-5 h-5 text-purple-600" />;
        if (role === 'STAFF') return <Star className="w-5 h-5 text-blue-600" />;
        return <UserIcon className="w-5 h-5 text-gray-600" />;
    };

    if (loading) return <DashboardLayout role="ADMIN"><div className="p-8 text-center">Đang tải...</div></DashboardLayout>;
    if (error) return <DashboardLayout role="ADMIN"><div className="p-8"><ErrorMessage message={error} /></div></DashboardLayout>;
    if (!user) return <DashboardLayout role="ADMIN"><div className="p-8 text-center">Không tìm thấy người dùng</div></DashboardLayout>;

    return (
        <DashboardLayout role="ADMIN">
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper p-[32px] md:p-[40px] mt-6 w-full">
                <div className="flex items-center mb-8 gap-4">
                    <Link to="/admin/users" className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-pearl border border-paper text-slate-dark hover:bg-ember-orange hover:text-canvas-white hover:border-ember-orange transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-[28px] font-bold text-graphite flex items-center gap-2">
                            Chi Tiết Người Dùng
                        </h1>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-paper">
                        <img src={user.avatar || 'https://via.placeholder.com/150'} alt="avatar" className="w-24 h-24 rounded-full object-cover shadow-sm border border-paper" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-dark">{user.name}</h2>
                            <p className="text-pewter mt-1">{user.email}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold ${user.status === 'ACTIVE' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[14px] font-bold text-pewter block mb-1">Số điện thoại</label>
                            <p className="text-[16px] font-medium text-slate-dark">{user.phone || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                            <label className="text-[14px] font-bold text-pewter block mb-1">Ngày tham gia</label>
                            <p className="text-[16px] font-medium text-slate-dark">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}</p>
                        </div>
                    </div>

                    <div className="bg-pearl/30 p-6 rounded-xl border border-paper mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-[16px] font-bold text-slate-dark flex items-center gap-2">
                                {getRoleIcon(user.role)}
                                Vai trò hiện tại: <span className="text-ember-orange">{user.role}</span>
                            </label>
                            {!isEditingRole && user.role !== 'ADMIN' && (
                                <button 
                                    onClick={() => setIsEditingRole(true)}
                                    className="flex items-center gap-1.5 text-sm font-medium text-ember-orange hover:text-orange-700 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Chỉnh sửa
                                </button>
                            )}
                        </div>

                        {isEditingRole && (
                            <div className="mt-4 p-4 bg-white rounded-lg border border-paper shadow-sm">
                                <label className="text-[14px] font-bold text-slate-dark mb-2 block">Chọn vai trò mới</label>
                                <select
                                    className="block w-full appearance-none bg-canvas-white border border-paper text-slate-dark py-3 px-4 rounded-xl focus:outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange text-[15px] font-medium mb-4"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    {/* Ẩn role ADMIN theo yêu cầu */}
                                    <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
                                    <option value="STAFF">Nhân viên (STAFF)</option>
                                </select>
                                
                                {updateError && <ErrorMessage message={updateError} />}
                                {updateSuccess && <div className="text-green-600 text-sm font-medium mb-2">{updateSuccess}</div>}
                                
                                <div className="flex gap-3 justify-end">
                                    <ButtonField 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditingRole(false);
                                            setSelectedRole(user.role);
                                            setUpdateError("");
                                            setUpdateSuccess("");
                                        }}
                                    >
                                        Hủy
                                    </ButtonField>
                                    <ButtonField 
                                        type="button"
                                        onClick={handleUpdateRole}
                                        disabled={updateLoading || selectedRole === user.role}
                                    >
                                        {updateLoading ? "Đang lưu..." : "Lưu thay đổi"}
                                    </ButtonField>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDetail;
