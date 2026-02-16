import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // Default to 'en' if no preference is saved
    const [language, setLanguage] = useState(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('language')) {
            return localStorage.getItem('language');
        }
        return 'en';
    });

    useEffect(() => {
        // Update document attributes based on language
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        document.documentElement.dir = dir;
        localStorage.setItem('language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    };

    // Text content for simple translations (can be expanded)
    const t = (key) => {
        const translations = {
            en: {
                home: 'Home',
                products: 'Products',
                projects: 'Projects',
                contact: 'Contact',
                getQuote: 'Get a Quote',
                admin: 'Admin',
                heroTitle: 'Beyond The Frame',
                heroSubtitle: 'Precision engineering meets architectural vision. We craft premium aluminum facades that redefine modern skylines.',
                explore: 'Explore Our Work',
                catalog: 'View Catalog',
                servicesTitle: 'Engineered for Excellence',
                ourExpertise: 'Our Expertise',
                latestProject: 'Latest Project',
                viewCaseStudy: 'View Case Study',
                yearsExp: 'Years Experience',
                projectsComp: 'Projects Completed',
                satisfaction: 'Satisfaction',
                teamMembers: 'Team Members',
                rights: 'All rights reserved.',
                aluminumWindows: 'Aluminum Windows',
                aluminumWindowsDesc: 'High-performance thermal break systems designed for energy efficiency and sleek aesthetics.',
                modernDoors: 'Modern Doors',
                modernDoorsDesc: 'Secure, durable entryways including sliding, folding, and pivot systems for commercial use.',
                curtainWalls: 'Curtain Walls',
                curtainWallsDesc: 'Structural glazing solutions that create seamless glass facades for skyscrapers and offices.',
                customFab: 'Custom Fabrication',
                customFabDesc: 'Bespoke aluminum solutions tailored to unique architectural requirements and designs.',
                details: 'Details'
            },
            ar: {
                home: 'الرئيسية',
                products: 'المنتجات',
                projects: 'المشاريع',
                contact: 'اتصل بنا',
                getQuote: 'اطلب عرض سعر',
                admin: 'أدمن',
                heroTitle: 'ما وراء الإطار',
                heroSubtitle: 'الهندسة الدقيقة تلتقي بالرؤية المعمارية. نصنع واجهات ألمنيوم متميزة تعيد تعريف الأفق الحديث.',
                explore: 'استكشف أعمالنا',
                catalog: 'تصفح الكتالوج',
                servicesTitle: 'هنجسة للتميز',
                ourExpertise: 'خبرتنا',
                latestProject: 'أحدث المشاريع',
                viewCaseStudy: 'عرض دراسة الحالة',
                yearsExp: 'سنوات خبرة',
                projectsComp: 'مشروع مكتمل',
                satisfaction: 'رضا العملاء',
                teamMembers: 'عضو في الفريق',
                rights: 'جميع الحقوق محفوظة.',
                aluminumWindows: 'نوافذ ألمنيوم',
                aluminumWindowsDesc: 'أنظمة عزل حراري عالية الأداء مصممة لكفاءة الطاقة والجماليات الأنيقة.',
                modernDoors: 'أبواب حديثة',
                modernDoorsDesc: 'مداخل آمنة ودائمة بما في ذلك الأنظمة المنزلقة والقابلة للطي والمحورية للاستخدام التجاري.',
                curtainWalls: 'واجهات زجاجية',
                curtainWallsDesc: 'حلول الزجاج الهيكلي التي تخلق واجهات زجاجية سلسة لناطحات السحاب والمكاتب.',
                customFab: 'تصنيع مخصص',
                customFabDesc: 'حلول ألمنيوم مخصصة مصممة حسب المتطلبات المعمارية والتصاميم الفريدة.',
                details: 'التفاصيل'
            }
        };
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
