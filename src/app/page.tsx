'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, ArrowUpDown, FileText } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { InvoiceCard } from '@/components/InvoiceCard'
import { InvoiceEditor } from '@/components/InvoiceEditor'
import { Dashboard } from '@/components/Dashboard'
import { Settings } from '@/components/Settings'
import { Toast } from '@/components/Toast'
import { cn, formatCurrency } from '@/lib/utils'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  date: string
  dueDate: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  logo?: string
}

const initialInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'Sarah Chen',
    clientEmail: 'sarah.chen@techstart.io',
    date: '2024-03-15',
    dueDate: '2024-04-15',
    items: [
      { id: '1', description: 'Website redesign and UX audit for mobile responsiveness', quantity: 1, rate: 3500, amount: 3500 },
      { id: '2', description: 'Brand identity guidelines documentation', quantity: 1, rate: 1200, amount: 1200 }
    ],
    subtotal: 4700,
    taxRate: 10,
    taxAmount: 470,
    total: 5170,
    status: 'paid'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientName: 'Marcus Rodriguez',
    clientEmail: 'marcus@global-solutions.com',
    date: '2024-03-18',
    dueDate: '2024-04-18',
    items: [
      { id: '1', description: 'Quarterly SEO optimization and content strategy', quantity: 3, rate: 850, amount: 2550 },
      { id: '2', description: 'Analytics dashboard setup with custom reporting', quantity: 1, rate: 600, amount: 600 }
    ],
    subtotal: 3150,
    taxRate: 10,
    taxAmount: 315,
    total: 3465,
    status: 'sent'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    clientName: 'Emily Watson',
    clientEmail: 'emily@creativestudio.co',
    date: '2024-03-20',
    dueDate: '2024-04-20',
    items: [
      { id: '1', description: 'Photography session for product catalog', quantity: 4, rate: 450, amount: 1800 },
      { id: '2', description: 'Image retouching and color correction', quantity: 20, rate: 25, amount: 500 }
    ],
    subtotal: 2300,
    taxRate: 10,
    taxAmount: 230,
    total: 2530,
    status: 'draft'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    clientName: 'David Park',
    clientEmail: 'david.park@innovatelabs.com',
    date: '2024-02-28',
    dueDate: '2024-03-30',
    items: [
      { id: '1', description: 'Mobile app UI design for iOS and Android platforms', quantity: 1, rate: 5200, amount: 5200 },
      { id: '2', description: 'Interactive prototype development', quantity: 1, rate: 1800, amount: 1800 }
    ],
    subtotal: 7000,
    taxRate: 10,
    taxAmount: 700,
    total: 7700,
    status: 'overdue'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    clientName: 'Lisa Thompson',
    clientEmail: 'lisa@thompson-consulting.net',
    date: '2024-03-22',
    dueDate: '2024-04-22',
    items: [
      { id: '1', description: 'Business strategy consultation sessions', quantity: 8, rate: 200, amount: 1600 },
      { id: '2', description: 'Market analysis report compilation', quantity: 1, rate: 950, amount: 950 }
    ],
    subtotal: 2550,
    taxRate: 10,
    taxAmount: 255,
    total: 2805,
    status: 'paid'
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-006',
    clientName: 'James Wilson',
    clientEmail: 'j.wilson@constructpro.com',
    date: '2024-03-25',
    dueDate: '2024-04-25',
    items: [
      { id: '1', description: 'Architectural visualization renders', quantity: 5, rate: 600, amount: 3000 },
      { id: '2', description: '3D modeling for interior spaces', quantity: 3, rate: 450, amount: 1350 }
    ],
    subtotal: 4350,
    taxRate: 10,
    taxAmount: 435,
    total: 4785,
    status: 'sent'
  },
  {
    id: '7',
    invoiceNumber: 'INV-2024-007',
    clientName: 'Anna Kowalski',
    clientEmail: 'anna@designhaus.eu',
    date: '2024-03-28',
    dueDate: '2024-04-28',
    items: [
      { id: '1', description: 'E-commerce platform migration and setup', quantity: 1, rate: 4200, amount: 4200 },
      { id: '2', description: 'Payment gateway integration testing', quantity: 1, rate: 800, amount: 800 }
    ],
    subtotal: 5000,
    taxRate: 10,
    taxAmount: 500,
    total: 5500,
    status: 'draft'
  },
  {
    id: '8',
    invoiceNumber: 'INV-2024-008',
    clientName: 'Michael Chang',
    clientEmail: 'michael@chang-media.com',
    date: '2024-03-10',
    dueDate: '2024-04-10',
    items: [
      { id: '1', description: 'Video editing and post-production', quantity: 12, rate: 150, amount: 1800 },
      { id: '2', description: 'Motion graphics and title sequences', quantity: 3, rate: 400, amount: 1200 }
    ],
    subtotal: 3000,
    taxRate: 10,
    taxAmount: 300,
    total: 3300,
    status: 'paid'
  },
  {
    id: '9',
    invoiceNumber: 'INV-2024-009',
    clientName: 'Rachel Green',
    clientEmail: 'rachel@greenevents.co',
    date: '2024-03-12',
    dueDate: '2024-04-12',
    items: [
      { id: '1', description: 'Event branding and promotional materials', quantity: 1, rate: 2200, amount: 2200 },
      { id: '2', description: 'Social media campaign management', quantity: 4, rate: 350, amount: 1400 }
    ],
    subtotal: 3600,
    taxRate: 10,
    taxAmount: 360,
    total: 3960,
    status: 'overdue'
  },
  {
    id: '10',
    invoiceNumber: 'INV-2024-010',
    clientName: 'Thomas Anderson',
    clientEmail: 't.anderson@matrixsys.com',
    date: '2024-03-30',
    dueDate: '2024-04-30',
    items: [
      { id: '1', description: 'Cybersecurity audit and vulnerability assessment', quantity: 1, rate: 5500, amount: 5500 },
      { id: '2', description: 'Security policy documentation', quantity: 1, rate: 1200, amount: 1200 }
    ],
    subtotal: 6700,
    taxRate: 10,
    taxAmount: 670,
    total: 7370,
    status: 'draft'
  },
  {
    id: '11',
    invoiceNumber: 'INV-2024-011',
    clientName: 'Sophie Martinez',
    clientEmail: 'sophie@artistry.design',
    date: '2024-03-05',
    dueDate: '2024-04-05',
    items: [
      { id: '1', description: 'Custom illustration package for children book', quantity: 15, rate: 180, amount: 2700 },
      { id: '2', description: 'Character design and development', quantity: 5, rate: 220, amount: 1100 }
    ],
    subtotal: 3800,
    taxRate: 10,
    taxAmount: 380,
    total: 4180,
    status: 'paid'
  },
  {
    id: '12',
    invoiceNumber: 'INV-2024-012',
    clientName: 'Kevin O\'Brien',
    clientEmail: 'kevin@obrien-legal.ie',
    date: '2024-03-08',
    dueDate: '2024-04-08',
    items: [
      { id: '1', description: 'Legal website content writing and optimization', quantity: 1, rate: 2800, amount: 2800 },
      { id: '2', description: 'Case study documentation and formatting', quantity: 8, rate: 150, amount: 1200 }
    ],
    subtotal: 4000,
    taxRate: 10,
    taxAmount: 400,
    total: 4400,
    status: 'sent'
  }
]

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [userName, setUserName] = useState('Alex Johnson')

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('invoices')
      if (saved) {
        setInvoices(JSON.parse(saved))
      } else {
        setInvoices(initialInvoices)
      }
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('invoices', JSON.stringify(invoices))
    }
  }, [invoices, loading])

  const filteredInvoices = invoices
    .filter(inv => 
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === 'amount') return b.total - a.total
      if (sortBy === 'client') return a.clientName.localeCompare(b.clientName)
      return 0
    })

  const handleCreateInvoice = (data: any, items: any[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = subtotal * (data.taxRate / 100)
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      ...data,
      items,
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
      status: 'draft'
    }
    setInvoices(prev => [newInvoice, ...prev])
    setShowEditor(false)
    setToast({ message: 'Invoice created successfully', type: 'success' })
  }

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
    setToast({ message: 'Invoice deleted', type: 'info' })
  }

  const handleDuplicateInvoice = (invoice: Invoice) => {
    const duplicated: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft'
    }
    setInvoices(prev => [duplicated, ...prev])
    setToast({ message: 'Invoice duplicated', type: 'success' })
  }

  const handleStatusChange = (id: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv))
    setToast({ message: `Invoice marked as ${status}`, type: 'success' })
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setShowEditor(true)
  }

  const handleUpdateInvoice = (data: any, items: any[]) => {
    if (!editingInvoice) return
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = subtotal * (data.taxRate / 100)
    setInvoices(prev => prev.map(inv => 
      inv.id === editingInvoice.id 
        ? { ...inv, ...data, items, subtotal, taxAmount, total: subtotal + taxAmount }
        : inv
    ))
    setShowEditor(false)
    setEditingInvoice(null)
    setToast({ message: 'Invoice updated successfully', type: 'success' })
  }

  const SkeletonCard = () => (
    <div className="glass-card p-6 space-y-4">
      <div className="skeleton h-6 w-3/4 rounded"></div>
      <div className="skeleton h-4 w-1/2 rounded"></div>
      <div className="skeleton h-4 w-full rounded"></div>
      <div className="skeleton h-8 w-full rounded"></div>
    </div>
  )

  return (
    <main className="min-h-screen pb-20">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'home' && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          {!showEditor ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 fade-in-up">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Invoices</h1>
                  <p className="text-white/60">Manage and track your professional invoices</p>
                </div>
                <button
                  onClick={() => setShowEditor(true)}
                  className="gradient-btn flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg shadow-violet-500/25 active:scale-95 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                  Create Invoice
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search by client or invoice number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-3 rounded-xl"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl min-w-[140px]"
                >
                  <option value="date" className="bg-slate-800">Sort by Date</option>
                  <option value="amount" className="bg-slate-800">Sort by Amount</option>
                  <option value="client" className="bg-slate-800">Sort by Client</option>
                </select>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="glass-card p-12 text-center fade-in-up">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white/40" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No invoices found</h3>
                  <p className="text-white/60 mb-6">Get started by creating your first invoice</p>
                  <button
                    onClick={() => setShowEditor(true)}
                    className="gradient-btn px-6 py-3 rounded-xl text-white font-semibold"
                  >
                    Create Your First Invoice
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInvoices.map((invoice, index) => (
                    <div 
                      key={invoice.id} 
                      className="fade-in-up" 
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => handleEditInvoice(invoice)}
                    >
                      <InvoiceCard
                        invoice={invoice}
                        onDelete={handleDeleteInvoice}
                        onDuplicate={handleDuplicateInvoice}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <InvoiceEditor
              onSave={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
              onCancel={() => {
                setShowEditor(false)
                setEditingInvoice(null)
              }}
              initialData={editingInvoice || undefined}
              initialItems={editingInvoice?.items}
            />
          )}
        </div>
      )}

      {activeTab === 'dashboard' && <Dashboard invoices={invoices} />}
      
      {activeTab === 'settings' && (
        <Settings
          darkMode={darkMode}
          onDarkModeChange={setDarkMode}
          userName={userName}
          onUserNameChange={setUserName}
          invoices={invoices}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  )
}