import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const RoleRoute = ({ allowedRoles }) => {
    const { token, user } = useAuth();
    
    // 1. Chưa đăng nhập -> Đá về Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Vì API get-info cần một chút thời gian để chạy, lúc đầu user.role sẽ là chuỗi rỗng ("")
    // Ta hiển thị tạm 1 màn hình chờ (Loading) để tránh việc bị đá nhầm về unauthorized
    if (token && !user.role) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Loading className="w-12 h-12" />
            </div>
        );
    }

    // 3. Đã có thông tin user từ API, kiểm tra role
    if (allowedRoles.includes(user.role)) {
        return <Outlet />;
    } else {
        // Đá thẳng về trang chủ (Home)
        return <Navigate to="/" replace />;
    }
};

export default RoleRoute;
