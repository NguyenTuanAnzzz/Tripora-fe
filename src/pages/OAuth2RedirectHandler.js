import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Hàm đọc cookie
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        // Đọc token từ cookie thay vì URL
        const token = getCookie('oauth2_auth_token');
        
        if (token) {
            localStorage.setItem('token', token);
            
            // Xóa cookie sau khi đã lấy xong để dọn dẹp
            document.cookie = 'oauth2_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            // Refresh to initialize auth context correctly and go to home
            window.location.href = '/';
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Đang xử lý đăng nhập...</p>
        </div>
    );
};

export default OAuth2RedirectHandler;
