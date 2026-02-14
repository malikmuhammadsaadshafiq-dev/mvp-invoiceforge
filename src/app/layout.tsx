import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';

const archivo = Archivo({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  title: 'InvoiceForge - Professional Invoice Generator',
  description: 'Generate professional invoices instantly in the browser with client-side PDF export and automatic calculations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className={`${archivo.className} antialiased`}>{children}</body>
    </html>
  );
}