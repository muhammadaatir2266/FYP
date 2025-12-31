import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MediAssist AI - Virtual Medical Assistant',
  description: 'AI-Powered Virtual Medical Assistant and Smart Doctor Calling Agent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

