import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <span className="material-icons-outlined text-4xl text-gray-400 animate-spin block mb-2">refresh</span>
                    <p className="text-gray-500 dark:text-gray-400">Verifying session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    return children ? children : <Outlet />;
}
