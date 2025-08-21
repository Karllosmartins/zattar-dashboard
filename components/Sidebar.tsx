'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Target, 
  Calendar,
  Settings,
  Home,
  Send,
  Menu,
  X,
  LogOut
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

interface SidebarProps {
  user?: {
    name: string
    email: string
    role: string
  }
  onLogout?: () => void
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Abrir sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">
          MySellers Dashboard
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Fechar sidebar</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <SidebarContent pathname={pathname} user={user} onLogout={onLogout} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent pathname={pathname} user={user} onLogout={onLogout} />
      </div>
    </>
  )
}

function SidebarContent({ 
  pathname, 
  user, 
  onLogout 
}: { 
  pathname: string
  user?: { name: string; email: string; role: string }
  onLogout?: () => void 
}) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <Image
          className="h-8 w-auto"
          src="/mysellers-logo.png"
          alt="MySellers"
          width={200}
          height={32}
          priority
        />
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors ${
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          
          {/* User info and logout */}
          {user && (
            <li className="mt-auto">
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
                    <span className="text-sm font-medium text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.role}</div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-gray-400 hover:text-white"
                    title="Sair"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}