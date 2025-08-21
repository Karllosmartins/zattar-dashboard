'use client'

import { useEffect, useState } from 'react'
import { supabase, LeadZattar } from '@/lib/supabase'
import { Search, Filter, Download, Eye } from 'lucide-react'

export default function AtendimentosPage() {
  const [leads, setLeads] = useState<LeadZattar[]>([])
  const [filteredLeads, setFilteredLeads] = useState<LeadZattar[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [campanhaFilter, setCampanhaFilter] = useState('todas')
  const [campanhas, setCampanhas] = useState<string[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, searchTerm, statusFilter, campanhaFilter])

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_zattar')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setLeads(data || [])
      
      // Extrair campanhas únicas
      const uniqueCampanhas = [...new Set((data || [])
        .map(lead => lead.nome_campanha)
        .filter(Boolean)
      )] as string[]
      setCampanhas(uniqueCampanhas)
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLeads = () => {
    let filtered = leads

    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.nome_empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.numero_formatado?.includes(searchTerm) ||
        lead.cnpj?.includes(searchTerm)
      )
    }

    // Filtro por status
    if (statusFilter !== 'todos') {
      switch (statusFilter) {
        case 'decisor_encontrado':
          filtered = filtered.filter(lead => lead.responsavel_encontrado)
          break
        case 'decisor_nao_encontrado':
          filtered = filtered.filter(lead => !lead.responsavel_encontrado)
          break
        case 'finalizado':
          filtered = filtered.filter(lead => lead.atendimentofinalizado)
          break
        case 'em_andamento':
          filtered = filtered.filter(lead => !lead.atendimentofinalizado)
          break
      }
    }

    // Filtro por campanha
    if (campanhaFilter !== 'todas') {
      filtered = filtered.filter(lead => lead.nome_campanha === campanhaFilter)
    }

    setFilteredLeads(filtered)
  }

  const getStatusBadge = (lead: LeadZattar) => {
    if (lead.responsavel_encontrado) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Decisor Encontrado
        </span>
      )
    }
    
    if (lead.atendimentofinalizado) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Finalizado
        </span>
      )
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Em Andamento
      </span>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
      return dateString
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Atendimentos</h1>
        <p className="text-gray-600 mt-2">
          Visualize e gerencie todos os atendimentos e interações
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, empresa, telefone..."
              className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="decisor_encontrado">Decisor Encontrado</option>
            <option value="decisor_nao_encontrado">Decisor Não Encontrado</option>
            <option value="finalizado">Finalizado</option>
            <option value="em_andamento">Em Andamento</option>
          </select>

          {/* Campanha */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={campanhaFilter}
            onChange={(e) => setCampanhaFilter(e.target.value)}
          >
            <option value="todas">Todas as campanhas</option>
            {campanhas.map(campanha => (
              <option key={campanha} value={campanha}>{campanha}</option>
            ))}
          </select>

          {/* Exportar */}
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Exibindo {filteredLeads.length} de {leads.length} atendimentos
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campanha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.nome_cliente || '-'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lead.cnpj || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.nome_empresa || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.numero_formatado || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.nome_campanha || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(lead)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Agente {lead.Agente_ID || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum atendimento encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  )
}