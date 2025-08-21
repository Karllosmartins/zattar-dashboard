'use client'

import { useEffect, useState } from 'react'
import { supabase, LeadZattar } from '@/lib/supabase'
import MetricCard from '@/components/MetricCard'
import { Users, Target, CheckCircle, TrendingUp, DollarSign, Building } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface CampaignMetrics {
  nome_campanha: string
  total_leads: number
  decisores_encontrados: number
  taxa_sucesso: number
  atendimentos_finalizados: number
  socios_unicos: number
  custo_enriquecimento: number
  empresas_distintas: number
}

interface AgentMetrics {
  agente_id: string
  total_atendimentos: number
  decisores_encontrados: number
  taxa_sucesso: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function RelatoriosPage() {
  const [leads, setLeads] = useState<LeadZattar[]>([])
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetrics[]>([])
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_zattar')
        .select('*')
      
      if (error) throw error
      
      setLeads(data || [])
      calculateMetrics(data || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateMetrics = (data: LeadZattar[]) => {
    // Métricas por campanha
    const campaignMap = new Map<string, CampaignMetrics>()
    
    // Para calcular sócios únicos, vamos usar nome_cliente + cnpj + nome_empresa como chave única
    const sociosUnicosPorCampanha = new Map<string, Set<string>>()
    const empresasPorCampanha = new Map<string, Set<string>>()
    
    data.forEach(lead => {
      const campanha = lead.nome_campanha || 'Sem campanha'
      
      if (!campaignMap.has(campanha)) {
        campaignMap.set(campanha, {
          nome_campanha: campanha,
          total_leads: 0,
          decisores_encontrados: 0,
          taxa_sucesso: 0,
          atendimentos_finalizados: 0,
          socios_unicos: 0,
          custo_enriquecimento: 0,
          empresas_distintas: 0
        })
      }
      
      if (!sociosUnicosPorCampanha.has(campanha)) {
        sociosUnicosPorCampanha.set(campanha, new Set<string>())
      }
      
      if (!empresasPorCampanha.has(campanha)) {
        empresasPorCampanha.set(campanha, new Set<string>())
      }
      
      const metric = campaignMap.get(campanha)!
      metric.total_leads++
      
      // Criar chave única para sócio: nome + cnpj + empresa
      const chaveUnicaSocio = `${lead.nome_cliente || 'sem-nome'}-${lead.cnpj || 'sem-cnpj'}-${lead.nome_empresa || 'sem-empresa'}`
      sociosUnicosPorCampanha.get(campanha)!.add(chaveUnicaSocio)
      
      // Contar empresas distintas
      if (lead.cnpj) {
        empresasPorCampanha.get(campanha)!.add(lead.cnpj)
      }
      
      if (lead.responsavel_encontrado) {
        metric.decisores_encontrados++
      }
      
      if (lead.atendimentofinalizado) {
        metric.atendimentos_finalizados++
      }
    })

    campaignMap.forEach((metric, campanha) => {
      metric.taxa_sucesso = metric.total_leads > 0 
        ? (metric.decisores_encontrados / metric.total_leads) * 100 
        : 0
      
      // Calcular sócios únicos e custo
      metric.socios_unicos = sociosUnicosPorCampanha.get(campanha)?.size || 0
      metric.custo_enriquecimento = metric.socios_unicos * 0.30 // R$ 0,30 por sócio
      metric.empresas_distintas = empresasPorCampanha.get(campanha)?.size || 0
    })

    setCampaignMetrics(Array.from(campaignMap.values()))

    // Métricas por agente
    const agentMap = new Map<string, AgentMetrics>()
    
    data.forEach(lead => {
      const agente = lead.Agente_ID || 'Sem agente'
      if (!agentMap.has(agente)) {
        agentMap.set(agente, {
          agente_id: agente,
          total_atendimentos: 0,
          decisores_encontrados: 0,
          taxa_sucesso: 0
        })
      }
      
      const metric = agentMap.get(agente)!
      metric.total_atendimentos++
      
      if (lead.responsavel_encontrado) {
        metric.decisores_encontrados++
      }
    })

    agentMap.forEach(metric => {
      metric.taxa_sucesso = metric.total_atendimentos > 0 
        ? (metric.decisores_encontrados / metric.total_atendimentos) * 100 
        : 0
    })

    setAgentMetrics(Array.from(agentMap.values()))
  }

  const totalLeads = leads.length
  const decisoresEncontrados = leads.filter(lead => lead.responsavel_encontrado).length
  const atendimentosFinalizados = leads.filter(lead => lead.atendimentofinalizado).length
  const taxaDecisor = totalLeads > 0 ? (decisoresEncontrados / totalLeads) * 100 : 0
  
  // Calcular totais de sócios únicos e custo
  const totalSociosUnicos = campaignMetrics.reduce((sum, c) => sum + c.socios_unicos, 0)
  const custoTotalEnriquecimento = campaignMetrics.reduce((sum, c) => sum + c.custo_enriquecimento, 0)
  const totalEmpresasDistintas = campaignMetrics.reduce((sum, c) => sum + c.empresas_distintas, 0)

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios de Performance</h1>
        <p className="text-gray-600 mt-2">
          Análise detalhada de campanhas e eficiência na identificação de decisores
        </p>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <MetricCard
          title="Total de Leads"
          value={totalLeads.toLocaleString()}
          description="Registros na base"
          icon={Users}
        />
        
        <MetricCard
          title="Sócios Únicos"
          value={totalSociosUnicos.toLocaleString()}
          description="Contatos enriquecidos"
          icon={Building}
        />
        
        <MetricCard
          title="Custo Enriquecimento"
          value={`R$ ${custoTotalEnriquecimento.toFixed(2)}`}
          description={`${totalSociosUnicos} sócios × R$ 0,30`}
          icon={DollarSign}
        />
        
        <MetricCard
          title="Decisores Encontrados"
          value={decisoresEncontrados.toLocaleString()}
          description={`${taxaDecisor.toFixed(1)}% do total`}
          icon={Target}
        />
        
        <MetricCard
          title="Empresas Distintas"
          value={totalEmpresasDistintas.toLocaleString()}
          description="CNPJs únicos"
          icon={Building}
        />
        
        <MetricCard
          title="Taxa de Conversão"
          value={`${taxaDecisor.toFixed(1)}%`}
          description="Decisores / Total de leads"
          icon={TrendingUp}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enriquecimento por Campanha */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Enriquecimento por Campanha
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignMetrics}>
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
                  if (name === 'socios_unicos') return [value, 'Sócios Únicos']
                  return [value, name]
                }}
              />
              <Bar dataKey="total_leads" fill="#E5E7EB" name="total_leads" />
              <Bar dataKey="socios_unicos" fill="#10B981" name="socios_unicos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição de Decisores */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Distribuição de Sócios Únicos por Campanha
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={campaignMetrics}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome_campanha, socios_unicos }) => 
                  `${nome_campanha}: ${socios_unicos} sócios`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="socios_unicos"
              >
                {campaignMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} sócios únicos`, 'Quantidade']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custo por Campanha */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Custo de Enriquecimento por Campanha
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nome_campanha" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Custo']}
              />
              <Bar dataKey="custo_enriquecimento" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabelas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ranking de Campanhas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Ranking de Campanhas por Enriquecimento
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campanha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sócios Únicos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Decisores
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaignMetrics
                  .sort((a, b) => b.socios_unicos - a.socios_unicos)
                  .map((campaign, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {campaign.nome_campanha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.socios_unicos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {campaign.custo_enriquecimento.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.empresas_distintas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.decisores_encontrados}/{campaign.total_leads}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance por Agente */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Performance por Agente
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa de Sucesso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atendimentos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agentMetrics
                  .sort((a, b) => b.taxa_sucesso - a.taxa_sucesso)
                  .map((agent, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Agente {agent.agente_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.taxa_sucesso.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.total_atendimentos}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}