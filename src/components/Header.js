import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const auth = useAuth();
    const name = auth?.user?.name;
    const location = useLocation();
    
    // Danh sách menu
    const navLinks = [
        { title: 'Điểm đến', path: '/destinations' },
        { title: 'Khám phá', path: '/tours' },
        { title: 'Cộng đồng', path: '/community' },
        { title: 'Về chúng tôi', path: '/about' },
    ];

    // Hàm kiểm tra xem menu nào đang active
    const getLinkClass = (path) => {
        // Nếu đường dẫn hiện tại khớp với path của menu (hoặc bắt đầu bằng path đó để highlight các trang con)
        const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
        
        return `text-body font-medium transition-colors ${
            isActive ? 'text-ember-orange font-bold' : 'text-stone hover:text-ember-orange'
        }`;
    };

    return (
        <nav className="bg-canvas-white py-4 md:py-5">
            <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link className="flex items-center" to="/">
                    <img 
                        src="/logo.svg" 
                        alt="Tripora" 
                        className="h-24 w-auto object-contain"
                    />
                </Link>
                
                {/* Center Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link, index) => (
                        <Link 
                            key={index} 
                            to={link.path} 
                            className={getLinkClass(link.path)}
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                {name ? (
                    <Link to="/my-profile" className="flex items-center gap-3">
                        <span className="text-body font-medium text-stone">{name}</span>
                        <div className="w-10 h-10 rounded-full bg-pearl flex items-center justify-center text-slate-dark overflow-hidden cursor-pointer hover:ring-2 hover:ring-ember-orange transition-all border border-slate-light">
                            { (auth?.user?.avatar || auth?.user?.picture || auth?.user?.avatarUrl || auth?.user?.imageUrl) ? (
                                <img src={auth.user.avatar || auth.user.picture || auth.user.avatarUrl || auth.user.imageUrl} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <svg className="w-6 h-6 text-pewter" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </div>
                    </Link>
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
