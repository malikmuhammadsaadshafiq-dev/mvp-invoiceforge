'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Download, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  invoices: any[];
}

export function SettingsView({ darkMode, onToggleDarkMode, userName, onUpdateUserName, invoices }: SettingsViewProps) {
  const [nameInput, setNameInput] = useState(userName);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNameInput(userName);
  }, [userName]);

  const handleSaveName = () => {
    onUpdateUserName(nameInput);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(invoices, null, 2);
    navigator.clipboard.writeText(dataStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
          <User className="w-8 h-8 text-black" />
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">Profile Settings</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-bold text-black uppercase text-sm tracking-wide">Display Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. John Smith"
                className="flex-1 p-3 border-4 border-black bg-[#FFFEF0] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all"
              />
              <button
                onClick={handleSaveName}
                className="px-6 bg-[#FF6B6B] border-4 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:-translate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 transition-all"
              >
                Save
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-black uppercase text-sm tracking-wide">Appearance</label>
            <button
              onClick={onToggleDarkMode}
              className={cn(
                "w-full flex items-center justify-between p-4 border-4 border-black transition-all",
                darkMode ? "bg-gray-900 text-white" : "bg-[#FFFEF0] text-black"
              )}
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span className="font-bold uppercase">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <div className={cn(
                "w-12 h-6 border-2 border-black relative",
                darkMode ? "bg-[#FF6B6B]" : "bg-gray-300"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 bg-white border-2 border-black transition-all",
                  darkMode ? "left-7" : "left-0.5"
                )} />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
          <Download className="w-8 h-8 text-black" />
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">Data Management</h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 font-medium">
            Export all your invoice data as JSON. This can be used for backups or importing into other systems.
          </p>
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-center gap-2 bg-green-400 border-4 border-black py-4 font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:-translate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 transition-all"
          >
            <Download className="w-5 h-5" />
            {copied ? 'Copied to Clipboard!' : 'Export Data to JSON'}
          </button>
        </div>
      </div>

      <div className="bg-gray-100 border-4 border-black p-6">
        <h3 className="font-bold text-black uppercase mb-2">About InvoiceForge</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          InvoiceForge is a professional invoice generation tool built with Next.js and TypeScript. 
          Create beautiful, printable invoices with automatic calculations and client-side PDF export.
        </p>
        <div className="mt-4 pt-4 border-t-2 border-gray-300">
          <p className="text-xs text-gray-500 font-medium">Version 1.0.0 • Built with Neobrutalism Design</p>
        </div>
      </div>
    </div>
  );
}