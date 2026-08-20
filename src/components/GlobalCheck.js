import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const GlobalCheck = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Nếu đã đăng nhập, đã load xong user (có role), nhưng thiếu phone
        // và đang không ở trang enter-phone -> Chuyển hướng ngay lập tức
        if (token && user.role && !user.phone && location.pathname !== '/enter-phone') {
            navigate('/enter-phone', { replace: true });
        }
    }, [token, user, navigate, location]);

    return null; // Component này chỉ chạy ngầm, không render giao diện
};

export default GlobalCheck;
