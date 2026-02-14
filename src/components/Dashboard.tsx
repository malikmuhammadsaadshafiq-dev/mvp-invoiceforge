'use client'

import { TrendingUp, DollarSign, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  date: string
}

interface DashboardProps {
  invoices: Invoice[]
}

export function Dashboard({ invoices }: DashboardProps) {
  const totalInvoices = invoices.length
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0)
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length
  
  const completionRate = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0
  
  const statusCounts = {
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: paidInvoices,
    overdue: overdueCount,
  }

  const recentActivity = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-violet-500/20">
              <FileText className="w-6 h-6 text-violet-400" />
            </div>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{totalInvoices > 0 ? '12%' : '0%'}
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{totalInvoices}</p>
          <p className="text-sm text-white/60">Total Invoices</p>
        </div>

        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-sm text-white/60">Total Revenue</p>
        </div>

        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-white/60">{completionRate}%</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatCurrency(paidAmount)}</p>
          <p className="text-sm text-white/60">Paid Amount</p>
        </div>

        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-rose-500/20">
              <AlertCircle className="w-6 h-6 text-rose-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{overdueCount}</p>
          <p className="text-sm text-white/60">Overdue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-white mb-6">Invoice Status Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = totalInvoices > 0 ? (count / totalInvoices) * 100 : 0
              const colors = {
                draft: 'bg-slate-500',
                sent: 'bg-blue-500',
                paid: 'bg-emerald-500',
                overdue: 'bg-rose-500',
              }
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80 capitalize">{status}</span>
                    <span className="text-white/60">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors[status as keyof typeof colors]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-white/40 text-center py-8">No recent activity</p>
            ) : (
              recentActivity.map((invoice, idx) => (
                <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      invoice.status === 'paid' ? 'bg-emerald-400' : 
                      invoice.status === 'overdue' ? 'bg-rose-400' : 'bg-blue-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-white">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-white/50">{invoice.clientName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{formatCurrency(invoice.total)}</p>
                    <p className="text-xs text-white/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}