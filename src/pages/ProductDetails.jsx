import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import { useLanguage } from '../context/LanguageContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products } = usePosts();
    const { t, language } = useLanguage();

    // Derive state to avoid cascading renders
    const loading = products.length === 0;
    const product = products.find(p => p.id === id) || null;

    const handleInquire = () => {
        navigate('/contact', { state: { product: product?.title } });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
                <span className="material-icons-outlined text-6xl text-gray-400 mb-4">error_outline</span>
                <h2 className="text-2xl font-bold mb-4">{t('noProducts')}</h2>
                <Link to="/products" className="text-primary hover:underline">
                    {language === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 min-h-screen pb-12">
            {/* Header / Breadcrumb area could go here */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-6">
                    <span className="material-icons-outlined rtl:rotate-180 text-sm mr-2 rtl:ml-2">arrow_back</span>
                    {language === 'ar' ? 'جميع المنتجات' : 'All Products'}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="relative rounded-lg overflow-hidden shadow-xl h-96 lg:h-[500px]">
                        <motion.img
                            layoutId={`product-image-${product.id}`}
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-4 left-4 rtl:right-4 rtl:left-auto ${product.category === 'Commercial' ? 'bg-primary' : 'bg-secondary'} text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm`}>
                            {product.category}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary dark:text-white mb-6">
                            {product.title}
                        </h1>

                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                            <p>{product.description}</p>
                        </div>

                        {/* Feature List (Mocked for now as schema is simple, but good for layout) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-100 dark:border-gray-800">
                                <span className="material-icons-outlined text-primary mr-3 rtl:ml-3">verified</span>
                                <span className="font-medium">{language === 'ar' ? 'جودة عالية' : 'Premium Quality'}</span>
                            </div>
                            <div className="flex items-center p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-100 dark:border-gray-800">
                                <span className="material-icons-outlined text-primary mr-3 rtl:ml-3">engineering</span>
                                <span className="font-medium">{language === 'ar' ? 'تصميم هندسي' : 'Engineered Design'}</span>
                            </div>
                            <div className="flex items-center p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-100 dark:border-gray-800">
                                <span className="material-icons-outlined text-primary mr-3 rtl:ml-3">eco</span>
                                <span className="font-medium">{language === 'ar' ? 'صديق للبيئة' : 'Eco Friendly'}</span>
                            </div>
                            <div className="flex items-center p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-100 dark:border-gray-800">
                                <span className="material-icons-outlined text-primary mr-3 rtl:ml-3">build</span>
                                <span className="font-medium">{language === 'ar' ? 'تثبيت مخصص' : 'Custom Installation'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleInquire}
                                className="flex-1 bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-md font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-outlined">email</span>
                                {t('inquire')}
                            </button>
                            <a
                                href={product.catalog_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex-1 border border-gray-300 dark:border-gray-600 px-8 py-4 rounded-md font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 ${product.catalog_url ? 'hover:border-secondary dark:hover:border-white text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-white cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                onClick={(e) => !product.catalog_url && e.preventDefault()}
                            >
                                <span className="material-icons-outlined">picture_as_pdf</span>
                                {language === 'ar' ? 'تحميل الكتالوج' : 'Download Catalog'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
