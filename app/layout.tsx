import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Registro de licencias',
  description: 'Creado para el curso de Métodos Ágiles'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
