'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, Save, X } from 'lucide-react';
import { Invoice, InvoiceItem } from '@/app/page';
import { cn, formatCurrency } from '@/lib/utils';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

const emptyItem: InvoiceItem = {
  id: '',
  description: '',
  quantity: 1,
  rate: 0,
  amount: 0,
};

const emptyInvoice: Omit<Invoice, 'id' | 'total' | 'subtotal'> = {
  clientName: '',
  clientEmail: '',
  invoiceNumber: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
  items: [{ ...emptyItem, id: crypto.randomUUID() }],
  taxRate: 0,
  status: 'unpaid',
  notes: '',
};

export function InvoiceForm({ invoice, onSave, onCancel }: InvoiceFormProps) {
  const [formData, setFormData] = useState(emptyInvoice);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date,
        dueDate: invoice.dueDate,
        items: invoice.items,
        taxRate: invoice.taxRate,
        status: invoice.status,
        notes: invoice.notes,
      });
    }
  }, [invoice]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Invalid email format';
    }
    if (!formData.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item-${index}-description`] = 'Description required';
      }
      if (item.quantity <= 0) {
        newErrors[`item-${index}-quantity`] = 'Must be > 0';
      }
      if (item.rate < 0) {
        newErrors[`item-${index}-rate`] = 'Must be >= 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAmounts = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ clientName: true, clientEmail: true, invoiceNumber: true, dueDate: true });
    
    if (!validate()) return;

    const { subtotal, total } = calculateAmounts();
    const invoiceData: Invoice = {
      ...formData,
      id: invoice?.id || crypto.randomUUID(),
      subtotal,
      total,
    };
    onSave(invoiceData);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...emptyItem, id: crypto.randomUUID() }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate;
      }
      return { ...prev, items: newItems };
    });
  };

  const { subtotal, total } = calculateAmounts();

  return (
    <form onSubmit={handleSubmit} className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between border-b-4 border-black pb-4">
        <h2 className="text-2xl font-black text-black uppercase tracking-tight">
          {invoice ? 'Edit Invoice' : 'Create Invoice'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 border-4 border-black hover:bg-gray-100 active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-bold text-black uppercase text-sm tracking-wide">Client Name</label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
            onBlur={() => setTouched(prev => ({ ...prev, clientName: true }))}
            placeholder="e.g. Sarah Chen"
            className={cn(
              "w-full p-3 border-4 border-black bg-[#FFFEF0] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all",
              touched.clientName && errors.clientName ? "border-red-500 bg-red-50" : ""
            )}
          />
          {touched.clientName && errors.clientName && (
            <p className="text-red-600 font-bold text-sm">{errors.clientName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-bold text-black uppercase text-sm tracking-wide">Client Email</label>
          <input
            type="email"
            value={formData.clientEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
            onBlur={() => setTouched(prev => ({ ...prev, clientEmail: true }))}
            placeholder="e.g. sarah@company.com"
            className={cn(
              "w-full p-3 border-4 border-black bg-[#FFFEF0] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all",
              touched.clientEmail && errors.clientEmail ? "border-red-500 bg-red-50" : ""
            )}
          />
          {touched.clientEmail && errors.clientEmail && (
            <p className="text-red-600 font-bold text-sm">{errors.clientEmail}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-bold text-black uppercase text-sm tracking-wide">Invoice Number</label>
          <input
            type="text"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
            onBlur={() => setTouched(prev => ({ ...prev, invoiceNumber: true }))}
            placeholder="e.g. INV-2024-001"
            className={cn(
              "w-full p-3 border-4 border-black bg-[#FFFEF0] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all",
              touched.invoiceNumber && errors.invoiceNumber ? "border-red-500 bg-red-50" : ""
            )}
          />
          {touched.invoiceNumber && errors.invoiceNumber && (
            <p className="text-red-600 font-bold text-sm">{errors.invoiceNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="font-bold text-black uppercase text-sm tracking-wide">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'paid' | 'unpaid' }))}
            className="w-full p-3 border-4 border-black bg-[#FFFEF0] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-bold text-black uppercase text-sm tracking-wide">Invoice Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full p-3 border-4 border-black bg-[#FFFEF0] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-black uppercase text-sm tracking-wide">Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            onBlur={() => setTouched(prev => ({ ...prev, dueDate: true }))}
            className={cn(
              "w-full p-3 border-4 border-black bg-[#FFFEF0] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all",
              touched.dueDate && errors.dueDate ? "border-red-500 bg-red-50" : ""
            )}
          />
          {touched.dueDate && errors.dueDate && (
            <p className="text-red-600 font-bold text-sm">{errors.dueDate}</p>
          )}
        </div>
      </div>

      <div className="border-t-4 border-black pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-black uppercase text-lg">Line Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-green-400 border-4 border-black font-bold uppercase text-sm shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:-translate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-start animate-fade-in">
              <div className="col-span-6 space-y-1">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="e.g. Web Design Services"
                  className={cn(
                    "w-full p-2 border-4 border-black bg-[#FFFEF0] text-sm focus:outline-none",
                    errors[`item-${index}-description`] ? "border-red-500 bg-red-50" : ""
                  )}
                />
                {errors[`item-${index}-description`] && (
                  <p className="text-red-600 font-bold text-xs">{errors[`item-${index}-description`]}</p>
                )}
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border-4 border-black bg-[#FFFEF0] text-sm focus:outline-none"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                  placeholder="$0.00"
                  className="w-full p-2 border-4 border-black bg-[#FFFEF0] text-sm focus:outline-none"
                />
              </div>
              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length === 1}
                  className="w-full p-2 border-4 border-black bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500 active:scale-95 transition-all"
                >
                  <Minus className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-4 border-black pt-6">
        <div className="space-y-2">
          <label className="font-bold text-black uppercase text-sm tracking-wide">Tax Rate (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.taxRate}
            onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
            placeholder="e.g. 10"
            className="w-full p-3 border-4 border-black bg-[#FFFEF0] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-black uppercase text-sm tracking-wide">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="e.g. Payment terms: Net 30"
            rows={3}
            className="w-full p-3 border-4 border-black bg-[#FFFEF0] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all resize-none"
          />
        </div>
      </div>

      <div className="border-4 border-black bg-[#FFFEF0] p-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-600">Subtotal:</span>
          <span className="font-bold text-black">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-600">Tax ({formData.taxRate}%):</span>
          <span className="font-bold text-black">{formatCurrency(subtotal * (formData.taxRate / 100))}</span>
        </div>
        <div className="flex justify-between text-xl border-t-4 border-black pt-2 mt-2">
          <span className="font-black text-black uppercase">Total:</span>
          <span className="font-black text-[#FF6B6B]">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-[#FF6B6B] border-4 border-black py-4 font-black uppercase text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 border-4 border-black py-4 font-bold uppercase text-lg hover:bg-gray-100 active:scale-95 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}