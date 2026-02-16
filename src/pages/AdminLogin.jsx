import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // If already authenticated, redirect
    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const success = login(email, password);
            if (success) {
                navigate('/admin', { replace: true });
            } else {
                setError('Invalid email or password. Please try again.');
            }
            setLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <svg fill="none" height="48" viewBox="0 0 32 32" width="48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 26L14 6H18L26 26" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                            <path d="M10 26L14 16" stroke="#D32F2F" strokeLinecap="round" strokeWidth="3" />
                        </svg>
                        <span className="text-4xl font-display font-bold text-white uppercase tracking-tighter">AXIS</span>
                    </div>
                    <p className="text-gray-400 text-sm uppercase tracking-[0.3em]">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-8 shadow-2xl">
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400 text-sm mb-8">Sign in to access the admin dashboard</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-sm flex items-center">
                            <span className="material-icons-outlined mr-2 text-lg">error_outline</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="admin-email">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons-outlined text-gray-500 text-lg">email</span>
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                                    id="admin-email"
                                    placeholder="admin@axis.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="admin-password">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons-outlined text-gray-500 text-lg">lock</span>
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                                    id="admin-password"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-bold uppercase tracking-wider text-sm transition-all duration-200 shadow-lg shadow-red-500/20 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-600 text-xs mt-8">
                    This is a restricted area. Authorized personnel only.
                </p>
            </div>
        </div>
    );
}
