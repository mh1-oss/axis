import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountingLayout() {
    const { pathname } = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Inventory', href: '/admin/accounting/inventory', icon: 'inventory_2' },
        { name: 'Quotes & Invoices', href: '/admin/accounting/quotes', icon: 'description' },
        { name: 'Reports', href: '/admin/accounting/reports', icon: 'assessment' },
        { name: 'Print Settings', href: '/admin/accounting/settings', icon: 'settings' },
    ];

    const isActive = (href) => {
        if (href === '/admin/accounting/inventory') {
            return pathname === '/admin/accounting' || pathname === '/admin/accounting/' || pathname.startsWith(href);
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="accounting-theme min-h-screen bg-gray-100 dark:bg-gray-900 print:!bg-white flex">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex print:!hidden flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors shrink-0">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-1 group">
                        <span className="text-primary dark:text-white inline-block">
                            <svg className="transition-transform group-hover:scale-110" fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 26L14 6H18L26 26" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                                <path d="M10 26L14 16" stroke="#D32F2F" strokeLinecap="round" strokeWidth="3" />
                            </svg>
                        </span>
                        <div className="text-2xl font-bold uppercase tracking-tighter text-gray-900 dark:text-white leading-none">AXIS</div>
                    </div>
                    <h1 className="text-xs font-display font-bold text-gray-500 tracking-widest uppercase ml-1">Accounting</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={item.name}>
                            <Link
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium relative overflow-hidden ${isActive(item.href)
                                    ? 'bg-primary text-white shadow-lg shadow-red-500/30'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {isActive(item.href) && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary z-0"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="material-icons-outlined text-[20px] relative z-10">{item.icon}</span>
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
                    >
                        <span className="material-icons-outlined text-[20px]">arrow_back</span>
                        Back to Dashboard
                    </Link>
                </div>
            </aside>

            {/* Mobile Header (Fixed) */}
            <div className="md:hidden print:!hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 h-16 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-primary dark:text-white inline-block">
                        <svg fill="none" height="24" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 26L14 6H18L26 26" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                            <path d="M10 26L14 16" stroke="#D32F2F" strokeLinecap="round" strokeWidth="3" />
                        </svg>
                    </span>
                    <h1 className="text-xl font-bold font-display text-gray-900 dark:text-white uppercase tracking-tighter leading-none mt-1">Axis</h1>
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase ml-1 mt-1">Acct</span>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/admin" className="p-2 text-gray-500 hover:text-primary transition-colors flex items-center justify-center">
                        <span className="material-icons-outlined">arrow_back</span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                        <span className="material-icons-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30 md:hidden print:!hidden bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 pt-20 space-y-2 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-all ${isActive(item.href) ? 'bg-primary text-white shadow-md shadow-red-500/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                                >
                                    <span className="material-icons-outlined text-[20px]">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 overflow-auto md:p-8 pt-20 md:pt-8 p-4 print:!p-0 print:!pt-0 print:!m-0 relative z-0">
                <Outlet />
            </main>
        </div>
    );
}
