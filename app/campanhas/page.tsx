'use client'

import { useEffect, useState } from 'react'
import { supabase, LeadZattar } from '@/lib/supabase'
import MetricCard from '@/components/MetricCard'
import { Target, Users, CheckCircle, TrendingUp, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface CampaignData {
  nome_campanha: string
  total_leads: number
  decisores_encontrados: number
  taxa_decisor: number
  atendimentos_finalizados: number
  taxa_finalizacao: number
  data_inicio: string
  data_fim: string
  leads_por_dia: { data: string; leads: number; decisores: number }[]
}

export default function CampanhasPage() {
  const [leads, setLeads] = useState<LeadZattar[]>([])
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>('todas')
  const [loading, setLoading] = useState(true)

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
      calculateCampaignData(data || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCampaignData = (data: LeadZattar[]) => {
    const campaignMap = new Map<string, CampaignData>()
    
    data.forEach(lead => {
      const campanha = lead.nome_campanha || 'Sem campanha'
      
      if (!campaignMap.has(campanha)) {
        campaignMap.set(campanha, {
          nome_campanha: campanha,
          total_leads: 0,
          decisores_encontrados: 0,
          taxa_decisor: 0,
          atendimentos_finalizados: 0,
          taxa_finalizacao: 0,
          data_inicio: lead.created_at || '',
          data_fim: lead.created_at || '',
          leads_por_dia: []
        })
      }
      
      const campaign = campaignMap.get(campanha)!
      campaign.total_leads++
      
      if (lead.responsavel_encontrado) {
        campaign.decisores_encontrados++
      }
      
      if (lead.atendimentofinalizado) {
        campaign.atendimentos_finalizados++
      }

      // Atualizar datas
      if (lead.created_at) {
        if (lead.created_at < campaign.data_inicio) {
          campaign.data_inicio = lead.created_at
        }
        if (lead.created_at > campaign.data_fim) {
          campaign.data_fim = lead.created_at
        }
      }
    })

    // Calcular taxas e dados por dia
    campaignMap.forEach(campaign => {
      campaign.taxa_decisor = campaign.total_leads > 0 
        ? (campaign.decisores_encontrados / campaign.total_leads) * 100 
        : 0
      
      campaign.taxa_finalizacao = campaign.total_leads > 0 
        ? (campaign.atendimentos_finalizados / campaign.total_leads) * 100 
        : 0

      // Agrupar por dia
      const leadsPorDia = new Map<string, { leads: number; decisores: number }>()
      
      data
        .filter(lead => (lead.nome_campanha || 'Sem campanha') === campaign.nome_campanha)
        .forEach(lead => {
          if (lead.created_at) {
            const dia = lead.created_at.split('T')[0] // YYYY-MM-DD
            if (!leadsPorDia.has(dia)) {
              leadsPorDia.set(dia, { leads: 0, decisores: 0 })
            }
            leadsPorDia.get(dia)!.leads++
            if (lead.responsavel_encontrado) {
              leadsPorDia.get(dia)!.decisores++
            }
          }
        })

      campaign.leads_por_dia = Array.from(leadsPorDia.entries())
        .map(([data, valores]) => ({
          data,
          ...valores
        }))
        .sort((a, b) => a.data.localeCompare(b.data))
    })

    setCampaigns(Array.from(campaignMap.values()))
  }

  const selectedCampaignData = selectedCampaign === 'todas' 
    ? null 
    : campaigns.find(c => c.nome_campanha === selectedCampaign)

  const totalCampaigns = campaigns.length
  const totalLeadsAllCampaigns = campaigns.reduce((sum, c) => sum + c.total_leads, 0)
  const totalDecisoresAllCampaigns = campaigns.reduce((sum, c) => sum + c.decisores_encontrados, 0)
  const mediaTaxaDecisor = campaigns.length > 0 
    ? campaigns.reduce((sum, c) => sum + c.taxa_decisor, 0) / campaigns.length 
    : 0

  const formatDate = (dateString: string) => {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campanhas</h1>
        <p className="text-gray-600 mt-2">
          Análise detalhada de performance e resultados por campanha
        </p>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Campanhas"
          value={totalCampaigns}
          icon={Target}
        />
        
        <MetricCard
          title="Total de Leads"
          value={totalLeadsAllCampaigns.toLocaleString()}
          description="Todas as campanhas"
          icon={Users}
        />
        
        <MetricCard
          title="Decisores Encontrados"
          value={totalDecisoresAllCampaigns.toLocaleString()}
          description="Todas as campanhas"
          icon={CheckCircle}
        />
        
        <MetricCard
          title="Taxa Média de Sucesso"
          value={`${mediaTaxaDecisor.toFixed(1)}%`}
          description="Média entre campanhas"
          icon={TrendingUp}
        />
      </div>

      {/* Seletor de Campanha */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecionar Campanha para Análise Detalhada
        </label>
        <select
          className="w-full md:w-1/3 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={selectedCampaign}
          onChange={(e) => setSelectedCampaign(e.target.value)}
        >
          <option value="todas">Visão Geral</option>
          {campaigns.map(campaign => (
            <option key={campaign.nome_campanha} value={campaign.nome_campanha}>
              {campaign.nome_campanha}
            </option>
          ))}
        </select>
      </div>

      {/* Gráfico de Performance Geral */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Performance por Campanha
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={campaigns}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="nome_campanha" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'total_leads') return [value, 'Total de Leads']
                if (name === 'decisores_encontrados') return [value, 'Decisores Encontrados']
                return [value, name]
              }}
            />
            <Bar dataKey="total_leads" fill="#E5E7EB" name="total_leads" />
            <Bar dataKey="decisores_encontrados" fill="#3B82F6" name="decisores_encontrados" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Análise da Campanha Selecionada */}
      {selectedCampaignData && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Detalhes da Campanha: {selectedCampaignData.nome_campanha}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedCampaignData.total_leads}
                </div>
                <div className="text-sm text-gray-600">Total de Leads</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {selectedCampaignData.decisores_encontrados}
                </div>
                <div className="text-sm text-gray-600">Decisores Encontrados</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedCampaignData.taxa_decisor.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Taxa de Sucesso</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Período: {formatDate(selectedCampaignData.data_inicio)} - {formatDate(selectedCampaignData.data_fim)}</span>
              </div>
              <div>
                <span>Taxa de Finalização: {selectedCampaignData.taxa_finalizacao.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Evolução Temporal */}
          {selectedCampaignData.leads_por_dia.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Evolução Diária - {selectedCampaignData.nome_campanha}
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedCampaignData.leads_por_dia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="data" 
                    tickFormatter={(value) => formatDate(value)}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value, name) => {
                      if (name === 'leads') return [value, 'Leads']
                      if (name === 'decisores') return [value, 'Decisores']
                      return [value, name]
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="leads"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="decisores" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="decisores"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Ranking de Campanhas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Ranking de Campanhas por Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campanha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Leads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Decisores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa de Sucesso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns
                .sort((a, b) => b.taxa_decisor - a.taxa_decisor)
                .map((campaign, index) => (
                <tr key={campaign.nome_campanha} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {campaign.nome_campanha}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.total_leads.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.decisores_encontrados}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campaign.taxa_decisor >= 50 
                        ? 'bg-green-100 text-green-800'
                        : campaign.taxa_decisor >= 25
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.taxa_decisor.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(campaign.data_inicio)} - {formatDate(campaign.data_fim)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}