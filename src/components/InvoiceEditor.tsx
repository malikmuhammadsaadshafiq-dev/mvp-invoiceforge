'use client'

import { useState, useCallback } from 'react'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceData {
  invoiceNumber: string
  clientName: string
  clientEmail: string
  date: string
  dueDate: string
  taxRate: number
  logo?: string
}

interface InvoiceEditorProps {
  onSave: (data: InvoiceData, items: InvoiceItem[]) => void
  onCancel: () => void
  initialData?: InvoiceData
  initialItems?: InvoiceItem[]
}

export function InvoiceEditor({ onSave, onCancel, initialData, initialItems }: InvoiceEditorProps) {
  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: initialData?.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
    clientName: initialData?.clientName || '',
    clientEmail: initialData?.clientEmail || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate || '',
    taxRate: initialData?.taxRate || 10,
    logo: initialData?.logo,
  })

  const [items, setItems] = useState<InvoiceItem[]>(
    initialItems?.length ? initialItems : [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ]
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDragging, setIsDragging] = useState(false)

  const calculateAmount = (quantity: number, rate: number) => quantity * rate

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: value }
      if (field === 'quantity' || field === 'rate') {
        updated.amount = calculateAmount(
          field === 'quantity' ? Number(value) : item.quantity,
          field === 'rate' ? Number(value) : item.rate
        )
      }
      return updated
    }))
  }

  const addItem = () => {
    setItems(prev => [...prev, { 
      id: Date.now().toString(), 
      description: '', 
      quantity: 1, 
      rate: 0, 
      amount: 0 
    }])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = subtotal * (formData.taxRate / 100)
  const total = subtotal + taxAmount

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required'
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email'
    }
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required'
    if (items.some(item => !item.description.trim())) {
      newErrors.items = 'All items must have a description'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData, items)
    }
  }

  const handleLogoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, logo: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleLogoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, logo: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="glass-card p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">
          {initialData ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Invoice Number</label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className="w-full glass-input px-4 py-2.5 rounded-lg"
                placeholder="e.g., INV-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Client Name *</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className={cn(
                  'w-full glass-input px-4 py-2.5 rounded-lg',
                  errors.clientName && 'border-rose-500/50'
                )}
                placeholder="e.g., Sarah Chen"
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-rose-400">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Client Email *</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className={cn(
                  'w-full glass-input px-4 py-2.5 rounded-lg',
                  errors.clientEmail && 'border-rose-500/50'
                )}
                placeholder="e.g., sarah@company.com"
              />
              {errors.clientEmail && (
                <p className="mt-1 text-sm text-rose-400">{errors.clientEmail}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Invoice Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full glass-input px-4 py-2.5 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Due Date *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className={cn(
                  'w-full glass-input px-4 py-2.5 rounded-lg',
                  errors.dueDate && 'border-rose-500/50'
                )}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-rose-400">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.taxRate}
                onChange={(e) => setFormData(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                className="w-full glass-input px-4 py-2.5 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Company Logo</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleLogoDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-6 transition-all text-center',
              isDragging ? 'border-violet-400 bg-violet-500/10' : 'border-white/20 hover:border-white/40',
              formData.logo && 'border-emerald-500/50 bg-emerald-500/5'
            )}
          >
            {formData.logo ? (
              <div className="relative inline-block">
                <img src={formData.logo} alt="Logo" className="h-20 object-contain" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, logo: undefined }))}
                  className="absolute -top-2 -right-2 p-1 bg-rose-500 rounded-full text-white hover:bg-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-white/40 mx-auto" />
                <p className="text-sm text-white/60">Drag & drop logo here, or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoInput}
                  className="hidden"
                  id="logo-input"
                />
                <label
                  htmlFor="logo-input"
                  className="inline-block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-white cursor-pointer transition-colors"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white/80">Line Items</label>
            {errors.items && <span className="text-sm text-rose-400">{errors.items}</span>}
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-start animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="col-span-5">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    className="w-full glass-input px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                    className="w-full glass-input px-3 py-2 rounded-lg text-sm text-center"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full glass-input px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <span className="text-sm text-white/60 py-2 block">{formatCurrency(item.amount)}</span>
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400 transition-colors"
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Subtotal</span>
            <span className="text-white">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Tax ({formData.taxRate}%)</span>
            <span className="text-white">{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/10">
            <span className="text-white">Total</span>
            <span className="text-violet-400">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 gradient-btn px-6 py-3 rounded-xl text-white font-semibold shadow-lg shadow-violet-500/25"
          >
            {initialData ? 'Update Invoice' : 'Create Invoice'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}