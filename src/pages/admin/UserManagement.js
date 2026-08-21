import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Plus, Edit2, Filter, Shield, User, Star } from 'lucide-react';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import SelectField from '../../components/SelectField';
const UserManagement = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page')) || 0;
    const searchKeyword = searchParams.get('keyword') || "";
    const role = searchParams.get('role') || "";
    const status = searchParams.get('status') || "";
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const getAllUsers = async () => {
        try {
            const params = new URLSearchParams();

            params.set("page", page);
            params.set("size", size);

            if (searchKeyword) {
                params.set("keyword", searchKeyword);
            }

            if (role) {
                params.set("role", role);
            }

            if (status) {
                params.set("status", status);
            }

            const url = `http://localhost:8080/api/users?${params.toString()}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                setUsers(data.content);
                setTotalPages(data.totalPages);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Lỗi tải dữ liệu");
            }

        } catch (error) {
            setError("Không thể kết nối đến server");
        }
    };

    useEffect(() => {
        if (token) {
            getAllUsers();
        }
    }, [page, size, searchKeyword, role, status, token]);

     const handleSearch = (keyword) => {
        if (keyword.trim()) {
            setSearchParams({ page: 0, keyword: keyword.trim() }); 
        } else {
            setSearchParams({ page: 0 }); // Xóa keyword khỏi URL nếu search rỗng
        }
    };


    const getAvatarStyle = (name) => {
        const styles = [
            'bg-blue-100 text-blue-600',
            'bg-green-100 text-green-600',
            'bg-purple-100 text-purple-600',
            'bg-orange-100 text-orange-600',
            'bg-pink-100 text-pink-600'
        ];
        return styles[name.charCodeAt(0) % styles.length];
    };

    const getRoleIcon = (role) => {
        if (role === 'ADMIN') return <Shield className="w-3 h-3 mr-1" />;
        if (role === 'STAFF') return <Star className="w-3 h-3 mr-1" />;
        return <User className="w-3 h-3 mr-1" />;
    };

    return (
        <DashboardLayout role="ADMIN">

            {/* Page Header (Rich Banner) */}
            <div className="bg-carbon-black rounded-[20px] p-[32px] md:p-[40px] mb-8 relative overflow-hidden shadow-md">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=1200&q=80')" }}
                ></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-[32px] font-bold text-canvas-white mb-2 leading-tight">Quản lý Người dùng</h1>
                        <p className="text-[16px] text-canvas-white/80 font-regular max-w-lg">
                            Kiểm soát và phân quyền thành viên trong hệ thống.
                        </p>
                    </div>

                    <Link 
                        to="/admin/users/create"
                        className="flex items-center gap-2 bg-ember-orange text-canvas-white px-[24px] py-[14px] rounded-full font-medium hover:bg-orange-600 transition-all shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0" />
                        <span>Thêm người dùng mới</span>
                    </Link>
                </div>
            </div>

            {/* Toolbar (Search + Filters) */}
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper p-5 mb-6 flex flex-col lg:flex-row gap-5 justify-between items-center transition-all hover:shadow-md">
                {/* Search - Left aligned */}
                <div className="w-full lg:w-[450px]">
                    <SearchBar
                        compact={true}
                        className="w-full"
                        placeholder="Tìm theo tên, SĐT, email..."
                        initialValue={searchKeyword}
                        onSearch={handleSearch}
                    />
                </div>

                {/* Filters - Right aligned */}
                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
                    <div className="flex items-center gap-2 text-pewter text-[14px] font-medium whitespace-nowrap">
                        <Filter className="w-4 h-4" />
                        Lọc theo:
                    </div>
                    <div className="flex w-full sm:w-auto gap-3">
                        <SelectField
                            value={role}
                            onChange={(e) => {
                                setSearchParams(prev => {
                                    prev.set("role", e.target.value);
                                    prev.set("page", "0");
                                    return prev;
                                });
                            }}
                            options={[
                                { label: 'Tất cả vai trò', value: '' },
                                { label: 'ADMIN', value: 'ADMIN' },
                                { label: 'STAFF', value: 'STAFF' },
                                { label: 'CUSTOMER', value: 'CUSTOMER' }
                            ]}
                        />
                        <SelectField
                            value={status}
                            onChange={(e) => {
                                setSearchParams(prev => {
                                    prev.set("status", e.target.value);
                                    prev.set("page", "0");
                                    return prev;
                                });
                            }}
                            options={[
                                { label: 'Tất cả trạng thái', value: '' },
                                { label: 'Đang hoạt động', value: 'ACTIVE' },
                                { label: 'Bị khóa', value: 'BLOCKED' }
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* User Table Card */}
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper overflow-hidden mb-[40px]">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-paper">
                        <thead className="bg-pearl/50">
                            <tr>
                                <th scope="col" className="px-6 py-5 text-left text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 flex-shrink-0"></div>
                                        <span>Thành viên</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-5 text-center text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th scope="col" className="px-6 py-5 text-center text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-5 text-center text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    Liên hệ
                                </th>
                                <th scope="col" className="px-6 py-5 text-center text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    Ngày tham gia
                                </th>
                                <th scope="col" className="px-6 py-5 text-center text-[12px] font-bold text-pewter uppercase tracking-wider w-[160px]">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-canvas-white divide-y divide-paper">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-pearl/40 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-[40px] w-[40px] rounded-full flex items-center justify-center font-bold text-[16px] shadow-sm flex-shrink-0 ${getAvatarStyle(user.name)}`}>
                                                <img src={user.avatar} className="rounded-full"/>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[14px] font-bold text-graphite mb-0.5 group-hover:text-ember-orange transition-colors truncate">{user.name}</div>
                                                <div className="text-[12px] font-medium text-pewter truncate">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap align-middle text-center">
                                        <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider justify-center
                                            ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                                user.role === 'STAFF' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                    'bg-gray-50 text-slate-dark border border-gray-200'}`}>
                                            {getRoleIcon(user.role)}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap align-middle text-center">
                                        <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold
                                            ${user.status === 'ACTIVE' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></span>
                                            {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap align-middle text-center text-[13px] font-medium text-slate-dark">
                                        {user.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap align-middle text-center text-[13px] font-medium text-pewter">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap align-middle text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-pearl border border-paper text-slate-dark hover:bg-ember-orange hover:text-canvas-white hover:border-ember-orange transition-all shadow-sm" title="Chỉnh sửa">
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Custom Footer Pagination container */}
                <div className="bg-canvas-white px-8 py-5 border-t border-paper flex items-center justify-between">
                    
                    <div className="[&>div]:!mt-0">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => {
                                setSearchParams(prev => {
                                    prev.set("page", newPage.toString());
                                    return prev;
                                });
                            }}
                        />
                    </div>
                </div>
            </div>

        </DashboardLayout>
    );
};

export default UserManagement;
