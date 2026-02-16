import { useState } from 'react';
import { usePosts } from '../context/PostsContext';

export default function Products() {
    const { products } = usePosts();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Residential', 'Commercial', 'Custom'];

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 min-h-screen flex flex-col">
            {/* Hero */}
            <div className="relative bg-secondary dark:bg-black py-16 sm:py-24">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        alt="Modern architecture glass facade"
                        className="w-full h-full object-cover opacity-30 dark:opacity-40 filter grayscale"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkifQLICmmjAzXe5FcuxZy5MgxwU9uxrkZ5jItWjaSSMOPWk3u899ZWNgWMF2sH_dIRNBS5o0rZIYKSw1UCEPv6mLvK7zb9hNtU8_kScbw0OkXzxhrED7zs_pBvMwye21ZX2VW7Q0fHrGKNbU0goIn83Sf5dAFeTui9UdHnPwny9X46bGssFngjAPCtRDUx37mz7fX42yISTk3WpF3WyR25fVSbITejzQjlfv_LcpWARSy4ZQXS1nTdrt5FaighUIJqwSBU_K1jUeC"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight mb-6">
                        Premium Aluminum Systems
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-300">
                        Engineered for performance, designed for elegance. Explore our range of cutting-edge aluminum fabrication solutions for modern spaces.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-800 gap-4">
                    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-md font-medium text-sm transition-all focus:outline-none ${activeCategory === cat
                                        ? 'bg-white dark:bg-secondary text-secondary dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-grow md:flex-grow-0">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-icons-outlined text-gray-400 text-lg">search</span>
                        </span>
                        <input
                            className="block w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-card-dark text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Search products..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="group bg-card-light dark:bg-card-dark rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    alt={product.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    src={product.image}
                                />
                                <div className={`absolute top-4 left-4 ${product.category === 'Commercial' ? 'bg-primary' : 'bg-secondary'} text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm`}>
                                    {product.category}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-display font-bold text-secondary dark:text-white mb-2">{product.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">{product.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                    <a href="#" className="text-secondary dark:text-white font-medium text-sm hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1 group/link">
                                        View Details <span className="material-icons-outlined text-base transform group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                    </a>
                                    <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 text-sm font-medium rounded transition-colors">
                                        Inquire
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-icons-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">search_off</span>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
