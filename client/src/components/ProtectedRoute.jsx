import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;
