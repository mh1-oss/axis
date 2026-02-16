import { createContext, useContext, useState, useEffect } from 'react';

const PostsContext = createContext(null);

const DEFAULT_PROJECTS = [
    {
        id: 1,
        title: 'The Onyx Tower',
        category: 'Commercial',
        location: 'Downtown Metropolis',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANz6T0xcnN4kEEi1H0boINVRIXjYs8q0c2nInJlBsznW08gX6yng6xTBQzf5RUdrGP_d6OIu6mFcqE4pV5uZDCzFTfK5UHtjv_kJKyV24ACGZgzqFdNvAF6vEZJXN9I28LFx8yGvF1Mb9nkebM6ydcKBcVEtGNg02V9Wpejc5kZEtpVZz28uEzuhgFJp4Fh5sGGeFCCouhF8lLR3hMxTI3g0-mE11xQkEEZ6rbl7RXthWarifUekSf-V3521cXPgmLy4iRlBYN1J_4',
        description: 'Modern glass skyscraper facade featuring 40,000 sq. ft. of our signature Series-X curtain wall system.',
    },
    {
        id: 2,
        title: 'Azure Villa',
        category: 'Residential',
        location: 'Coastal Heights',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_SwMuQHSkXERHm086I3aMGiFDn-ZY2E-SoVIpPgUhlorNj6QvVxwJJiESymA3rFJEPqPPAz_YVNoVsmWpBiaimkGf2_pLysdbJ0KUsTgsrztT7qfb5FxIgI0ryYvuyhJ4tQX-zC1AaD-_aER_Qz09UrPU1d7KuBors_A-qydVD5QswM4rI-ZMqAILKO6Ik8XDIvGT-mUqy1nXibEU-qbZR_wOefZAHsjkT-xb-iPG6GRz1gDXRk0mEqIsDImX4RjkKE5d2fn-xBuQ',
        description: 'Modern luxury villa with large aluminum windows and premium bi-fold door systems.',
    },
    {
        id: 3,
        title: 'Nexus Hub',
        category: 'Commercial',
        location: 'Tech Park',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyxGa5-u5qai0puyQxNwXZX6HHnE0ygfiYOC5XVg88M4O4g78jKnZwxcPZbtJGRDkKm7Y2Tw6fhZnsMEq-o4AJ8mvMyVZOM1lQGRTF3kDKgMxL8d-XRcC3R45fdsMjVqCVobyEVjUMmmbvCG-hSu6TiCVNncJhzyN07iiWyZmwBd7oevLH6nKvgDFshwtp0aRxQh6k8cu9UJ6qK4vpbRExn-HXRLwZr-W88aYjSl1Dt-5hvf7IZd63PFMdsL34wpWB74EahAuLDFvp',
        description: 'Interior corporate office glass partitions with acoustic solutions.',
    },
    {
        id: 4,
        title: 'Skyline Residences',
        category: 'Residential',
        location: 'North District',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMbf0A48dsTk2knvdTOpWbOJc9w0fYe8iUf96-6EMLle4Gpb6dWE4CKC84cRV4TpzqAAo1kS3Riwob_3aj0Daana2sGJRVdoTwc-KjKmWG8do9LB3liXzYeB5KDYmOGfe_Vyy6uPUDUatWrtngDrPO5LAonVCg4ANR-VnC3_QEvXRHOoj-yoVpti2EvsyWGoQpCQucLSQPNvtBnLOsixxfR1sXehDknmUvFuLMkYm-LvCvLjd6Zt3J_PhUT-xHowE3dqzVPaedNGO4',
        description: 'High rise apartment complex with state-of-the-art aluminum facade systems.',
    },
    {
        id: 5,
        title: 'ProLogis Center',
        category: 'Industrial',
        location: 'Industrial Zone 4',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW-gQOJmrVWd7H4OrFCgXmX-zkfmg3kMuc4G0U7DTl-t5p02MPcwdxbdNk4kIiqSUtf_PuhzopE-0-cSOyky6r83Dd9XH_32TYHwo_Pbt4yJwqdN7yNumpZ_A0-_rCH9tYi9FCs-sitNpJGOL2nolJDEWfdV5vQvR8TYKRo9qHyIfp5CYjwpv9OgCpGRie8e9yncPoitmppL2Xfv1JybM13JTa_VX603zFnDRQS3vnLKDfZrnPTXUl7sbD9HFO3mxyKeRpS9-C_3E0',
        description: 'Industrial aluminum factory structure with custom fabrication solutions.',
    },
    {
        id: 6,
        title: 'Echo Point Estate',
        category: 'Residential',
        location: 'Valley View',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsPWfXrA7uC1WYzB9FrKlmbbxsBRQYSeqMbqGIRiJL8TGyXdqbH4lVYsaC-80YuT6Qm09jmkeclJu7BJxzRiJOdJEPmCICduIi2fld48HyOaLY9MycR8YccVCB9X7WF7KnQHCod_6jN-GsFKlQIB2yJKp6Kohizmy6jL_rX-AAPFhwvy2BxFaOGdFXgtfzanwDRxk5JTH8AwkvrEKmrT_9c-Pl0DZPkYruq8nbbNzwks6HcusBXp4yRxWF1MuCeSi8-Xs3YKkzPIhj',
        description: 'Minimalist glass balcony railing with premium aluminum finishes.',
    },
    {
        id: 7,
        title: 'The Atrium Mall',
        category: 'Commercial',
        location: 'City Center',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiNbWYB4qKRFSsvLpc0nvE8r4ecFqBmhial7xJmkQmilugvAUyIMJ-C_dKYe6ZqJKwSyUHU4lyWmFBdagUHtJtXG_-qDMe7Aqi5z8-WTEX4p1kxTYorgdoSGb3LudXwbliNQ-S0LdDQVUcPnKpPGdSvabnSBBgIrbKXhXEgJaVLj4tfiHE-q4_XlddZXMDm0khA1ywR8t90UZ8YODexnf9UmAasAJsyvQuq42Qxkulf37_bLfrzzkUZWZHNjGFQo8yIuxcLlW88Gr',
        description: 'Architectural detail of glass roof system with automated venting.',
    },
];

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        title: 'Panoramic Sliding Systems',
        category: 'Residential',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7HRKK7GaYYYj5hh5YK2F6qTeMd9IBW7V1OHLNE2y-PAJlwZciD4NqhgqpHexHf12x86ti2t3GpMyKUd2SSEQNikLETQzSfC0LD-3qpeKR0EOhaEaUo80nHzGjLNix94plZeemHQE6_cvy5088kDwGKKFHlULU8hUspKCiXDKUsYrlGLcM1iy9tQ1GVtKYHQ0JvgDK2dKJ-peMkN0l7kOT9-8CvmXMPQ4cisJEa1_7EGmbaKGw9fZtED4TSbFZAtn8Zq39x8Akll3l',
        description: 'Ultra-slim frames maximizing natural light. Features thermal break technology for superior energy efficiency and seamless indoor-outdoor living.',
    },
    {
        id: 2,
        title: 'Structural Glazing Facades',
        category: 'Commercial',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKk6-ohSGS9h_JetfF0v4CvOKTnfjQ8peZIVkaWO2UVUIKhRcnXtDW7eNr5JbsiycIVfH_M0xZmRoelpn9EVSUXpR9BmRJIYbGMWGtTFE0xy3BeyHpK3BicuoSZ1I3hPKkidj687QDD8SoNxBOUetB0pJPcM3Sf4sV-UBw92P61sGQarqjt6fgeSQlDlBtS7y63nE4RjDJwB5DazNjEwy_PCbFzr2evjbUUmS949eCj6EmOkNksa2Sft3xXUT_tIlhDU2bPzc_pQEQ',
        description: 'High-performance curtain wall systems for commercial towers. Offers exceptional structural integrity and sleek, uninterrupted glass surfaces.',
    },
    {
        id: 3,
        title: 'Casement Windows',
        category: 'Residential',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxOf9rNmTbZMT2ZhyVydb5T3GXUgLrlHyycJEnTWYTK1yuA7G9QWZTgww_ltBaywVuHVobwuoNXIcJllzepCGFvCqAoeE_5eR7rAze3894ZoRhw_tqgOClbBWV-LGbdgGABfwFbV61dyU633DJQosur_o6xMqJTc0QAqcMSUBLePqYmR1UYqUaleO_ydCXIGEd3TcPLWQQWJv0mhb0CPy8oiBSLd7uUE6iXhT4HBX6pmFD8pJijJRgGRefop4ji5MJxmXznO9te7Cp',
        description: 'Versatile and durable aluminum casement windows. Available in various finishes with multi-point locking systems for enhanced security.',
    },
    {
        id: 4,
        title: 'Bi-Fold Door Systems',
        category: 'Residential',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD993Ef9e4THtcXk22nD6HL_0VvFdFRiBxtuLXM1VpgksX0w_meCQ3NK6OHzYV_xAG3OsTImFCjzfauhqhqDgcrjqnB-xTlXlWZ4Xa2siNn2QjO5BnAHcjNEc5mWPSctb3bt1l9f2YgOqvI44VsCVJK_ZJM0UvlZDoapMFc9WASwkCvMm9MTt5YR3eETYb0tx5vPWEJi9C5Gl-vTOtaPh-F7Cp2zvT--QKvgMNPfcw4FlXnR_xfclFdIjhkJ2LpzhHYVYGbOgHwtqG8',
        description: 'Transform your living space with our premium bi-fold doors. Smooth operation, stacking capability, and wide opening configurations.',
    },
    {
        id: 5,
        title: 'Internal Partitions',
        category: 'Commercial',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXa--eIKE1iZESZH1SyH_n0mEokLdq9MnpZgi9d6w_xCqJ8d2GEkkgmoKvBZN3BsHx4beMj0fYzrY5FNmGFmNTsZTPodJK-lCKE0Ez6EFvfycwDbfI8iUMsLyP6hKmiBwCgbvRXMJSfRwDOq3ru-0VRQ248uSYJJJsSYAooiZBnlU4n7T6SBYY6yFVRuuT6V42ucsGyVPgZWEY31tHM7l9fgpwyVt5D0TYkC4AtZ-UNkqh_ZEA8BjX2bzo7s7oAZsQ_0Qoz_mVA6IG',
        description: 'Sleek aluminum and glass partitions for modern offices. Acoustic solutions available for privacy without sacrificing light.',
    },
    {
        id: 6,
        title: 'Skylights & Roof Systems',
        category: 'Custom',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTFdIjfBjRNAE2UgkHbIvexc6LHDtFE1UVcVhMmyMkSTJAAwmivtHxrmnAUhjjOJB_B12wGw2u6GAygsu-psu5hlpsFA1lkA1rNt-RJpIZ6VnqwWkvLuAddTl_SI2opXiROAZhnseK2b51KuDJadp7aomusLu9-miPVdSH8wulwTL6bDCcZdwOlUUQuinu1cX5Q15CSQYYVBB2fZozAuomxYzL-D7HTZ2KCUWhnv_tzXiAMjw-FNGGLRxK1VK8oaQlk3LxYX1ehPf_',
        description: 'Bring the sky inside with our custom aluminum skylights. Robust weatherproofing and automated venting options available.',
    },
];

export function PostsProvider({ children }) {
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem('axis_projects');
        return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    });

    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('axis_products');
        return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    });

    useEffect(() => {
        localStorage.setItem('axis_projects', JSON.stringify(projects));
    }, [projects]);

    useEffect(() => {
        localStorage.setItem('axis_products', JSON.stringify(products));
    }, [products]);

    const addProject = (project) => {
        const newProject = { ...project, id: Date.now() };
        setProjects(prev => [newProject, ...prev]);
    };

    const updateProject = (id, updatedData) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const deleteProject = (id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const addProduct = (product) => {
        const newProduct = { ...product, id: Date.now() };
        setProducts(prev => [newProduct, ...prev]);
    };

    const updateProduct = (id, updatedData) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <PostsContext.Provider value={{
            projects, addProject, updateProject, deleteProject,
            products, addProduct, updateProduct, deleteProduct,
        }}>
            {children}
        </PostsContext.Provider>
    );
}

export function usePosts() {
    const context = useContext(PostsContext);
    if (!context) throw new Error('usePosts must be used within PostsProvider');
    return context;
}
