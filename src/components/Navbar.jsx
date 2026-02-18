import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();

    const links = [
        { to: '/', label: t('home') },
        { to: '/products', label: t('products') },
        { to: '/projects', label: t('projects') },
        { to: '/contact', label: t('contact') },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="sticky top-0 z-50 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark transition-colors duration-300"
            style={{
                paddingLeft: 'env(safe-area-inset-left)',
                paddingRight: 'env(safe-area-inset-right)'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="text-3xl font-display font-bold tracking-tighter uppercase flex items-center">
                            <span className="text-black dark:text-white mr-1">
                                <svg className="inline-block mb-1" fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 26L14 6H18L26 26" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                                    <path d="M10 26L14 16" stroke="#D32F2F" strokeLinecap="round" strokeWidth="3" />
                                </svg>
                            </span>
                            <span className="text-black dark:text-white">AXIS</span>
                        </div>
                        <span className="hidden lg:block h-6 w-px bg-gray-300 dark:bg-gray-700" />
                        <span className="hidden lg:block text-[0.6rem] tracking-[0.2em] uppercase font-medium text-gray-500 dark:text-gray-400 leading-none">
                            Beyond The Frame
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isActive(link.to)
                                    ? 'text-primary'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                            onClick={toggleLanguage}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-bold text-sm uppercase"
                            title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                        >
                            {language === 'en' ? 'AR' : 'EN'}
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            <span className="material-icons-outlined text-xl">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        <div className="w-4"></div> {/* Spacer */}
                        <Link
                            to="/contact"
                            className="bg-primary hover:bg-red-700 text-white px-6 py-2.5 rounded-sm font-bold uppercase tracking-wider text-sm transition-all transform hover:-translate-y-0.5 shadow-lg shadow-red-500/30"
                        >
                            {t('getQuote')}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button
                            onClick={toggleLanguage}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-bold text-sm uppercase"
                        >
                            {language === 'en' ? 'AR' : 'EN'}
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        >
                            <span className="material-icons-outlined text-xl">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all focus:outline-none"
                        >
                            <span className="material-icons-outlined text-3xl">
                                {mobileOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden fixed inset-x-0 top-20 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark shadow-xl z-40 overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {links.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block py-3 px-4 text-sm font-semibold uppercase tracking-wider rounded transition-colors ${isActive(link.to)
                                        ? 'text-primary bg-red-50 dark:bg-red-900/20'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                to="/contact"
                                onClick={() => setMobileOpen(false)}
                                className="block mt-4 text-center bg-primary hover:bg-red-700 text-white px-6 py-3 rounded font-bold uppercase tracking-wider text-sm transition-all"
                            >
                                {t('getQuote')}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
