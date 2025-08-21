'use client'

import { useEffect, useState } from 'react'
import { supabase, LeadZattar } from '@/lib/supabase'
import { Phone, Mail, Building, Calendar, User } from 'lucide-react'

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadZattar[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<LeadZattar | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_zattar')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleString('pt-BR')
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
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-2">
          Visualização detalhada de todos os leads e contatos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Leads */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Lista de Leads ({leads.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedLead?.id === lead.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {lead.nome_cliente || 'Cliente não informado'}
                        </h4>
                        {lead.responsavel_encontrado && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Decisor ✓
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {lead.nome_empresa || 'Empresa não informada'}
                          </span>
                          {lead.numero_formatado && (
                            <span className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {lead.numero_formatado}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>Campanha: {lead.nome_campanha || '-'}</span>
                        <span>Agente: {lead.Agente_ID || '-'}</span>
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      {lead.atendimentofinalizado ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Finalizado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Em andamento
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detalhes do Lead Selecionado */}
        <div className="lg:col-span-1">
          {selectedLead ? (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalhes do Lead
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Informações Pessoais */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Informações Pessoais
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Nome:</span>
                      <span className="ml-2 text-gray-900">{selectedLead.nome_cliente || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Telefone:</span>
                      <span className="ml-2 text-gray-900">{selectedLead.numero_formatado || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2 text-gray-900">{selectedLead.email_usuario || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Informações da Empresa */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Empresa
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Nome:</span>
                      <span className="ml-2 text-gray-900">{selectedLead.nome_empresa || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">CNPJ:</span>
                      <span className="ml-2 text-gray-900">{selectedLead.cnpj || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Site:</span>
                      <span className="ml-2 text-gray-900">{selectedLead.site_usuario || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Status do Atendimento */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Status do Atendimento
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Decisor Encontrado:</span>
                      <span className={`text-sm font-medium ${
                        selectedLead.responsavel_encontrado ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedLead.responsavel_encontrado ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Responsável Seguro:</span>
                      <span className={`text-sm font-medium ${
                        selectedLead.responsavel_seguro ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedLead.responsavel_seguro ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Atendimento Finalizado:</span>
                      <span className={`text-sm font-medium ${
                        selectedLead.atendimentofinalizado ? 'text-blue-600' : 'text-yellow-600'
                      }`}>
                        {selectedLead.atendimentofinalizado ? 'Sim' : 'Em andamento'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">WhatsApp Ativo:</span>
                      <span className={`text-sm font-medium ${
                        selectedLead.existe_whatsapp ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedLead.existe_whatsapp ? 'Sim' : 'Não'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informações do Atendimento */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Atendimento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Campanha:</span>
                      <span className="ml-2 text-gray-900">{selectedLead.nome_campanha || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Agente:</span>
                      <span className="ml-2 text-gray-900">Agente {selectedLead.Agente_ID || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Criado em:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedLead.created_at)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Última Interação:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedLead.user_lastinteraction)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tokens Utilizados:</span>
                      <span className="ml-2 text-gray-900">{selectedLead.tokens || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Agendamento (se houver) */}
                {(selectedLead.data_agendamento || selectedLead.hora_agendamento) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Agendamento
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Data:</span>
                        <span className="ml-2 text-gray-900">{selectedLead.data_agendamento || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Hora:</span>
                        <span className="ml-2 text-gray-900">{selectedLead.hora_agendamento || '-'}</span>
                      </div>
                      {selectedLead.link_meet && (
                        <div>
                          <span className="text-gray-500">Link Meet:</span>
                          <a 
                            href={selectedLead.link_meet} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            Acessar reunião
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4" />
                <p>Selecione um lead da lista para ver os detalhes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}