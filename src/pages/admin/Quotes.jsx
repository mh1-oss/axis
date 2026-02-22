/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Link } from 'react-router-dom';

export default function Quotes() {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, approved, pending, cancelled
    const [barcodeInput, setBarcodeInput] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalProfit: 0,
        pendingQuotes: 0,
        approvedQuotes: 0
    });

    const calculateStats = (data) => {
        const activeData = data.filter(q => q.status !== 'cancelled');
        const approvedData = activeData.filter(q => q.status === 'approved');
        const pending = activeData.filter(q => q.status === 'draft' || q.status === 'sent');

        const totalSales = approvedData.reduce((sum, q) => sum + (Number(q.total_amount) || 0), 0);
        const totalCost = approvedData.reduce((sum, q) => sum + (Number(q.total_cost) || 0), 0);

        setStats({
            totalSales,
            totalProfit: totalSales - totalCost,
            pendingQuotes: pending.length,
            approvedQuotes: approvedData.length
        });
    };

    const fetchQuotes = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('quotes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching quotes:', error);
        } else {
            setQuotes(data || []);
            calculateStats(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchQuotes();
    }, []);



    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return;
        const { error } = await supabase.from('quotes').delete().eq('id', id);
        if (error) console.error('Error deleting quote:', error);
        else fetchQuotes();
    };

    const handleBulkDelete = async (statusToDelete) => {
        const quotesToDelete = quotes.filter(q => {
            if (statusToDelete === 'cancelled') return q.status === 'cancelled';
            if (statusToDelete === 'pending') return ['draft', 'sent'].includes(q.status);
            return false;
        });

        if (quotesToDelete.length === 0) {
            alert(`No ${statusToDelete} invoices found to delete.`);
            return;
        }

        if (!window.confirm(`Are you sure you want to PERMANENTLY delete ALL ${quotesToDelete.length} ${statusToDelete} invoices? This action cannot be undone.`)) return;

        setLoading(true);
        try {
            const idsToDelete = quotesToDelete.map(q => q.id);
            const { error } = await supabase.from('quotes').delete().in('id', idsToDelete);

            if (error) throw error;
            fetchQuotes();
        } catch (err) {
            console.error('Error in bulk delete:', err);
            alert('Failed to delete invoices.');
            setLoading(false);
        }
    };

    const handleBarcodeSubmit = async (e) => {
        e.preventDefault();
        if (!barcodeInput.trim() || isCancelling) return;

        setIsCancelling(true);
        try {
            // Find the quote
            const { data: quoteData, error: quoteError } = await supabase
                .from('quotes')
                .select('*')
                .eq('ref_number', barcodeInput.trim())
                .single();

            if (quoteError || !quoteData) {
                alert('Invoice not found with this barcode.');
                setIsCancelling(false);
                return;
            }

            if (quoteData.status === 'cancelled') {
                alert('This invoice is already cancelled.');
                setBarcodeInput('');
                setIsCancelling(false);
                return;
            }

            // Fetch quote items
            const { data: items, error: itemsError } = await supabase
                .from('quote_items')
                .select('*')
                .eq('quote_id', quoteData.id);

            if (!itemsError && items && items.length > 0) {
                // Return stock for each item
                for (const item of items) {
                    if (item.material_id) {
                        const { data: matData } = await supabase
                            .from('materials')
                            .select('stock_quantity')
                            .eq('id', item.material_id)
                            .single();

                        if (matData) {
                            await supabase
                                .from('materials')
                                .update({ stock_quantity: (matData.stock_quantity || 0) + (item.quantity || 0) })
                                .eq('id', item.material_id);
                        }
                    }
                }
            }

            // Mark quote as cancelled
            await supabase.from('quotes').update({ status: 'cancelled' }).eq('id', quoteData.id);

            alert(`Invoice ${quoteData.ref_number} cancelled and items returned to stock successfully.`);
            setBarcodeInput('');
            fetchQuotes();

        } catch (err) {
            console.error('Error processing barcode cancellation:', err);
            alert('An error occurred during cancellation.');
        } finally {
            setIsCancelling(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
            sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            cancelled: 'bg-gray-800 text-gray-300 dark:bg-gray-900/50 dark:text-gray-500 line-through',
        };
        return styles[status] || styles.draft;
    };

    const filteredQuotes = quotes.filter(quote => {
        // Status Filter
        if (filterStatus === 'approved' && quote.status !== 'approved') return false;
        if (filterStatus === 'pending' && !['draft', 'sent'].includes(quote.status)) return false;
        if (filterStatus === 'cancelled' && quote.status !== 'cancelled') return false;
        if (filterStatus === 'all' && quote.status === 'cancelled') return false; // Hide cancelled from 'All' by default to keep it clean

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const customer = (quote.customer_name || '').toLowerCase();
            const project = (quote.project_name || '').toLowerCase();
            const ref = (quote.ref_number || '').toLowerCase();
            if (!customer.includes(query) && !project.includes(query) && !ref.includes(query)) return false;
        }
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display uppercase">Sales & Quotes</h2>
                <Link
                    to="/admin/accounting/quotes/new"
                    className="bg-primary hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                >
                    <span className="material-icons-outlined text-[20px]">add</span>
                    New Quote
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-icons-outlined text-gray-400 text-[20px]">payments</span>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Sales</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-icons-outlined text-gray-400 text-[20px]">trending_up</span>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Profit</p>
                    </div>
                    <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${stats.totalProfit.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-icons-outlined text-gray-400 text-[20px]">pending_actions</span>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingQuotes}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-icons-outlined text-gray-400 text-[20px]">check_circle</span>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Approved</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{stats.approvedQuotes}</p>
                </div>
            </div>

            {/* Barcode Cancellation Widget */}
            <div className="bg-white dark:bg-surface-dark p-4 sm:p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="w-full sm:w-auto">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                        <span className="material-icons-outlined text-primary text-xl">qr_code_scanner</span>
                        Quick Cancel & Return to Stock
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
                        Scan the invoice barcode (or type the reference number) here. The invoice will be cancelled and its items will automatically return to the inventory stock.
                    </p>
                </div>
                <form onSubmit={handleBarcodeSubmit} className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative w-full sm:w-64">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">qr_code</span>
                        <input
                            type="text"
                            placeholder="Scan Barcode (e.g. AXIS-123)"
                            value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value)}
                            disabled={isCancelling}
                            className="w-full pl-9 pr-4 py-2 border-2 border-primary/30 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none dark:text-white uppercase"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!barcodeInput || isCancelling}
                        className="bg-primary hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm whitespace-nowrap"
                    >
                        {isCancelling ? 'Processing...' : 'Cancel Invoice'}
                    </button>
                </form>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto whitespace-nowrap hide-scrollbar">
                    {['all', 'pending', 'approved', 'cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilterStatus(tab)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${filterStatus === tab
                                ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {filterStatus === 'cancelled' && (
                        <button
                            onClick={() => handleBulkDelete('cancelled')}
                            className="w-full sm:w-auto px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-outlined text-lg">delete_sweep</span>
                            Delete All Cancelled
                        </button>
                    )}
                    {filterStatus === 'pending' && (
                        <button
                            onClick={() => handleBulkDelete('pending')}
                            className="w-full sm:w-auto px-4 py-2 border border-orange-200 dark:border-orange-900/50 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-outlined text-lg">delete_sweep</span>
                            Delete All Pending
                        </button>
                    )}

                    <div className="relative w-full sm:w-64">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Search sales..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-black/20 border-b border-border-light dark:border-border-dark">
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ref #</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
                            ) : quotes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <span className="material-icons-outlined text-4xl text-gray-300 dark:text-gray-600 block mb-2">description</span>
                                        <p className="text-gray-500 dark:text-gray-400">No quotes yet. Create one to get started.</p>
                                    </td>
                                </tr>
                            ) : filteredQuotes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No sales match your current filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredQuotes.map((quote) => (
                                    <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link to={`/admin/accounting/quotes/${quote.id}`} className={`text-sm font-semibold hover:underline ${quote.status === 'cancelled' ? 'text-gray-500 line-through' : 'text-primary'}`}>
                                                {quote.ref_number || 'N/A'}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{quote.customer_name}</div>
                                            {quote.project_name && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{quote.project_name}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(quote.quote_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-bold">
                                            ${Number(quote.total_amount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadge(quote.status)}`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    to={`/admin/accounting/quotes/${quote.id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <span className="material-icons-outlined text-lg">edit</span>
                                                </Link>
                                                {quote.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleDelete(quote.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                        title="Delete"
                                                    >
                                                        <span className="material-icons-outlined text-lg">delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
