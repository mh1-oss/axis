import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';

const EMPTY_PROJECT = { title: '', category: 'Commercial', location: '', image: '', description: '' };
const EMPTY_PRODUCT = { title: '', category: 'Residential', image: '', description: '' };

export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const {
        projects, addProject, updateProject, deleteProject,
        products, addProduct, updateProduct, deleteProduct,
    } = usePosts();

    const [activeTab, setActiveTab] = useState('projects');
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_PROJECT);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const isProjects = activeTab === 'projects';
    const items = isProjects ? projects : products;

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
        resetForm();
        setDeleteConfirm(null);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            if (isProjects) updateProject(editingId, formData);
            else updateProduct(editingId, formData);
        } else {
            if (isProjects) addProject(formData);
            else addProduct(formData);
        }
        resetForm();
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
                            Projects ({projects.length})
                        </button>
                        <button
                            onClick={() => handleTabSwitch('products')}
                            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${!isProjects
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <span className="material-icons-outlined text-lg align-middle mr-1">inventory_2</span>
                            Products ({products.length})
                        </button>
                    </div>
                    <div className="flex-grow" />
                    <button
                        onClick={handleAdd}
                        className="bg-primary hover:bg-red-700 text-white px-5 py-2.5 rounded-md text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                    >
                        <span className="material-icons-outlined text-lg">add</span>
                        Add {isProjects ? 'Project' : 'Product'}
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
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
                                )}
                                <div className={isProjects ? '' : 'md:col-span-2'}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                        placeholder="https://example.com/image.jpg"
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
                                                {item.image && (
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</span>
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
            </main>
        </div>
    );
}
