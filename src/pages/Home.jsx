import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
    const { t } = useLanguage();

    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Hero Section */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Modern corporate building with sleek aluminum facade"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1BUX7LDPmdJkcBSzbnFDJpXn9_aJj4ne7LfKLP0oEQz6ayP1yhjS9HUS1VnjEADcPsAxfK_8qq7kp4Eq0U46oKFKe1KkfHgT6Jso6cssRRJVHUrnOu6obVtmvA9384FMVSdacpBIUZHe3ozZlXxp65lO6vJaAbrhN1Y6VIQk7zr73JF60-11jCG2LXkrbKGgdge65a8Xifv3ottVhE5G_JN_t_ZUGCsHLgmUQG2j3UufyElngOiZ9_HbXYv2U27f_pjgFr390R2dn"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
                </div>
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm md:text-lg mb-4">
                        Axis Aluminum
                    </h2>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white uppercase tracking-tight leading-none mb-6">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        {t('heroSubtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/projects"
                            className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-sm transition-all shadow-xl hover:shadow-2xl flex items-center justify-center group"
                        >
                            {t('explore')}
                            <span className="material-icons-outlined ml-2 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1 rtl:rotate-180">arrow_forward</span>
                        </Link>
                        <Link
                            to="/products"
                            className="border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center"
                        >
                            {t('catalog')}
                        </Link>
                    </div>
                </div>
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white opacity-70">
                    <a href="#services" className="cursor-pointer">
                        <span className="material-icons-outlined text-4xl">keyboard_arrow_down</span>
                    </a>
                </div>
            </header>

            {/* Services Section */}
            <section id="services" className="py-24 bg-background-light dark:bg-background-dark relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm block mb-2">{t('ourExpertise')}</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white uppercase">{t('servicesTitle')}</h2>
                        <div className="h-1 w-20 bg-primary mx-auto mt-6" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: 'window', title: t('aluminumWindows'), desc: t('aluminumWindowsDesc') },
                            { icon: 'meeting_room', title: t('modernDoors'), desc: t('modernDoorsDesc') },
                            { icon: 'apartment', title: t('curtainWalls'), desc: t('curtainWallsDesc') },
                            { icon: 'architecture', title: t('customFab'), desc: t('customFabDesc') },
                        ].map((service) => (
                            <div key={service.title} className="group relative bg-surface-light dark:bg-surface-dark p-8 border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-xl rounded-sm">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-icons-outlined text-6xl text-primary">{service.icon}</span>
                                </div>
                                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-sm flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                                    <span className="material-icons-outlined text-3xl text-gray-700 dark:text-gray-300 group-hover:text-white">{service.icon}</span>
                                </div>
                                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 uppercase">{service.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">{service.desc}</p>
                                <Link to="/products" className="inline-flex items-center text-primary text-sm font-bold uppercase tracking-wider group-hover:text-red-700">
                                    {t('details')} <span className="material-icons-outlined text-sm ml-1 rtl:rotate-180">chevron_right</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Project */}
            <section className="py-0 relative bg-gray-900 dark:bg-black">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-96 md:h-auto">
                        <img
                            alt="Detail of aluminum cladding"
                            className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCTpJo_4yfYkr2wMpelVC0tu16e6piqA_JXL9H7Dxpo6ZLFlPNmorO3Etm0fClTtFZVvjTc-1aJ9L0ogPhOqevj_CnSLUcbXjrsWAff6EOmQ_noqf5Cl_hDJwMMwgX-8fKxBuZYacXgAiznmpOzqWENzwmEgEwDsvEFLWzMRO3wRhRWVUs2-RUHWZQBeUjhH32RZg_uyoQKbMiyhRhd4xxVB2uFiBqcLI8FuQiv55T1t7pPDYLjVRRqO5CpjdvZF8lvQUNWHAcvEft"
                        />
                    </div>
                    <div className="p-12 md:p-24 flex flex-col justify-center items-start">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4">{t('latestProject')}</span>
                        <h3 className="text-3xl md:text-4xl font-display font-bold text-white uppercase mb-6">The Onyx Tower</h3>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Featuring 40,000 sq. ft. of our signature Series-X curtain wall system and bespoke aluminum louvers.
                        </p>
                        <Link to="/projects" className="text-white border-b border-primary pb-1 hover:text-primary transition-colors uppercase tracking-widest text-sm font-semibold">
                            {t('viewCaseStudy')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-200 dark:divide-gray-800 rtl:divide-x-reverse">
                        {[
                            { value: '25+', label: t('yearsExp') },
                            { value: '500+', label: t('projectsComp') },
                            { value: '100%', label: t('satisfaction') },
                            { value: '50', label: t('teamMembers') },
                        ].map(stat => (
                            <div key={stat.label} className="p-4">
                                <div className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                                <div className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
