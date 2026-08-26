import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Plus, Edit2, Trash2, ShieldAlert, FileText } from 'lucide-react';
import SearchBar from '../../components/SearchBar';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';

const PolicyManagement = () => {
    const { token } = useAuth();
    const [policies, setPolicies] = useState([]);
    const [error, setError] = useState();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page')) || 0;
    const searchKeyword = searchParams.get('keyword') || "";
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const getAllPolicies = async () => {
        try {
            const params = new URLSearchParams();
            params.set("page", page);
            params.set("size", size);
            if (searchKeyword) {
                params.set("keyword", searchKeyword);
            }

            const url = `http://localhost:8080/api/cancellation-policies?${params.toString()}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPolicies(data.content || []);
                setTotalPages(data.totalPages || 0);
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
            getAllPolicies();
        }
    }, [page, size, searchKeyword, token]);

    const handleSearch = (keyword) => {
        if (keyword.trim()) {
            setSearchParams({ page: 0, keyword: keyword.trim() }); 
        } else {
            setSearchParams({ page: 0 }); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa chính sách này?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/cancellation-policies/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    getAllPolicies();
                } else {
                    alert("Không thể xóa chính sách này");
                }
            } catch (error) {
                alert("Lỗi kết nối");
            }
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            {/* Page Header (Rich Banner) */}
            <div className="bg-carbon-black rounded-[20px] p-[32px] md:p-[40px] mb-8 relative overflow-hidden shadow-md">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80')" }}
                ></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-[32px] font-bold text-canvas-white mb-2 leading-tight">Quản lý Chính sách</h1>
                        <p className="text-[16px] text-canvas-white/80 font-regular max-w-lg">
                            Kiểm soát các chính sách hủy tour, hoàn tiền và các quy định khác.
                        </p>
                    </div>

                    <Link 
                        to="/admin/policies/create"
                        className="flex items-center gap-2 bg-ember-orange text-canvas-white px-[24px] py-[14px] rounded-full font-medium hover:bg-orange-600 transition-all shadow-[0_4px_10px_rgba(255,90,47,0.3)] hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0" />
                        <span>Thêm chính sách mới</span>
                    </Link>
                </div>
            </div>

            {/* Toolbar (Search) */}
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper p-5 mb-6 flex flex-col lg:flex-row gap-5 justify-between items-center transition-all hover:shadow-md">
                <div className="w-full lg:w-[450px]">
                    <SearchBar
                        compact={true}
                        className="w-full"
                        placeholder="Tìm kiếm chính sách..."
                        initialValue={searchKeyword}
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            {error && error !== "Không thể kết nối đến server" && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Policy Table Card */}
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-paper overflow-hidden mb-[40px]">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-paper">
                        <thead className="bg-pearl/50">
                            <tr>
                                <th scope="col" className="px-6 py-5 text-left text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4" />
                                        <span>Tên chính sách</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-5 text-left text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    Mặc định
                                </th>
                                <th scope="col" className="px-6 py-5 text-left text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    Điều kiện hủy (Tiers)
                                </th>
                                <th scope="col" className="px-6 py-5 text-right text-[12px] font-bold text-pewter uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-paper">
                            {policies.length > 0 ? (
                                policies.map((policy) => (
                                    <tr key={policy.id} className="hover:bg-pearl/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-carbon-black">{policy.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${policy.isDefault ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {policy.isDefault ? 'Có' : 'Không'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {policy.tiers && policy.tiers.map((tier, index) => (
                                                    <div key={index} className="text-sm text-pewter">
                                                        - Trước {tier.daysBefore} ngày: Phạt {tier.cancellationFeePercent}%
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link 
                                                    to={`/admin/policies/${policy.id}`}
                                                    className="text-pewter hover:text-ember-orange transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(policy.id)}
                                                    className="text-pewter hover:text-red-500 transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-pewter">
                                        Không tìm thấy chính sách nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-paper">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setSearchParams({ page: newPage, keyword: searchKeyword })}
                        />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PolicyManagement;
