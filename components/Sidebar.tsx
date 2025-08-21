'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Target, 
  Calendar,
  Settings,
  Home,
  Send
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Atendimentos', href: '/atendimentos', icon: MessageSquare },
  { name: 'Campanhas', href: '/campanhas', icon: Target },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Disparo', href: '/disparo', icon: Send },
  { name: 'Agendamentos', href: '/agendamentos', icon: Calendar },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white">Zattar CRM</h1>
      </div>
      
      <nav className="flex flex-1 flex-col px-6 py-4">
        <ul className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex gap-x-3 rounded-md p-3 text-sm font-medium leading-6 transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}