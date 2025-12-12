import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// @ts-ignore: allow side-effect import of global CSS without type declarations
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pulse Gym Management System',
  description: 'Comprehensive gym management system for Pulse Gym',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}