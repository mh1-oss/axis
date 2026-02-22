import { useState } from 'react';
import { usePosts } from '../context/PostsContext';
import { useLanguage } from '../context/LanguageContext';

export default function Projects() {
    const { projects } = usePosts();
    const { t, language } = useLanguage();
    // Keys for filtering - these should match DB values effectively, but for display we want translated.
    // However, DB has English values. We'll simply map the display name.
    const [activeCategory, setActiveCategory] = useState('All Projects');

    // Category mapping: Display Name -> DB/Filter Name
    const categoryMap = [
        { label: t('allProjects'), value: 'All Projects' },
        { label: t('commercial'), value: 'Commercial' },
        { label: t('residential'), value: 'Residential' },
        { label: t('industrial'), value: 'Industrial' }
    ];

    const filteredProjects = activeCategory === 'All Projects'
        ? projects
        : projects.filter(p => p.category === activeCategory);

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
            {/* Header */}
            <header className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-surface-light dark:bg-surface-dark transition-colors duration-300">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight mb-4 text-gray-900 dark:text-white">
                        {t('ourProjects')} <span className={language === 'ar' ? 'text-white' : 'text-primary'}>{t('projectsTitle')}</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 font-light">
                        {t('projectsSubtitle')}
                    </p>
                </div>
            </header>

            {/* Filters */}
            <section className="sticky top-20 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm py-6 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-4 overflow-x-auto max-w-full pb-2">
                        {categoryMap.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat.value)}
                                className={`px-6 py-2 rounded-full border text-sm font-semibold uppercase tracking-wide transition-all whitespace-nowrap ${activeCategory === cat.value
                                    ? 'border-primary bg-primary text-white shadow-md transform scale-105'
                                    : 'border-gray-300 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:text-primary hover:bg-white dark:hover:bg-gray-800'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map(project => (
                        <div
                            key={project.id}
                            onClick={() => project.catalog_url && window.open(project.catalog_url, '_blank')}
                            className={`relative group overflow-hidden rounded-lg shadow-lg h-80 ${project.catalog_url ? 'cursor-pointer' : ''}`}
                        >
                            <img
                                alt={project.title}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                src={project.image_url}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1">{project.category}</span>
                                <h3 className="text-white font-display text-2xl font-bold uppercase">{project.title}</h3>
                                <p className="text-gray-300 text-sm mt-1 flex items-center">
                                    <span className="material-icons-outlined text-sm mr-1">place</span> {project.location}
                                </p>
                                {project.catalog_url && (
                                    <div className="mt-3 inline-flex items-center text-white text-sm font-medium border-t border-white/20 pt-3">
                                        <span className="material-icons-outlined mr-2">picture_as_pdf</span>
                                        {language === 'ar' ? 'عرض الكتالوج' : 'View Catalog'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-icons-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">folder_off</span>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noProjects')}</p>
                    </div>
                )}
            </main>
        </div>
    );
}
