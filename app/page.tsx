import Link from 'next/link'
import { BarChart3, Users, Target, MessageSquare } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Zattar</h1>
        <p className="text-gray-600 mt-2">
          Sistema de análise de leads e performance de campanhas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/relatorios" className="group">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  Relatórios
                </h3>
                <p className="text-sm text-gray-500">
                  Análise de decisores e campanhas
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/atendimentos" className="group">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                  Atendimentos
                </h3>
                <p className="text-sm text-gray-500">
                  Conversas e interações
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/campanhas" className="group">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600">
                  Campanhas
                </h3>
                <p className="text-sm text-gray-500">
                  Performance e resultados
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/leads" className="group">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600">
                  Leads
                </h3>
                <p className="text-sm text-gray-500">
                  Gestão de contatos
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}