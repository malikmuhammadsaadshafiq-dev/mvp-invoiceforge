'use client';

import { Invoice } from '@/app/page';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DollarSign, FileText, CheckCircle, Clock } from 'lucide-react';

interface DashboardViewProps {
  invoices: Invoice[];
}

export function DashboardView({ invoices }: DashboardViewProps) {
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const unpaidAmount = totalRevenue - paidAmount;
  const paidCount = invoices.filter(inv => inv.status === 'paid').length;
  const completionRate = invoices.length > 0 ? Math.round((paidCount / invoices.length) * 100) : 0;

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#FF6B6B] border-4 border-black flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
            <span className="text-xs font-bold uppercase bg-green-400 border-2 border-black px-2 py-1">Total</span>
          </div>
          <p className="text-3xl font-black text-black mb-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Revenue</p>
        </div>

        <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-400 border-4 border-black flex items-center justify-center">
              <FileText className="w-6 h-6 text-black" />
            </div>
            <span className="text-xs font-bold uppercase bg-blue-200 border-2 border-black px-2 py-1">{invoices.length}</span>
          </div>
          <p className="text-3xl font-black text-black mb-1">{invoices.length}</p>
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Invoices</p>
        </div>

        <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-400 border-4 border-black flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-black" />
            </div>
            <span className="text-xs font-bold uppercase bg-green-200 border-2 border-black px-2 py-1">{completionRate}%</span>
          </div>
          <p className="text-3xl font-black text-black mb-1">{formatCurrency(paidAmount)}</p>
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Paid Amount</p>
        </div>

        <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-400 border-4 border-black flex items-center justify-center">
              <Clock className="w-6 h-6 text-black" />
            </div>
            <span className="text-xs font-bold uppercase bg-yellow-200 border-2 border-black px-2 py-1">Pending</span>
          </div>
          <p className="text-3xl font-black text-black mb-1">{formatCurrency(unpaidAmount)}</p>
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Outstanding</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6">
          <h3 className="text-xl font-black text-black uppercase mb-6 tracking-tight">Payment Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-black">Paid</span>
                <span className="font-bold text-green-600">{paidCount} invoices</span>
              </div>
              <div className="w-full bg-gray-200 border-2 border-black h-4">
                <div 
                  className="bg-green-400 h-full border-r-2 border-black transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-black">Unpaid</span>
                <span className="font-bold text-yellow-600">{invoices.length - paidCount} invoices</span>
              </div>
              <div className="w-full bg-gray-200 border-2 border-black h-4">
                <div 
                  className="bg-yellow-400 h-full border-r-2 border-black transition-all duration-500"
                  style={{ width: `${100 - completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6">
          <h3 className="text-xl font-black text-black uppercase mb-6 tracking-tight">Recent Activity</h3>
          <div className="space-y-3">
            {recentInvoices.map((invoice, index) => (
              <div 
                key={invoice.id} 
                className="flex items-center justify-between p-3 border-2 border-black bg-[#FFFEF0] hover:bg-white transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 border-2 border-black ${invoice.status === 'paid' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <div>
                    <p className="font-bold text-black text-sm">{invoice.clientName}</p>
                    <p className="text-xs text-gray-600">{invoice.invoiceNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">{formatCurrency(invoice.total)}</p>
                  <p className={`text-xs font-bold uppercase ${invoice.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {invoice.status}
                  </p>
                </div>
              </div>
            ))}
            {recentInvoices.length === 0 && (
              <p className="text-center text-gray-600 font-medium py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}