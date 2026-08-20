import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const RoleRoute = ({ allowedRoles }) => {
    const { token, user } = useAuth();
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (token && !user.role) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Loading className="w-12 h-12" />
            </div>
        );
    }


    if (allowedRoles.includes(user.role)) {
        return <Outlet />;
    } else {
        return <Navigate to="/" replace />;
    }
};

export default RoleRoute;
