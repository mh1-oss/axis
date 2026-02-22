/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';

const DEFAULT_SETTINGS = {
    company_name: 'AXIS',
    company_tagline: 'Aluminum & Glass Solutions',
    website_url: '',
    exchange_rate: 1500,
    terms_text: '',
    thank_you_text: 'Thank you for your business!',
    show_dimensions: true,
    show_logo: true,
    currency_symbol: '$',
};

export function getPrintSettings() {
    try {
        const saved = localStorage.getItem('print_settings');
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export default function PrintSettings() {
    const [settings, setSettings] = useState(() => getPrintSettings());
    const [saved, setSaved] = useState(false);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem('print_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.removeItem('print_settings');
        setSaved(false);
    };

    const inputClass = "w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display uppercase">Print Settings</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customize how your quotes and reports look when printed</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                    >
                        <span className="material-icons-outlined text-lg">{saved ? 'check' : 'save'}</span>
                        {saved ? 'Saved!' : 'Save Settings'}
                    </button>
                </div>
            </div>

            {/* Company Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="material-icons-outlined text-lg text-primary">business</span>
                    Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Company Name</label>
                        <input className={inputClass} value={settings.company_name} onChange={e => handleChange('company_name', e.target.value)} placeholder="Your Company" />
                    </div>
                    <div>
                        <label className={labelClass}>Tagline / Subtitle</label>
                        <input className={inputClass} value={settings.company_tagline} onChange={e => handleChange('company_tagline', e.target.value)} placeholder="What you do" />
                    </div>
                    <div>
                        <label className={labelClass}>Website URL</label>
                        <input className={inputClass} value={settings.website_url} onChange={e => handleChange('website_url', e.target.value)} placeholder="www.yourcompany.com" />
                    </div>
                    <div>
                        <label className={labelClass}>Exchange Rate (IQD per USD)</label>
                        <input type="number" className={inputClass} value={settings.exchange_rate} onChange={e => handleChange('exchange_rate', Number(e.target.value))} placeholder="1500" />
                    </div>
                </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="material-icons-outlined text-lg text-primary">gavel</span>
                    Terms & Conditions
                </h3>
                <div>
                    <label className={labelClass}>General terms that appear on all printed quotes</label>
                    <textarea className={`${inputClass} resize-none`} rows="4" value={settings.terms_text} onChange={e => handleChange('terms_text', e.target.value)} placeholder="e.g., Payment due within 30 days. Prices valid for 10 days. All prices are subject to change..." />
                </div>
            </div>

            {/* Print Options */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="material-icons-outlined text-lg text-primary">print</span>
                    Print Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Currency Symbol</label>
                        <input className={inputClass} value={settings.currency_symbol} onChange={e => handleChange('currency_symbol', e.target.value)} placeholder="$" />
                    </div>
                    <div>
                        <label className={labelClass}>Thank You Message</label>
                        <input className={inputClass} value={settings.thank_you_text} onChange={e => handleChange('thank_you_text', e.target.value)} placeholder="Thank you for your business!" />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <input type="checkbox" id="showDims" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={settings.show_dimensions} onChange={e => handleChange('show_dimensions', e.target.checked)} />
                        <label htmlFor="showDims" className="text-sm text-gray-700 dark:text-gray-300">Show dimensions (W × H) in print</label>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <input type="checkbox" id="showLogo" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" checked={settings.show_logo !== false} onChange={e => handleChange('show_logo', e.target.checked)} />
                        <label htmlFor="showLogo" className="text-sm text-gray-700 dark:text-gray-300">Show Logo in print header</label>
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="material-icons-outlined text-lg text-primary">visibility</span>
                    Header Preview
                </h3>
                <div className="bg-white text-black p-6 rounded border border-gray-200 max-w-lg">
                    <div className="flex justify-between items-start border-b-2 border-red-600 pb-3">
                        <div>
                            <div className="text-2xl font-bold uppercase tracking-tighter">{settings.company_name || 'COMPANY'}</div>
                            <div className="text-xs text-gray-500">{settings.company_tagline}</div>
                            {settings.website_url && <div className="text-[10px] text-gray-400 mt-1">{settings.website_url}</div>}
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-red-600">QUOTE</div>
                            <div className="text-[10px] text-gray-500">Date: {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
