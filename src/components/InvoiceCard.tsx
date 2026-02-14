'use client';

import { useState } from 'react';
import { Download, Trash2, Edit, FileText } from 'lucide-react';
import { Invoice } from '@/app/page';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface InvoiceCardProps {
  invoice: Invoice;
  onDelete: (id: string) => void;
  onEdit: (invoice: Invoice) => void;
  onExportPDF: (invoice: Invoice) => void;
}

export function InvoiceCard({ invoice, onDelete, onEdit, onExportPDF }: InvoiceCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(invoice.id);
    }, 300);
  };

  return (
    <div className={cn(
      "bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000]",
      isDeleting && "opacity-0 -translate-x-full"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF6B6B] border-4 border-black flex items-center justify-center">
            <FileText className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-black leading-tight">{invoice.clientName}</h3>
            <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
          </div>
        </div>
        <span className={cn(
          "px-3 py-1 border-2 border-black font-bold text-xs uppercase",
          invoice.status === 'paid' ? "bg-green-400" : "bg-yellow-400"
        )}>
          {invoice.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Invoice #:</span>
          <span className="font-bold text-black">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date:</span>
          <span className="font-bold text-black">{formatDate(invoice.date)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Due:</span>
          <span className="font-bold text-black">{formatDate(invoice.dueDate)}</span>
        </div>
      </div>

      <div className="border-t-4 border-black pt-4 mb-4">
        <div className="flex justify-between items-baseline">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-2xl font-black text-black">{formatCurrency(invoice.total)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(invoice)}
          className="flex-1 bg-white border-4 border-black py-2 font-bold uppercase text-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onExportPDF(invoice)}
          className="flex-1 bg-[#FF6B6B] border-4 border-black py-2 font-bold uppercase text-sm shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-400 border-4 border-black p-2 shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all"
        >
          <Trash2 className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
}