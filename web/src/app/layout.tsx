import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MoneyBudget',
  description: 'Zero-based budgeting made simple',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-bgApp text-textPrimary min-h-screen">
        {children}
      </body>
    </html>
  )
}
