/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { getPrintSettings } from './PrintSettings';

const EXPENSE_CATEGORIES = [
    { value: 'salary', label: 'Salary / رواتب', icon: 'badge' },
    { value: 'rent', label: 'Rent / إيجار', icon: 'home' },
    { value: 'utilities', label: 'Utilities / خدمات', icon: 'bolt' },
    { value: 'supplies', label: 'Supplies / مستلزمات', icon: 'inventory' },
    { value: 'other', label: 'Other / أخرى', icon: 'more_horiz' },
];

export default function Reports() {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [quotes, setQuotes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [expenseForm, setExpenseForm] = useState({
        category: 'other',
        description: '',
        amount: 0,
        expense_date: new Date().toISOString().split('T')[0]
    });

    const printSettings = getPrintSettings();

    const fetchData = async () => {
        setLoading(true);
        const [year, month] = selectedMonth.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];

        // Fetch approved quotes for the month
        const { data: quotesData } = await supabase
            .from('quotes')
            .select('*')
            .gte('quote_date', startDate)
            .lte('quote_date', endDate)
            .eq('status', 'approved');

        // Fetch expenses for the month
        const { data: expensesData } = await supabase
            .from('expenses')
            .select('*')
            .gte('expense_date', startDate)
            .lte('expense_date', endDate)
            .order('expense_date', { ascending: false });

        setQuotes(quotesData || []);
        setExpenses(expensesData || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    // Calculations
    const totalSales = quotes.reduce((sum, q) => sum + (Number(q.total_amount) || 0), 0);
    const totalCost = quotes.reduce((sum, q) => sum + (Number(q.total_cost) || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const grossProfit = totalSales - totalCost;
    const netProfit = grossProfit - totalExpenses;

    const expensesByCategory = EXPENSE_CATEGORIES.map(cat => ({
        ...cat,
        total: expenses.filter(e => e.category === cat.value).reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
        count: expenses.filter(e => e.category === cat.value).length,
    })).filter(c => c.count > 0);

    // Expense CRUD
    const openAddExpense = () => {
        setEditingExpense(null);
        setExpenseForm({ category: 'other', description: '', amount: 0, expense_date: new Date().toISOString().split('T')[0] });
        setShowExpenseModal(true);
    };

    const openEditExpense = (exp) => {
        setEditingExpense(exp);
        setExpenseForm({ category: exp.category, description: exp.description, amount: exp.amount, expense_date: exp.expense_date });
        setShowExpenseModal(true);
    };

    const handleSaveExpense = async () => {
        if (!expenseForm.description.trim() || !expenseForm.amount) return;

        if (editingExpense) {
            await supabase.from('expenses').update(expenseForm).eq('id', editingExpense.id);
        } else {
            await supabase.from('expenses').insert([expenseForm]);
        }
        setShowExpenseModal(false);
        fetchData();
    };

    const handleDeleteExpense = async (id) => {
        if (!confirm('Delete this expense?')) return;
        await supabase.from('expenses').delete().eq('id', id);
        fetchData();
    };

    // Month options
    const getMonthOptions = () => {
        const options = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            options.push({ value: val, label });
        }
        return options;
    };

    const formatMonth = () => {
        const [y, m] = selectedMonth.split('-').map(Number);
        return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    const sym = printSettings.currency_symbol || '$';

    const inputClass = "w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent";

    return (
        <div className="space-y-6">
            {/* ====== SCREEN UI (hidden on print) ====== */}
            <div className="print:hidden space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display uppercase">Monthly Report</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sales, expenses & profit overview</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary"
                        >
                            {getMonthOptions().map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <span className="material-icons-outlined text-lg">print</span>
                            Print Report
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <span className="material-icons-outlined text-4xl text-gray-400 animate-spin block mb-2">refresh</span>
                        <p className="text-gray-500 dark:text-gray-400">Loading report...</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { label: 'Total Sales', value: totalSales, icon: 'trending_up', color: 'text-green-600 dark:text-green-400' },
                                { label: 'Total Cost', value: totalCost, icon: 'shopping_cart', color: 'text-blue-600 dark:text-blue-400' },
                                { label: 'Gross Profit', value: grossProfit, icon: 'account_balance', color: 'text-purple-600 dark:text-purple-400' },
                                { label: 'Expenses', value: totalExpenses, icon: 'receipt_long', color: 'text-orange-600 dark:text-orange-400' },
                                { label: 'Net Profit', value: netProfit, icon: 'savings', color: netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' },
                            ].map(card => (
                                <div key={card.label} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`material-icons-outlined text-lg ${card.color}`}>{card.icon}</span>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{card.label}</p>
                                    </div>
                                    <p className={`text-xl font-bold ${card.color}`}>{sym}{card.value.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Sales Breakdown */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="material-icons-outlined text-lg text-primary">receipt</span>
                                Sales — {formatMonth()} ({quotes.length} quotes)
                            </h3>
                            {quotes.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                    <span className="material-icons-outlined text-3xl text-gray-300 dark:text-gray-600 block mb-2">receipt_long</span>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">No approved quotes this month</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                                <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Project</th>
                                                <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ref</th>
                                                <th className="pb-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                            {quotes.map(q => (
                                                <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                                    <td className="py-3 font-medium text-gray-900 dark:text-white">{q.customer_name}</td>
                                                    <td className="py-3 text-gray-500 dark:text-gray-400">{q.project_name || '—'}</td>
                                                    <td className="py-3 text-gray-500 dark:text-gray-400">{new Date(q.quote_date).toLocaleDateString()}</td>
                                                    <td className="py-3 text-gray-400 dark:text-gray-500 text-xs font-mono">{q.ref_number}</td>
                                                    <td className="py-3 text-right font-bold text-green-600 dark:text-green-400">{sym}{Number(q.total_amount || 0).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                                                <td colSpan="4" className="pt-3 text-right font-bold text-gray-700 dark:text-gray-300 uppercase text-xs">Total Sales</td>
                                                <td className="pt-3 text-right font-bold text-green-600 dark:text-green-400 text-lg">{sym}{totalSales.toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Expenses */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-icons-outlined text-lg text-primary">account_balance_wallet</span>
                                    Expenses — {formatMonth()}
                                </h3>
                                <button
                                    onClick={openAddExpense}
                                    className="text-primary hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    <span className="material-icons-outlined text-lg">add_circle</span>
                                    Add Expense
                                </button>
                            </div>

                            {/* Category Summary */}
                            {expensesByCategory.length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {expensesByCategory.map(cat => (
                                        <div key={cat.value} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full text-xs font-medium">
                                            <span className="material-icons-outlined text-sm text-gray-500">{cat.icon}</span>
                                            <span className="text-gray-700 dark:text-gray-300">{cat.label.split('/')[0].trim()}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{sym}{cat.total.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {expenses.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                    <span className="material-icons-outlined text-3xl text-gray-300 dark:text-gray-600 block mb-2">receipt</span>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">No expenses recorded this month</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                                <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                                <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="pb-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="pb-2 w-20"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                            {expenses.map(exp => {
                                                const cat = EXPENSE_CATEGORIES.find(c => c.value === exp.category) || EXPENSE_CATEGORIES[4];
                                                return (
                                                    <tr key={exp.id} className="group hover:bg-gray-50 dark:hover:bg-white/5">
                                                        <td className="py-3">
                                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                                <span className="material-icons-outlined text-sm">{cat.icon}</span>
                                                                {cat.label.split('/')[0].trim()}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-gray-900 dark:text-white">{exp.description}</td>
                                                        <td className="py-3 text-gray-500 dark:text-gray-400">{new Date(exp.expense_date).toLocaleDateString()}</td>
                                                        <td className="py-3 text-right font-bold text-orange-600 dark:text-orange-400">{sym}{Number(exp.amount).toLocaleString()}</td>
                                                        <td className="py-3 text-right">
                                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => openEditExpense(exp)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded transition-colors" title="Edit">
                                                                    <span className="material-icons-outlined text-base">edit</span>
                                                                </button>
                                                                <button onClick={() => handleDeleteExpense(exp.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors" title="Delete">
                                                                    <span className="material-icons-outlined text-base">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                                                <td colSpan="3" className="pt-3 text-right font-bold text-gray-700 dark:text-gray-300 uppercase text-xs">Total Expenses</td>
                                                <td className="pt-3 text-right font-bold text-orange-600 dark:text-orange-400 text-lg">{sym}{totalExpenses.toLocaleString()}</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Net Profit Summary */}
                        <div className={`rounded-lg border-2 p-6 ${netProfit >= 0 ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`material-icons-outlined text-3xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{netProfit >= 0 ? 'trending_up' : 'trending_down'}</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Net Profit — {formatMonth()}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                            Sales ({sym}{totalSales.toLocaleString()}) − Cost ({sym}{totalCost.toLocaleString()}) − Expenses ({sym}{totalExpenses.toLocaleString()})
                                        </p>
                                    </div>
                                </div>
                                <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {sym}{netProfit.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ====== PRINT LAYOUT ====== */}
            <style type="text/css">
                {`
                    @media print {
                        body { margin: 0; padding: 0; background-color: white !important; }
                        @page { size: A4 portrait; margin: 10mm; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        #root > div { background-color: white !important; }
                    }
                `}
            </style>
            <div className="hidden print:block bg-white text-black p-8 max-w-[210mm] mx-auto relative">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-red-600 pb-4 mb-6">
                    <div>
                        <div className="text-3xl font-bold uppercase tracking-tighter">{printSettings.company_name}</div>
                        <div className="text-sm text-gray-500">{printSettings.company_tagline}</div>
                        {printSettings.company_address && <div className="text-xs text-gray-400 mt-1">{printSettings.company_address}</div>}
                        {printSettings.company_phone && <div className="text-xs text-gray-400">{printSettings.company_phone}</div>}
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-red-600 mb-1">MONTHLY REPORT</div>
                        <div className="text-sm font-semibold">{formatMonth()}</div>
                        <div className="text-xs text-gray-400">Generated: {new Date().toLocaleDateString()}</div>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-5 gap-3 mb-8">
                    {[
                        { label: 'Sales', value: totalSales },
                        { label: 'Cost', value: totalCost },
                        { label: 'Gross Profit', value: grossProfit },
                        { label: 'Expenses', value: totalExpenses },
                        { label: 'Net Profit', value: netProfit },
                    ].map(s => (
                        <div key={s.label} className="text-center p-3 border border-gray-200 rounded">
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{s.label}</p>
                            <p className={`text-lg font-bold ${s.label === 'Net Profit' && s.value < 0 ? 'text-red-600' : 'text-black'}`}>{sym}{s.value.toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                {/* Sales */}
                {quotes.length > 0 && (
                    <div className="mb-8">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1 mb-3">Sales ({quotes.length} Quotes)</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-2 text-left pl-2 text-xs font-bold uppercase">Customer</th>
                                    <th className="py-2 text-left text-xs font-bold uppercase">Project</th>
                                    <th className="py-2 text-left text-xs font-bold uppercase">Date</th>
                                    <th className="py-2 text-right pr-2 text-xs font-bold uppercase">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotes.map(q => (
                                    <tr key={q.id} className="border-b border-gray-100">
                                        <td className="py-2 pl-2 font-medium">{q.customer_name}</td>
                                        <td className="py-2 text-gray-600">{q.project_name || '—'}</td>
                                        <td className="py-2 text-gray-500">{new Date(q.quote_date).toLocaleDateString()}</td>
                                        <td className="py-2 text-right pr-2 font-bold">{sym}{Number(q.total_amount || 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-gray-300">
                                    <td colSpan="3" className="pt-2 text-right font-bold uppercase text-xs pr-4">Total Sales</td>
                                    <td className="pt-2 text-right pr-2 font-bold text-lg">{sym}{totalSales.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                {/* Expenses */}
                {expenses.length > 0 && (
                    <div className="mb-8">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1 mb-3">Expenses</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-2 text-left pl-2 text-xs font-bold uppercase">Category</th>
                                    <th className="py-2 text-left text-xs font-bold uppercase">Description</th>
                                    <th className="py-2 text-left text-xs font-bold uppercase">Date</th>
                                    <th className="py-2 text-right pr-2 text-xs font-bold uppercase">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map(exp => {
                                    const cat = EXPENSE_CATEGORIES.find(c => c.value === exp.category) || EXPENSE_CATEGORIES[4];
                                    return (
                                        <tr key={exp.id} className="border-b border-gray-100">
                                            <td className="py-2 pl-2 capitalize">{cat.label.split('/')[0].trim()}</td>
                                            <td className="py-2 text-gray-600">{exp.description}</td>
                                            <td className="py-2 text-gray-500">{new Date(exp.expense_date).toLocaleDateString()}</td>
                                            <td className="py-2 text-right pr-2 font-bold">{sym}{Number(exp.amount).toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-gray-300">
                                    <td colSpan="3" className="pt-2 text-right font-bold uppercase text-xs pr-4">Total Expenses</td>
                                    <td className="pt-2 text-right pr-2 font-bold text-lg">{sym}{totalExpenses.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                {/* Net Profit */}
                <div className={`p-4 rounded border-2 text-center ${netProfit >= 0 ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
                    <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">Net Profit — {formatMonth()}</p>
                    <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>{sym}{netProfit.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Sales ({sym}{totalSales.toLocaleString()}) − Cost ({sym}{totalCost.toLocaleString()}) − Expenses ({sym}{totalExpenses.toLocaleString()})</p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-xs text-gray-400 text-center border-t border-gray-200 pt-3">
                    <p>{printSettings.company_name} — Confidential Financial Report</p>
                </div>
            </div>

            {/* ====== EXPENSE MODAL ====== */}
            {showExpenseModal && (
                <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowExpenseModal(false)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display uppercase">
                                {editingExpense ? 'Edit Expense' : 'Add Expense'}
                            </h3>
                            <button onClick={() => setShowExpenseModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <select
                                    className={inputClass}
                                    value={expenseForm.category}
                                    onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                >
                                    {EXPENSE_CATEGORIES.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                                <input className={inputClass} value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="e.g., Monthly rent payment" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount ({sym}) *</label>
                                    <input type="number" className={inputClass} value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) || 0 })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                    <input type="date" className={inputClass} value={expenseForm.expense_date} onChange={e => setExpenseForm({ ...expenseForm, expense_date: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSaveExpense}
                                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                            >
                                {editingExpense ? 'Update' : 'Save'}
                            </button>
                            <button
                                onClick={() => setShowExpenseModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
