import React from 'react';
import { Link } from 'react-router-dom';

const HomeLayout = ({ children }) => {
    return (
        <div className="min-h-screen font-sans flex flex-col bg-canvas-white text-slate-dark">
            {/* Top Navigation Bar */}
            <nav className="bg-canvas-white py-4 md:py-5">
                <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img 
                            src="/logo.svg" 
                            alt="Tripora" 
                            className="h-32 w-auto object-contain"
                        />
                    </div>
                    
                    {/* Center Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#" className="text-body font-medium text-stone hover:text-ember-orange transition-colors">Điểm đến</a>
                        <a href="#" className="text-body font-medium text-stone hover:text-ember-orange transition-colors">Khám phá</a>
                        <a href="#" className="text-body font-medium text-stone hover:text-ember-orange transition-colors">Cộng đồng</a>
                        <a href="#" className="text-body font-medium text-stone hover:text-ember-orange transition-colors">Về chúng tôi</a>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/login"
                            className="text-body font-medium text-slate-dark px-6 py-3.5 rounded-buttons transition-colors hover:bg-pearl"
                        >
                            Đăng nhập
                        </Link>
                        <Link 
                            to="/register"
                            className="text-body font-medium bg-ember-orange text-canvas-white px-6 py-3.5 rounded-buttons shadow-md hover:opacity-90 transition-opacity"
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Breadcrumb - Optional, skipping for home page unless strictly needed, but design.md says "Sits directly below the nav bar with 15px vertical padding." */}
            {/* Page Content */}
            <main className="flex-grow flex flex-col bg-canvas-white">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-carbon-black text-canvas-white pt-16 pb-8">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div className="md:col-span-1">
                            <img src="/logo.svg" alt="Tripora" className="h-32 w-auto object-contain mb-6 filter brightness-0 invert" />
                            <p className="text-stone text-body mb-6">Mở ra thế giới của những chuyến đi bất tận. Đồng hành cùng bạn trên mọi hành trình.</p>
                        </div>
                        <div>
                            <h4 className="text-heading-sm font-medium mb-6">Về chúng tôi</h4>
                            <ul className="space-y-4 text-stone text-body">
                                <li><a href="#" className="hover:text-ember-orange transition-colors">Giới thiệu</a></li>
                                <li><a href="#" className="hover:text-ember-orange transition-colors">Tuyển dụng</a></li>
                                <li><a href="#" className="hover:text-ember-orange transition-colors">Báo chí</a></li>
                                <li><a href="#" className="hover:text-ember-orange transition-colors">Điều khoản</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-heading-sm font-medium mb-6">Trợ giúp</h4>
                            <ul className="space-y-4 text-stone text-body">
                                <li><a href="#" className="hover:text-ember-orange transition-colors">Trung tâm hỗ trợ</a></li>
                                <li><a href="#" className="hover:text-ember-orange transition-colors">Liên hệ</a></li>
                                <li><a href="#" className="hover:text-ember-orange transition-colors">Chính sách bảo mật</a></li>
                                <li><a href="#" className="hover:text-ember-orange transition-colors">Sitemap</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-heading-sm font-medium mb-6">Kết nối</h4>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-dark flex items-center justify-center hover:bg-ember-orange transition-colors">
                                    <svg className="w-5 h-5 text-canvas-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-dark flex items-center justify-center hover:bg-ember-orange transition-colors">
                                    <svg className="w-5 h-5 text-canvas-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-dark/50 pt-8 flex flex-col md:flex-row justify-between items-center text-stone text-caption">
                        <p>© 2026 Tripora. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-canvas-white transition-colors">Điều khoản dịch vụ</a>
                            <a href="#" className="hover:text-canvas-white transition-colors">Quyền riêng tư</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomeLayout;
