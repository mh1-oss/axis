import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

export default function Inventory() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [importing, setImporting] = useState(false);

    // Missing State added
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        unit: 'pcs',
        cost_price: 0,
        selling_price: 0,
        stock_quantity: 0
    });

    const fetchMaterials = async () => {
        setLoading(true);
        const { data: materialsData, error: matError } = await supabase
            .from('materials')
            .select('*')
            .order('name');

        if (matError) console.error('Error fetching materials:', matError);
        setMaterials(materialsData || []);
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMaterials();
    }, []);

    const handleOpenImportModal = async () => {
        setImporting(true);
        // Fetch products from website
        const { data: productsData, error } = await supabase
            .from('products')
            .select('*')
            .order('title');

        if (error) {
            console.error('Error fetching products:', error);
            alert('Error fetching products');
        } else {
            setAvailableProducts(productsData || []);
            setIsImportModalOpen(true);
        }
        setImporting(false);
    };

    const handleImportProduct = async (product) => {
        const confirmMsg = `Import "${product.title}" into Inventory? \nThis will create a new independent inventory item.`;
        if (!window.confirm(confirmMsg)) return;

        const newMaterial = {
            name: product.title,
            description: product.description || product.category || '',
            unit: 'pcs',
            cost_price: product.cost_price || 0,
            selling_price: product.selling_price || 0,
            stock_quantity: product.stock_quantity || 0,
        };

        const { error } = await supabase.from('materials').insert([newMaterial]);
        if (error) {
            console.error('Error importing product:', error);
            alert('Error importing product: ' + error.message);
        } else {
            alert('Product imported successfully!');
            fetchMaterials();
            setIsImportModalOpen(false);
        }
    };

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                unit: item.unit || 'pcs',
                cost_price: item.cost_price || 0,
                selling_price: item.selling_price || 0,
                stock_quantity: item.stock_quantity || 0
            });
        } else {
            setFormData({
                name: '',
                description: '',
                unit: 'pcs',
                cost_price: 0,
                selling_price: 0,
                stock_quantity: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;

        const { error } = await supabase.from('materials').delete().eq('id', item.id);
        if (error) {
            console.error('Error deleting material:', error);
            alert('Error deleting material: ' + error.message);
        } else {
            fetchMaterials();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingItem) {
            const { error } = await supabase.from('materials').update(formData).eq('id', editingItem.id);
            if (error) {
                alert('Error updating material: ' + error.message);
                return;
            }
        } else {
            const { error } = await supabase.from('materials').insert([formData]);
            if (error) {
                alert('Error inserting material: ' + error.message);
                return;
            }
        }

        setIsModalOpen(false);
        fetchMaterials();
    };

    const filteredMaterials = materials.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(search.toLowerCase()))
    );

    // Summary stats
    const totalItems = materials.length;
    const totalStockValue = materials.reduce((sum, m) => sum + (m.selling_price || 0) * (m.stock_quantity || 0), 0);
    const totalCostValue = materials.reduce((sum, m) => sum + (m.cost_price || 0) * (m.stock_quantity || 0), 0);
    const lowStockItems = materials.filter(m => (m.stock_quantity || 0) <= 5).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display uppercase">Inventory</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleOpenImportModal}
                        disabled={importing}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-gray-300 dark:border-gray-600"
                    >
                        <span className="material-icons-outlined text-[20px]">cloud_download</span>
                        Import from Website
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-primary hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                    >
                        <span className="material-icons-outlined text-[20px]">add</span>
                        Add Material
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark p-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalItems}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark p-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Value</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">${totalStockValue.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark p-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost Value</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${totalCostValue.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark p-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Low Stock</p>
                    <p className={`text-2xl font-bold mt-1 ${lowStockItems > 0 ? 'text-orange-600' : 'text-gray-900 dark:text-white'}`}>{lowStockItems}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
                <div className="p-4 border-b border-border-light dark:border-border-dark">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-icons-outlined text-gray-400 text-[20px]">search</span>
                        </span>
                        <input
                            type="text"
                            placeholder="Search materials..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 w-full md:w-80 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-black/20 border-b border-border-light dark:border-border-dark">
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Selling</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
                            ) : filteredMaterials.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <span className="material-icons-outlined text-4xl text-gray-300 dark:text-gray-600 block mb-2">inventory_2</span>
                                        <p className="text-gray-500 dark:text-gray-400">No materials found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredMaterials.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                                            {item.description && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{item.description}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.unit}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">${item.cost_price?.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">${item.selling_price?.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-medium ${(item.stock_quantity || 0) <= 5 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {item.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <span className="material-icons-outlined text-lg">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                    title="Delete"
                                                >
                                                    <span className="material-icons-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-xl w-full max-w-md p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white uppercase">
                                {editingItem ? 'Edit Material' : 'Add Material'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Optional description" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                                    <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent">
                                        <option value="pcs">pcs</option>
                                        <option value="m2">m²</option>
                                        <option value="m">meter</option>
                                        <option value="kg">kg</option>
                                        <option value="set">set</option>
                                        <option value="liter">liter</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Qty</label>
                                    <input type="number" min="0" step="1" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }} value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value ? parseInt(e.target.value, 10) : '' })} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost Price ($) *</label>
                                    <input required type="number" min="0" step="any" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} value={formData.cost_price} onChange={e => setFormData({ ...formData, cost_price: e.target.value ? parseFloat(e.target.value) : '' })} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price ($) *</label>
                                    <input required type="number" min="0" step="any" onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} value={formData.selling_price} onChange={e => setFormData({ ...formData, selling_price: e.target.value ? parseFloat(e.target.value) : '' })} className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors shadow-sm">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-xl w-full max-w-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between mb-5 flex-shrink-0">
                            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white uppercase">
                                Import from Website Products
                            </h3>
                            <button onClick={() => setIsImportModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2">
                            {availableProducts.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No products found on website.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {availableProducts.map(product => {
                                        const isImported = materials.some(m => m.name === product.title);
                                        return (
                                            <div key={product.id} className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{product.title}</p>
                                                    <p className="text-xs text-gray-500">{product.category}</p>
                                                </div>
                                                <button
                                                    onClick={() => !isImported && handleImportProduct(product)}
                                                    disabled={isImported}
                                                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${isImported
                                                        ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 cursor-not-allowed opacity-75'
                                                        : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                                                        }`}
                                                >
                                                    {isImported ? 'Imported' : 'Import'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
