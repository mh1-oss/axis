/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        phone: '',
        email: '',
        address: '',
        facebook_url: '',
        instagram_url: '',
        linkedin_url: '',
        map_url: '',
        company_name: 'AXIS',
        company_tagline: 'Aluminum & Glass Solutions',
        website_url: '',
        exchange_rate: 1500,
        terms_text: '',
        thank_you_text: 'Thank you for your business!',
        show_dimensions: true,
        show_logo: true,
        currency_symbol: '$'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"

            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            // Check if row exists
            const { data: existing } = await supabase
                .from('site_settings')
                .select('id')
                .single();

            let result;
            if (existing) {
                result = await supabase
                    .from('site_settings')
                    .update(newSettings)
                    .eq('id', existing.id)
                    .select()
                    .single();
            } else {
                result = await supabase
                    .from('site_settings')
                    .insert([newSettings])
                    .select()
                    .single();
            }

            if (result.error) throw result.error;
            setSettings(result.data);
            return { success: true };
        } catch (error) {
            console.error('Error updating settings:', error.message);
            return { success: false, error: error.message };
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
}
