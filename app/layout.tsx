import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata = {
  title: 'Zattar CRM - Dashboard',
  description: 'Sistema de análise de leads e campanhas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}