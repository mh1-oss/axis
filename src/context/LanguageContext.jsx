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
                details: 'Details',
                // Projects Page
                ourProjects: 'Our',
                projectsTitle: 'Projects',
                projectsSubtitle: 'Explore our portfolio of cutting-edge aluminum fabrication. From towering skyscrapers to bespoke residential villas, we go beyond the frame.',
                allProjects: 'All Projects',
                commercial: 'Commercial',
                residential: 'Residential',
                industrial: 'Industrial',
                noProjects: 'No projects found in this category.',
                // Products Page
                premiumSystems: 'Premium Aluminum Systems',
                productsSubtitle: 'Engineered for performance, designed for elegance. Explore our range of cutting-edge aluminum fabrication solutions for modern spaces.',
                all: 'All',
                custom: 'Custom',
                searchPlaceholder: 'Search products...',
                viewDetails: 'View Details',
                inquire: 'Inquire',
                noProducts: 'No products found matching your criteria.',
                // Contact Page
                getInTouch: 'Get In Touch',
                contactSubtitle: 'Have a project in mind? Reach out to our team of experts for consultations, quotes, or general inquiries.',
                sendMessage: 'Send us a Message',
                fullName: 'Full Name',
                emailAddress: 'Email Address',
                subject: 'Subject',
                message: 'Message',
                sendBtn: 'Send Message',
                messageSent: "Message sent successfully! We'll get back to you soon.",
                office: 'Our Office',
                phoneFax: 'Phone & Fax',
                email: 'Email',
                generalInquiry: 'General Inquiry',
                requestQuote: 'Request a Quote',
                projectConsultation: 'Project Consultation',
                careers: 'Careers',
                johnDoe: 'John Doe',
                howCanWeHelp: 'How can we help you?',
                aboutUsTitle: 'Who We Are',
                aboutUsDesc: 'Axis Aluminum is a leading provider of architectural aluminum solutions. With over 20 years of experience, we specialize in transforming skylines through precision engineering and innovative design. Our commitment to quality and sustainability makes us the preferred partner for commercial and residential projects alike.',
                // Why Choose Us
                whyChooseUs: 'Why Choose Axis?',
                qualityTitle: 'Premium Quality',
                qualityDesc: 'We use only the highest grade aluminum and glass for durability and long-term performance.',
                designTitle: 'Modern Design',
                designDesc: 'Sleek, contemporary aesthetics that elevate any architectural vision with a touch of luxury.',
                executionTitle: 'Fast Execution',
                executionDesc: 'Efficient project management and advanced installation techniques ensuring timely delivery.',
                supportTitle: 'Warranty & Support',
                supportDesc: 'Comprehensive warranty on all our products with dedicated after-sales support.'
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
                servicesTitle: 'هندسة للتميز',
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
                details: 'التفاصيل',
                // Projects Page (Updated)
                ourProjects: '',
                projectsTitle: 'مشاريعنا',
                projectsSubtitle: 'استكشف محفظتنا من تصنيع الألمنيوم المتطور. من ناطحات السحاب الشاهقة إلى الفلل السكنية المخصصة، نحن نتجاوز الإطار.',
                allProjects: 'كل المشاريع',
                commercial: 'تجاري',
                residential: 'سكني',
                industrial: 'صناعي',
                noProjects: 'لا توجد مشاريع في هذه الفئة.',
                // Products Page
                premiumSystems: 'أنظمة ألمنيوم متميزة',
                productsSubtitle: 'مصممة للأداء، مصممة للأناقة. استكشف مجموعتنا من حلول تصنيع الألمنيوم المتطورة للمساحات الحديثة.',
                all: 'الكل',
                custom: 'مخصص',
                searchPlaceholder: 'بحث عن المنتجات...',
                viewDetails: 'عرض التفاصيل',
                inquire: 'استفسار',
                noProducts: 'لا توجد منتجات مطابقة لبحثك.',
                // Contact Page
                getInTouch: 'تواصل معنا',
                contactSubtitle: 'هل لديك مشروع في ذهنك؟ تواصل مع فريق خبرائنا للاستشارات، عروض الأسعار، أو الاستفسارات العامة.',
                sendMessage: 'أرسل لنا رسالة',
                fullName: 'الاسم الكامل',
                emailAddress: 'البريد الإلكتروني',
                subject: 'الموضوع',
                message: 'الرسالة',
                sendBtn: 'إرسال الرسالة',
                messageSent: 'تم إرسال الرسالة بنجاح! سنرد عليك قريباً.',
                office: 'مكتبنا',
                phoneFax: 'الهاتف والفاكس',
                email: 'البريد الإلكتروني',
                generalInquiry: 'استفسار عام',
                requestQuote: 'طلب عرض سعر',
                projectConsultation: 'استشارة مشروع',
                careers: 'وظائف',
                johnDoe: 'الاسم',
                howCanWeHelp: 'كيف يمكننا مساعدتك؟',
                aboutUsTitle: 'من نحن',
                aboutUsDesc: 'تعتبر أكسيس للألمنيوم شركة رائدة في مجال حلول الألمنيوم المعماري. مع أكثر من 20 عاماً من الخبرة، نختص في تحويل الآفاق من خلال الهندسة الدقيقة والتصميم المبتكر. التزامنا بالجودة والاستدامة يجعلنا الشريك المفضل للمشاريع التجارية والسكنية على حد سواء.',
                // Why Choose Us
                whyChooseUs: 'لماذا تختار أكسيس؟',
                qualityTitle: 'جودة عالية',
                qualityDesc: 'نستخدم أجود أنواع الألمنيوم والزجاج لضمان المتانة والأداء الطويل الأمد.',
                designTitle: 'تصميم عصري',
                designDesc: 'جماليات عصرية وأنيقة ترتقي بأي رؤية معمارية وتضيف لمسة فخامة.',
                executionTitle: 'سرعة التنفيذ',
                executionDesc: 'إدارة مشاريع فعالة وتقنيات تركيب متطورة تضمن التسليم في الوقت المحدد.',
                supportTitle: 'ضمان ودعم',
                supportDesc: 'ضمان شامل على جميع منتجاتنا مع خدمة دعم مخصصة لما بعد البيع.'
            }
        };
        const val = translations[language][key];
        return val !== undefined ? val : key;
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
