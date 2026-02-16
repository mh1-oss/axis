import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: projectsData, error: projectsError } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (projectsError) throw projectsError;
            if (projectsData) setProjects(projectsData);

            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;
            if (productsData) setProducts(productsData);

        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Projects Operations ---

    const addProject = async (project) => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .insert([project])
                .select()
                .single();

            if (error) throw error;
            setProjects(prev => [data, ...prev]);
            return { success: true };
        } catch (error) {
            console.error('Error adding project:', error.message);
            return { success: false, error: error.message };
        }
    };

    const updateProject = async (id, updatedData) => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .update(updatedData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setProjects(prev => prev.map(p => p.id === id ? data : p));
            return { success: true };
        } catch (error) {
            console.error('Error updating project:', error.message);
            return { success: false, error: error.message };
        }
    };

    const deleteProject = async (id) => {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProjects(prev => prev.filter(p => p.id !== id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting project:', error.message);
            return { success: false, error: error.message };
        }
    };

    // --- Products Operations ---

    const addProduct = async (product) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([product])
                .select()
                .single();

            if (error) throw error;
            setProducts(prev => [data, ...prev]);
            return { success: true };
        } catch (error) {
            console.error('Error adding product:', error.message);
            return { success: false, error: error.message };
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .update(updatedData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setProducts(prev => prev.map(p => p.id === id ? data : p));
            return { success: true };
        } catch (error) {
            console.error('Error updating product:', error.message);
            return { success: false, error: error.message };
        }
    };

    const deleteProduct = async (id) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProducts(prev => prev.filter(p => p.id !== id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error.message);
            return { success: false, error: error.message };
        }
    };

    return (
        <PostsContext.Provider value={{
            projects, addProject, updateProject, deleteProject,
            products, addProduct, updateProduct, deleteProduct,
            loading
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
