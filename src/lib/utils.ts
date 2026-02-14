import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatNumber(num: number): string { return new Intl.NumberFormat('en-US').format(num); }

export function generateId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export function truncate(str: string, len: number): string { return str.length > len ? str.slice(0, len) + '...' : str; }

export function slugify(str: string): string { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
