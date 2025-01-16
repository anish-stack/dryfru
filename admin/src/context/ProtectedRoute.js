import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    setTimeout(() => {

        if (!user) {
            return <Navigate to="/login" replace />;
        }
    }, [2000])

    return <>{children}</>;
};