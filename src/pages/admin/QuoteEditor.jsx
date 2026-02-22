import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { getPrintSettings } from './PrintSettings';
import { useSettings } from '../../context/SettingsContext';
import Barcode from 'react-barcode';

export default function QuoteEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { settings } = useSettings();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [materials, setMaterials] = useState([]);
    const ps = getPrintSettings();
    const [discount, setDiscount] = useState(0);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [itemSearchQuery, setItemSearchQuery] = useState('');

    const [quoteData, setQuoteData] = useState({
        customer_name: '',
        project_name: '',
        phone: '',
        email: '',
        quote_date: new Date().toISOString().split('T')[0],
        ref_number: '',
        status: 'draft',
        notes: ''
    });

    const [items, setItems] = useState([]);

    const fetchMaterials = async () => {
        // Fetch from materials table (inventory)
        const { data: materialsData } = await supabase.from('materials').select('*');

        const combined = [];

        // Add inventory materials
        if (materialsData) {
            materialsData.forEach(m => {
                combined.push({
                    id: m.id,
                    name: m.name,
                    selling_price: m.selling_price || 0,
                    stock_quantity: m.stock_quantity || 0,
                    source: 'inventory'
                });
            });
        }

        setMaterials(combined);
    };

    const generateRefNumber = () => {
        const date = new Date();
        const year = date.getFullYear();
        const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        setQuoteData(prev => ({ ...prev, ref_number: `Q-${year}-${rand}` }));
    };

    const fetchQuote = async (quoteId) => {
        setLoading(true);
        const { data: quote, error: quoteError } = await supabase
            .from('quotes')
            .select('*')
            .eq('id', quoteId)
            .single();

        if (quoteError) {
            console.error('Error fetching quote:', quoteError);
            setLoading(false);
            return;
        }

        const { data: quoteItems, error: itemsError } = await supabase
            .from('quote_items')
            .select('*')
            .eq('quote_id', quoteId);

        if (itemsError) console.error('Error fetching items:', itemsError);

        setQuoteData({
            customer_name: quote.customer_name || '',
            project_name: quote.project_name || '',
            phone: quote.phone || '',
            email: quote.email || '',
            quote_date: quote.quote_date || new Date().toISOString().split('T')[0],
            ref_number: quote.ref_number || '',
            status: quote.status || 'draft',
            notes: quote.notes || ''
        });
        setItems(quoteItems || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchMaterials();
        if (id) {
            fetchQuote(id);
        } else {
            generateRefNumber();
        }
    }, [id]);

    const handleOpenItemModal = () => {
        setIsItemModalOpen(true);
        setItemSearchQuery('');
    };

    const handleSelectItemFromModal = (material) => {
        if (material.stock_quantity <= 0) {
            alert(`"${material.name}" is out of stock!`);
            return;
        }
        // eslint-disable-next-line react-hooks/purity
        const newId = `temp-${Date.now()}`;
        setItems([...items, {
            id: newId,
            material_id: material.id,
            description: material.name,
            width: 0,
            height: 0,
            quantity: 1,
            unit_price: material.selling_price || 0,
            section_profile: '',
            notes: ''
        }]);
        setIsItemModalOpen(false);
    };

    const handleAddCustomItem = () => {
        const newId = `temp-${Date.now()}`;
        setItems([...items, {
            id: newId,
            material_id: '',
            description: 'Custom Item',
            width: 0,
            height: 0,
            quantity: 1,
            unit_price: 0,
            section_profile: '',
            notes: ''
        }]);
        setIsItemModalOpen(false);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];

        if (field === 'quantity') {
            value = Math.max(1, Math.floor(Number(value) || 1));
            const matId = newItems[index].material_id;
            if (matId) {
                const material = materials.find(m => m.id === matId);
                if (material && value > material.stock_quantity) {
                    alert(`Cannot exceed available stock of ${material.stock_quantity} for ${material.name}`);
                    value = material.stock_quantity;
                }
            }
        }

        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateItemTotal = (item) => {
        return (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    };

    const calculateTotals = () => {
        const subtotal = calculateSubtotal();
        return subtotal - (Number(discount) || 0);
    };

    const handleSave = async (status = 'draft') => {
        if (!quoteData.customer_name.trim()) {
            alert('Please enter a customer name');
            return;
        }

        setSaving(true);
        const totalAmount = calculateTotals();

        const quotePayload = {
            ...quoteData,
            status,
            total_amount: totalAmount,
            updated_at: new Date().toISOString()
        };

        let quoteId = id;

        if (id) {
            const { error } = await supabase.from('quotes').update(quotePayload).eq('id', id);
            if (error) {
                alert('Error updating quote: ' + error.message);
                setSaving(false);
                return;
            }
        } else {
            const { data, error } = await supabase.from('quotes').insert([quotePayload]).select().single();
            if (error) {
                alert('Error saving quote: ' + error.message);
                setSaving(false);
                return;
            }
            quoteId = data.id;
        }

        // Save items: Delete all existing and re-insert
        if (id) {
            await supabase.from('quote_items').delete().eq('quote_id', quoteId);
        }

        const itemsToInsert = items.map(item => ({
            quote_id: quoteId,
            description: item.description,
            width: item.width || null,
            height: item.height || null,
            quantity: item.quantity,
            unit_price: item.unit_price,
            section_profile: item.section_profile,
            notes: item.notes
        }));

        if (itemsToInsert.length > 0) {
            const { error: itemsError } = await supabase.from('quote_items').insert(itemsToInsert);
            if (itemsError) console.error('Error saving items:', itemsError);
        }

        setSaving(false);

        if (status === 'approved' || status === 'sent') {
            if (status === 'approved') {
                setTimeout(() => {
                    window.print();
                    navigate('/admin/accounting/quotes');
                }, 500);
            } else {
                navigate('/admin/accounting/quotes');
            }
        } else {
            if (!id) navigate(`/admin/accounting/quotes/${quoteId}`);
            else alert('Saved successfully');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const inputClass = "w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="material-icons-outlined text-4xl text-gray-400 animate-spin block mb-2">refresh</span>
                    <p className="text-gray-500 dark:text-gray-400">Loading quote...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Editor Interface (Hidden on Print) */}
            <div className="print:hidden space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/admin/accounting/quotes')}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <span className="material-icons-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display uppercase">
                                {id ? 'Edit Quote' : 'New Quote'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{quoteData.ref_number}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleSave('draft')}
                            disabled={saving}
                            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <span className="material-icons-outlined text-lg">print</span>
                            Print
                        </button>
                        <button
                            onClick={() => handleSave('approved')}
                            disabled={saving}
                            className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                        >
                            Save & Approve
                        </button>
                    </div>
                </div>

                {/* Customer & Quote Details Form */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
                    <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Quote Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className={labelClass}>Customer Name *</label>
                            <input className={inputClass} value={quoteData.customer_name} onChange={e => setQuoteData({ ...quoteData, customer_name: e.target.value })} placeholder="Customer name" />
                        </div>
                        <div>
                            <label className={labelClass}>Project Name</label>
                            <input className={inputClass} value={quoteData.project_name} onChange={e => setQuoteData({ ...quoteData, project_name: e.target.value })} placeholder="Project name" />
                        </div>
                        <div>
                            <label className={labelClass}>Ref Number</label>
                            <input className={inputClass} value={quoteData.ref_number} onChange={e => setQuoteData({ ...quoteData, ref_number: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input className={inputClass} type="tel" value={quoteData.phone} onChange={e => setQuoteData({ ...quoteData, phone: e.target.value })} placeholder="07xxxxxxxxx" />
                        </div>
                        <div>
                            <label className={labelClass}>Email</label>
                            <input className={inputClass} type="email" value={quoteData.email} onChange={e => setQuoteData({ ...quoteData, email: e.target.value })} placeholder="customer@email.com" />
                        </div>
                        <div>
                            <label className={labelClass}>Date</label>
                            <input className={inputClass} type="date" value={quoteData.quote_date} onChange={e => setQuoteData({ ...quoteData, quote_date: e.target.value })} />
                        </div>
                        <div className="md:col-span-3">
                            <label className={labelClass}>Notes (Optional — prints on receipt)</label>
                            <textarea className={`${inputClass} resize-none`} rows="2" value={quoteData.notes} onChange={e => setQuoteData({ ...quoteData, notes: e.target.value })} placeholder="Special notes for this quote..." />
                        </div>
                    </div>
                </div>

                {/* Items Editor */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider">Line Items</h3>
                        <button
                            onClick={handleOpenItemModal}
                            className="text-primary hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                            <span className="material-icons-outlined text-lg">add_circle</span>
                            Add Item
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                            <span className="material-icons-outlined text-4xl text-gray-300 dark:text-gray-600 block mb-2">playlist_add</span>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No items yet. Click "Add Item" to get started.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border-light dark:border-border-dark">
                                            <th className="pb-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Material</th>
                                            <th className="pb-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                            <th className="pb-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">W (mm)</th>
                                            <th className="pb-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">H (mm)</th>
                                            <th className="pb-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Qty</th>
                                            <th className="pb-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">Unit Price</th>
                                            <th className="pb-2 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">Total</th>
                                            <th className="pb-2 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                        {items.map((item, index) => (
                                            <tr key={item.id} className="group">
                                                <td className="py-2 pr-2 text-sm font-medium text-gray-900 dark:text-white px-2">
                                                    {materials.find(m => m.id === item.material_id)?.name || <span className="text-gray-400 italic">Custom Item</span>}
                                                </td>
                                                <td className="py-2 pr-2">
                                                    <input
                                                        className="w-full border border-gray-200 dark:border-gray-600 rounded-md px-2.5 py-2 dark:bg-black/20 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        value={item.description}
                                                        onChange={e => handleItemChange(index, 'description', e.target.value)}
                                                        placeholder="Item description"
                                                    />
                                                </td>
                                                <td className="py-2 pr-2">
                                                    <input type="number" className="w-full border border-gray-200 dark:border-gray-600 rounded-md px-2.5 py-2 dark:bg-black/20 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent" value={item.width} onChange={e => handleItemChange(index, 'width', e.target.value)} />
                                                </td>
                                                <td className="py-2 pr-2">
                                                    <input type="number" className="w-full border border-gray-200 dark:border-gray-600 rounded-md px-2.5 py-2 dark:bg-black/20 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent" value={item.height} onChange={e => handleItemChange(index, 'height', e.target.value)} />
                                                </td>
                                                <td className="py-2 pr-2">
                                                    <input type="number" step="1" min="1" className="w-full border border-gray-200 dark:border-gray-600 rounded-md px-2.5 py-2 dark:bg-black/20 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Math.max(1, Math.floor(Number(e.target.value) || 1)))} />
                                                </td>
                                                <td className="py-2 pr-2">
                                                    <input type="number" className="w-full border border-gray-200 dark:border-gray-600 rounded-md px-2.5 py-2 dark:bg-black/20 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent" value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', e.target.value)} />
                                                </td>
                                                <td className="py-2 pr-2 text-right">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">${calculateItemTotal(item).toLocaleString()}</span>
                                                </td>
                                                <td className="py-2 text-center">
                                                    <button
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <span className="material-icons-outlined text-lg">close</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Discount & Totals */}
                            <div className="mt-6 flex justify-end">
                                <div className="bg-gray-50 dark:bg-black/20 rounded-lg px-6 py-4 text-right border border-border-light dark:border-border-dark min-w-[280px]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Subtotal</span>
                                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">{ps.currency_symbol}{calculateSubtotal().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-600">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Discount</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="w-28 text-right border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 dark:bg-black/20 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                            value={discount}
                                            onChange={e => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</span>
                                        <span className="text-3xl font-bold text-primary">{ps.currency_symbol}{calculateTotals().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ====== A4 Print Layout (Visible ONLY on Print) ====== */}
            <style type="text/css">
                {`
                    @media print {
                        body { margin: 0; padding: 0; background-color: white !important; }
                        @page { size: A4 portrait; margin: 10mm; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        .print-page { page-break-inside: avoid; background-color: white !important; }
                        
                        /* Hide navigation and other dark backgrounds */
                        #root > div { background-color: white !important; }
                    }
                `}
            </style>
            <div className="hidden print:block print-page bg-white text-black p-6 max-w-[210mm] mx-auto relative">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-red-600 pb-3 mb-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            {ps.show_logo !== false && (
                                <span className="text-black inline-block">
                                    <svg fill="none" height="28" viewBox="0 0 32 32" width="28" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 26L14 6H18L26 26" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                                        <path d="M10 26L14 16" stroke="#D32F2F" strokeLinecap="round" strokeWidth="3" />
                                    </svg>
                                </span>
                            )}
                            <div className="text-3xl font-bold uppercase tracking-tighter text-black leading-none">{ps.company_name}</div>
                        </div>
                        <div className="text-xs text-gray-600 mr-10">{ps.company_tagline}</div>
                        {settings?.address && <div className="text-[10px] text-gray-500 mt-0.5">{settings.address}</div>}
                        {settings?.phone && <div className="text-[10px] text-gray-500">{settings.phone}</div>}
                        {ps.website_url && <div className="text-[10px] text-gray-400 mt-1">{ps.website_url}</div>}
                    </div>
                    <div className="text-right flex flex-col items-end text-xs">
                        <div className="text-xl font-bold text-red-600 mb-1">QUOTE</div>
                        <Barcode value={quoteData.ref_number || 'NEW'} width={1} height={25} displayValue={false} margin={0} background="transparent" />
                        <div className="mt-1"><span className="font-semibold">Date:</span> {new Date(quoteData.quote_date).toLocaleDateString()}</div>
                        <div><span className="font-semibold">Ref:</span> {quoteData.ref_number}</div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-200 mb-1 pb-0.5">Bill To</h4>
                    <p className="font-bold text-sm">{quoteData.customer_name}</p>
                    {quoteData.project_name && <p className="text-xs text-gray-600">{quoteData.project_name}</p>}
                    {quoteData.phone && <span className="text-xs text-gray-500 mr-3">{quoteData.phone}</span>}
                    {quoteData.email && <span className="text-xs text-gray-500">{quoteData.email}</span>}
                </div>

                {/* Items Table */}
                <table className="w-full mb-4 text-xs">
                    <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                            <th className="py-1.5 text-left pl-2 font-bold text-[10px] uppercase tracking-wider">#</th>
                            <th className="py-1.5 text-left font-bold text-[10px] uppercase tracking-wider">Description</th>
                            {ps.show_dimensions && <th className="py-1.5 text-center font-bold text-[10px] uppercase tracking-wider">Dimensions</th>}
                            <th className="py-1.5 text-center font-bold text-[10px] uppercase tracking-wider">Qty</th>
                            <th className="py-1.5 text-right font-bold text-[10px] uppercase tracking-wider">Unit Price</th>
                            <th className="py-1.5 text-right pr-2 font-bold text-[10px] uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-1.5 pl-2 text-gray-400">{i + 1}</td>
                                <td className="py-1.5">
                                    <div className="font-medium text-xs">{item.description}</div>
                                </td>
                                {ps.show_dimensions && (
                                    <td className="py-1.5 text-center text-[10px] text-gray-500">
                                        {(item.width > 0 && item.height > 0) ? `${item.width} × ${item.height} mm` : '—'}
                                    </td>
                                )}
                                <td className="py-1.5 text-center">{item.quantity}</td>
                                <td className="py-1.5 text-right">{ps.currency_symbol}{Number(item.unit_price || 0).toLocaleString()}</td>
                                <td className="py-1.5 text-right pr-2 font-bold">{ps.currency_symbol}{calculateItemTotal(item).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-gray-400">
                            <td colSpan={ps.show_dimensions ? 5 : 4} className="pt-2 text-right font-bold uppercase pr-3 text-xs">Subtotal:</td>
                            <td className="pt-2 text-right font-bold text-sm pr-2">{ps.currency_symbol}{calculateSubtotal().toLocaleString()}</td>
                        </tr>
                        {Number(discount) > 0 && (
                            <tr>
                                <td colSpan={ps.show_dimensions ? 5 : 4} className="pt-1 text-right font-medium uppercase pr-3 text-xs text-red-600">Discount:</td>
                                <td className="pt-1 text-right font-medium text-sm pr-2 text-red-600">-{ps.currency_symbol}{Number(discount).toLocaleString()}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan={ps.show_dimensions ? 5 : 4} className="pt-1 text-right font-bold uppercase pr-3 text-xs">Total USD:</td>
                            <td className="pt-1 text-right font-bold text-base pr-2">{ps.currency_symbol}{calculateTotals().toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colSpan={ps.show_dimensions ? 5 : 4} className="pt-1 text-right font-bold uppercase pr-3 text-[10px] text-gray-500">Total IQD:</td>
                            <td className="pt-1 text-right font-bold text-sm text-gray-600 pr-2">IQD {(calculateTotals() * (ps.exchange_rate || 1500)).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Per-Quote Notes */}
                {quoteData.notes && (
                    <div className="mb-3 p-2 bg-gray-50 rounded text-[11px] border border-gray-200">
                        <p className="font-bold text-[10px] uppercase text-gray-400 mb-0.5">Notes</p>
                        <p className="text-gray-700 whitespace-pre-line">{quoteData.notes}</p>
                    </div>
                )}

                {/* Global Terms */}
                {ps.terms_text && (
                    <div className="mb-3 p-2 bg-gray-50 rounded text-[11px] border border-gray-200">
                        <p className="font-bold text-[10px] uppercase text-gray-400 mb-0.5">Terms & Conditions</p>
                        <p className="text-gray-700 whitespace-pre-line">{ps.terms_text}</p>
                    </div>
                )}

                {/* Signature Line */}
                <div className="flex justify-between mt-8 mb-8">
                    <div className="w-1/3 text-center">
                        <div className="border-b border-gray-400 mb-1 h-8"></div>
                        <p className="text-[10px] text-gray-500">Customer Signature</p>
                    </div>
                    <div className="w-1/3 text-center">
                        <div className="border-b border-gray-400 mb-1 h-8"></div>
                        <p className="text-[10px] text-gray-500">Company Signature</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-[10px] text-gray-400 text-center border-t border-gray-200 pt-2">
                    <p>{ps.thank_you_text}</p>
                </div>
            </div>

            {/* Item Selection Modal */}
            {isItemModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Material</h3>
                            <button onClick={() => setIsItemModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons-outlined text-gray-400">search</span>
                                </span>
                                <input
                                    type="text"
                                    className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 border px-3 py-2 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    placeholder="Search inventory..."
                                    value={itemSearchQuery}
                                    onChange={(e) => setItemSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto p-4 bg-gray-50 dark:bg-black/5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <div
                                    onClick={handleAddCustomItem}
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center min-h-[140px]"
                                >
                                    <span className="material-icons-outlined text-gray-400 mb-2">add_box</span>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">Add Custom Item</p>
                                </div>
                                {materials.filter(m => m.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) || (m.sku && m.sku.toLowerCase().includes(itemSearchQuery.toLowerCase()))).map(material => (
                                    <div
                                        key={material.id}
                                        onClick={() => handleSelectItemFromModal(material)}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col ${material.stock_quantity <= 0 ? 'opacity-50 border-red-200 bg-red-50 dark:bg-red-900/10 hover:border-red-300' : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md bg-white dark:bg-surface-dark'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2" title={material.name}>{material.name}</h4>
                                        </div>
                                        {material.sku && <p className="text-xs text-gray-500 mb-2">SKU: {material.sku}</p>}

                                        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                                            <span className={`text-xs px-2 py-0.5 rounded font-bold ${material.stock_quantity <= 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {Math.floor(material.stock_quantity)} in stock
                                            </span>
                                            <div className="text-base font-bold text-primary">
                                                {ps.currency_symbol}{(material.selling_price || 0).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
