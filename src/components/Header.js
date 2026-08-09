import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const auth = useAuth();
    const name = auth.name;
    
    return (
        
        <nav className="bg-canvas-white py-4 md:py-5">
            <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <img 
                        src="/logo.svg" 
                        alt="Tripora" 
                        className="h-24 w-auto object-contain"
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
                {name ? (
                    <div className="flex items-center gap-3">
                        <span className="text-body font-medium text-stone">{name}</span>
                        <div className="w-10 h-10 rounded-full bg-pearl flex items-center justify-center text-slate-dark overflow-hidden cursor-pointer hover:ring-2 hover:ring-ember-orange transition-all border border-slate-light">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                ) : (
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
                )}
                
            </div>
        </nav>
    );
};

export default Header;
