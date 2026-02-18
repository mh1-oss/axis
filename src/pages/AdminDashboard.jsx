import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { useSettings } from '../context/SettingsContext';

import { supabase } from '../supabase';

const EMPTY_PROJECT = { title: '', category: 'Commercial', location: '', image_url: '', description: '', catalog_url: '', is_featured: false };
const EMPTY_PRODUCT = { title: '', category: 'Residential', image_url: '', description: '', catalog_url: '' };

export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const {
        projects, addProject, updateProject, deleteProject,
        products, addProduct, updateProduct, deleteProduct,
    } = usePosts();
    const { settings, updateSettings } = useSettings();

    const [activeTab, setActiveTab] = useState('projects');
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_PROJECT);
    const [settingsData, setSettingsData] = useState(settings);
    const [messages, setMessages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const isProjects = activeTab === 'projects';
    const isSettings = activeTab === 'settings';
    const isInbox = activeTab === 'inbox';
    const items = isProjects ? projects : products;

    useEffect(() => {
        if (activeTab === 'inbox') {
            fetchMessages();
        }
    }, [activeTab]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching messages:', error);
        else setMessages(data || []);
    };

    const handleDeleteMessage = async (id) => {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting message');
        } else {
            setMessages(prev => prev.filter(m => m.id !== id));
        }
    };

    // Sync settings data when loaded
    useEffect(() => {
        if (settings) setSettingsData(settings);
    }, [settings]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const resetForm = () => {
        setFormData(isProjects ? EMPTY_PROJECT : EMPTY_PRODUCT);
        setEditingId(null);
        setShowForm(false);
    };

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        if (tab !== 'settings') {
            resetForm();
            setDeleteConfirm(null);
        }
    };

    const handleAdd = () => {
        setFormData(isProjects ? EMPTY_PROJECT : EMPTY_PRODUCT);
        setEditingId(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setFormData({ ...item });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (isProjects) deleteProject(id);
        else deleteProduct(id);
        setDeleteConfirm(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let result;

        if (editingId) {
            if (isProjects) result = await updateProject(editingId, formData);
            else result = await updateProduct(editingId, formData);
        } else {
            if (isProjects) result = await addProject(formData);
            else result = await addProduct(formData);
        }

        if (result.success) {
            resetForm();
            alert(editingId ? 'Item updated successfully' : 'Item added successfully');
        } else {
            alert('Error: ' + result.error);
            console.error('Operation failed:', result.error);
        }
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        const result = await updateSettings(settingsData);
        if (result.success) {
            alert('Settings updated successfully');
        } else {
            alert('Error updating settings: ' + result.error);
        }
    };

    const projectCategories = ['Commercial', 'Residential', 'Industrial'];
    const productCategories = ['Residential', 'Commercial', 'Custom'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Admin Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <svg fill="none" height="28" viewBox="0 0 32 32" width="28" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 26L14 6H18L26 26" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" className="text-gray-900 dark:text-white" />
                                <path d="M10 26L14 16" stroke="#D32F2F" strokeLinecap="round" strokeWidth="3" />
                            </svg>
                            <span className="text-xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-tighter">AXIS</span>
                        </div>
                        <span className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1"
                        >
                            <span className="material-icons-outlined text-lg">visibility</span>
                            View Site
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <span className="material-icons-outlined text-lg">logout</span>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <button
                            onClick={() => handleTabSwitch('projects')}
                            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${isProjects
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <span className="material-icons-outlined text-lg align-middle mr-1">photo_library</span>
                            Projects
                        </button>
                        <button
                            onClick={() => handleTabSwitch('products')}
                            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'products'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <span className="material-icons-outlined text-lg align-middle mr-1">inventory_2</span>
                            Products
                        </button>
                        <button
                            onClick={() => handleTabSwitch('settings')}
                            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${isSettings
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <span className="material-icons-outlined text-lg align-middle mr-1">settings</span>
                            Settings
                        </button>
                        <button
                            onClick={() => handleTabSwitch('inbox')}
                            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${isInbox
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <span className="material-icons-outlined text-lg align-middle mr-1">mail</span>
                            Inbox
                            {messages.length > 0 && <span className="ml-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{messages.length}</span>}
                        </button>
                    </div>
                    <div className="flex-grow" />
                    {(!isSettings && !isInbox) && (
                        <button
                            onClick={handleAdd}
                            className="bg-primary hover:bg-red-700 text-white px-5 py-2.5 rounded-md text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                        >
                            <span className="material-icons-outlined text-lg">add</span>
                            Add {isProjects ? 'Project' : 'Product'}
                        </button>
                    )}
                </div>

                {/* Settings Form */}
                {isSettings && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">Site Settings</h3>
                        <form onSubmit={handleSettingsSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={settingsData.phone || ''}
                                        onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={settingsData.email || ''}
                                        onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Physical Address</label>
                                    <input
                                        type="text"
                                        value={settingsData.address || ''}
                                        onChange={(e) => setSettingsData({ ...settingsData, address: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook URL</label>
                                    <input
                                        type="url"
                                        value={settingsData.facebook_url || ''}
                                        onChange={(e) => setSettingsData({ ...settingsData, facebook_url: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram URL</label>
                                    <input
                                        type="url"
                                        value={settingsData.instagram_url || ''}
                                        onChange={(e) => setSettingsData({ ...settingsData, instagram_url: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                        placeholder="https://instagram.com/yourprofile"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        value={settingsData.linkedin_url || ''}
                                        onChange={(e) => setSettingsData({ ...settingsData, linkedin_url: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Google Maps Embed URL (src only)</label>
                                    <input
                                        type="text"
                                        value={settingsData.map_url || ''}
                                        onChange={(e) => setSettingsData({ ...settingsData, map_url: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Paste ONLY the 'src' attribute from the Google Maps Embed HTML.</p>
                                </div>
                            </div>
                            <div className="flex pt-4">
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-red-700 text-white px-8 py-2.5 rounded-md text-sm font-bold uppercase tracking-wider transition-all"
                                >
                                    Save Settings
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Inbox List */}
                {isInbox && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Messages ({messages.length})</h3>
                            {messages.length > 0 && (
                                <button
                                    onClick={async () => {
                                        if (confirm('Are you sure you want to delete ALL messages? This cannot be undone.')) {
                                            const { error } = await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                                            if (!error) setMessages([]);
                                            else alert('Error deleting messages');
                                        }
                                    }}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                >
                                    Delete All
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">From</th>
                                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Subject</th>
                                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Message</th>
                                        <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {messages.map(msg => (
                                        <tr key={msg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(msg.created_at).toLocaleDateString()} <span className="text-xs">{new Date(msg.created_at).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{msg.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    <a href={`mailto:${msg.email}`} className="hover:text-primary transition-colors">{msg.email}</a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                {msg.subject}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                {msg.message}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a
                                                        href={`mailto:${msg.email}?subject=Re: ${msg.subject}&body=Hi ${msg.name},\n\nRegarding your message:\n"${msg.message}"\n\n`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                                        title="Reply"
                                                    >
                                                        <span className="material-icons-outlined text-lg">reply</span>
                                                    </a>
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                        title="Delete"
                                                    >
                                                        <span className="material-icons-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {messages.length === 0 && (
                            <div className="text-center py-16">
                                <span className="material-icons-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3 block">mark_email_read</span>
                                <p className="text-gray-500 dark:text-gray-400">No messages found.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Add/Edit Form */}
                {((!isSettings && !isInbox) && showForm) && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                                {editingId ? 'Edit' : 'Add New'} {isProjects ? 'Project' : 'Product'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                        placeholder={isProjects ? 'e.g. The Onyx Tower' : 'e.g. Panoramic Sliding Systems'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                    >
                                        {(isProjects ? projectCategories : productCategories).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                {isProjects && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                            <input
                                                type="text"
                                                value={formData.location || ''}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                                placeholder="e.g. Downtown Metropolis"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="flex items-center cursor-pointer mt-6">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_featured || false}
                                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                                />
                                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Featured Project?</span>
                                            </label>
                                        </div>
                                    </>
                                )}
                                <div className={isProjects ? 'md:col-span-2' : 'md:col-span-2'}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catalog/PDF URL</label>
                                    <input
                                        type="url"
                                        value={formData.catalog_url || ''}
                                        onChange={(e) => setFormData({ ...formData, catalog_url: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                        placeholder="https://example.com/catalog.pdf"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                    placeholder="Brief description..."
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-red-700 text-white px-6 py-2.5 rounded-md text-sm font-bold uppercase tracking-wider transition-all"
                                >
                                    {editingId ? 'Update' : 'Add'} {isProjects ? 'Project' : 'Product'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Items List */}
                {(!isSettings && !isInbox) && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Image</th>
                                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Title</th>
                                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
                                        {isProjects && <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Location</th>}
                                        <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {items.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                    {item.image_url && (
                                                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</span>
                                                    {isProjects && item.is_featured && (
                                                        <span className="ml-2 text-yellow-500 material-icons text-sm" title="Featured">star</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-xs">{item.description}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${item.category === 'Commercial' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    item.category === 'Residential' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                        item.category === 'Industrial' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                                            'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                    }`}>
                                                    {item.category}
                                                </span>
                                            </td>
                                            {isProjects && (
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.location}</td>
                                            )}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-icons-outlined text-lg">edit</span>
                                                    </button>
                                                    {deleteConfirm === item.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 transition-colors"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(item.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                            title="Delete"
                                                        >
                                                            <span className="material-icons-outlined text-lg">delete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {items.length === 0 && (
                            <div className="text-center py-16">
                                <span className="material-icons-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3 block">inbox</span>
                                <p className="text-gray-500 dark:text-gray-400">No {isProjects ? 'projects' : 'products'} yet. Click "Add" to create one.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
