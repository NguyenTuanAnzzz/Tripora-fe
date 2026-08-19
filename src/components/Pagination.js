import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Không hiện phân trang nếu chỉ có 1 trang
    if (totalPages <= 1) return null;

    // Logic tạo danh sách số trang (hiển thị dấu ... nếu quá nhiều trang)
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 0; i < totalPages; i++) {
            // Hiện trang đầu, trang cuối, và 2 trang xung quanh trang hiện tại
            if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(i);
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push('...');
            }
        }
        // Lọc bỏ các dấu ... bị trùng nhau
        return pages.filter((page, index, array) => page !== '...' || array[index - 1] !== '...');
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            {/* Nút Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-paper bg-canvas-white text-slate-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pearl hover:text-ember-orange hover:border-ember-orange/30 transition-all shadow-sm"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Các số trang */}
            {getPageNumbers().map((page, index) => (
                page === '...' ? (
                    <span key={`dots-${index}`} className="px-2 text-pewter font-medium">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all shadow-sm ${
                            currentPage === page
                                ? 'bg-ember-orange text-canvas-white'
                                : 'border border-paper bg-canvas-white text-slate-dark hover:bg-pearl hover:text-ember-orange hover:border-ember-orange/30'
                        }`}
                    >
                        {/* Hiển thị page + 1 vì Backend Spring Boot tính từ trang 0 */}
                        {page + 1}
                    </button>
                )
            ))}

            {/* Nút Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-paper bg-canvas-white text-slate-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pearl hover:text-ember-orange hover:border-ember-orange/30 transition-all shadow-sm"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
