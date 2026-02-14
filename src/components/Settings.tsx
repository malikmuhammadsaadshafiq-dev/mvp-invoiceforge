'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, User, Download, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsProps {
  darkMode: boolean
  onDarkModeChange: (value: boolean) => void
  userName: string
  onUserNameChange: (value: string) => void
  invoices: any[]
}

export function Settings({ darkMode, onDarkModeChange, userName, onUserNameChange, invoices }: SettingsProps) {
  const [nameInput, setNameInput] = useState(userName)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setNameInput(userName)
  }, [userName])

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUserNameChange(nameInput)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(invoices, null, 2)
    navigator.clipboard.writeText(dataStr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card p-6 fade-in-up">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-violet-400" />
          Profile Settings
        </h3>
        
        <form onSubmit={handleNameSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Display Name</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g., Alex Johnson"
              className="w-full glass-input px-4 py-2.5 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="gradient-btn px-6 py-2.5 rounded-lg text-white font-medium text-sm"
          >
            Save Name
          </button>
        </form>
      </div>

      <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          {darkMode ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
          Appearance
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Dark Mode</p>
            <p className="text-sm text-white/60">Toggle between light and dark themes</p>
          </div>
          <button
            onClick={() => onDarkModeChange(!darkMode)}
            className={cn(
              'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
              darkMode ? 'bg-violet-600' : 'bg-white/20'
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                darkMode ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>

      <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Download className="w-5 h-5 text-violet-400" />
          Data Management
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Export Data</p>
              <p className="text-sm text-white/60">Copy all invoice data to clipboard as JSON</p>
            </div>
            <button
              onClick={handleExport}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all',
                copied 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              )}
            >
              {copied ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Export'}
            </button>
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-white/40">
              Total invoices stored: {invoices.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}