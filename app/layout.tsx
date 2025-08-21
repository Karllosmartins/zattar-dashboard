import './globals.css'
import AuthWrapper from '@/components/AuthWrapper'

export const metadata = {
  title: 'MySellers Dashboard',
  description: 'Sistema de análise de leads e campanhas MySellers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}