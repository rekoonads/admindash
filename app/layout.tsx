import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KOODOS Admin Dashboard',
  description: 'Gaming content management system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider domain={process.env.NEXT_PUBLIC_CLERK_DOMAIN}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`} suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}