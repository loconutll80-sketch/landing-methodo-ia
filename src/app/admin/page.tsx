"use client"

import { useState, useEffect } from 'react'
import { leadService, saleService, testimonialService, analyticsService } from '@/lib/database'
import { Users, DollarSign, MessageSquare, TrendingUp, Eye, Target, Calendar, Download } from 'lucide-react'
import type { Lead, Sale, Testimonial } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalSales: 0,
    totalRevenue: 0,
    conversionRate: 0,
    todayViews: 0,
    todayLeads: 0
  })
  
  const [leads, setLeads] = useState<Lead[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'sales' | 'testimonials'>('overview')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Carregar dados
      const [leadsData, salesData, testimonialsData, todayAnalytics] = await Promise.all([
        leadService.getAll(),
        saleService.getAll(),
        testimonialService.getAll(),
        analyticsService.getToday()
      ])

      setLeads(leadsData || [])
      setSales(salesData || [])
      setTestimonials(testimonialsData || [])

      // Calcular estatísticas
      const completedSales = salesData?.filter(sale => sale.status === 'completed') || []
      const totalRevenue = completedSales.reduce((sum, sale) => sum + Number(sale.amount), 0)
      const conversionRate = leadsData?.length ? (completedSales.length / leadsData.length) * 100 : 0

      setStats({
        totalLeads: leadsData?.length || 0,
        totalSales: completedSales.length,
        totalRevenue,
        conversionRate,
        todayViews: todayAnalytics?.page_views || 0,
        todayLeads: todayAnalytics?.leads_captured || 0
      })

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveTestimonial = async (testimonialId: string) => {
    try {
      await testimonialService.approve(testimonialId)
      await loadDashboardData() // Recarregar dados
    } catch (error) {
      console.error('Erro ao aprovar depoimento:', error)
    }
  }

  const exportLeads = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Fonte', 'Data', 'Convertido'],
      ...leads.map(lead => [
        lead.name || '',
        lead.email,
        lead.phone || '',
        lead.source,
        new Date(lead.created_at).toLocaleDateString('pt-BR'),
        lead.converted ? 'Sim' : 'Não'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">
              Dashboard Administrativo
            </span>
          </h1>
          <p className="text-gray-400">Método IA 100→500 - Painel de Controle</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">{stats.todayViews}</span>
            </div>
            <p className="text-gray-400 text-sm">Visualizações Hoje</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{stats.todayLeads}</span>
            </div>
            <p className="text-gray-400 text-sm">Leads Hoje</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">{stats.totalLeads}</span>
            </div>
            <p className="text-gray-400 text-sm">Total de Leads</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{stats.totalSales}</span>
            </div>
            <p className="text-gray-400 text-sm">Vendas</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">
                R$ {stats.totalRevenue.toFixed(2)}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Receita Total</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold text-orange-400">
                {stats.conversionRate.toFixed(1)}%
              </span>
            </div>
            <p className="text-gray-400 text-sm">Conversão</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          {[
            { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
            { id: 'leads', label: 'Leads', icon: Users },
            { id: 'sales', label: 'Vendas', icon: DollarSign },
            { id: 'testimonials', label: 'Depoimentos', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-500/20 to-blue-500/20 border-b-2 border-yellow-500 text-yellow-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Últimos Leads</h3>
                  <div className="space-y-3">
                    {leads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="font-medium">{lead.name || 'Nome não informado'}</p>
                          <p className="text-sm text-gray-400">{lead.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            lead.converted 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {lead.converted ? 'Convertido' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-400">Últimas Vendas</h3>
                  <div className="space-y-3">
                    {sales.slice(0, 5).map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="font-medium">{sale.name || 'Nome não informado'}</p>
                          <p className="text-sm text-gray-400">{sale.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-400">R$ {Number(sale.amount).toFixed(2)}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            sale.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400'
                              : sale.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {sale.status === 'completed' ? 'Pago' : 
                             sale.status === 'pending' ? 'Pendente' : 'Falhou'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Leads Capturados</h2>
                <button
                  onClick={exportLeads}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-medium hover:from-yellow-400 hover:to-yellow-500 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3">Nome</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Telefone</th>
                      <th className="text-left p-3">Fonte</th>
                      <th className="text-left p-3">Data</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="p-3">{lead.name || '-'}</td>
                        <td className="p-3">{lead.email}</td>
                        <td className="p-3">{lead.phone || '-'}</td>
                        <td className="p-3">{lead.source}</td>
                        <td className="p-3">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            lead.converted 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {lead.converted ? 'Convertido' : 'Pendente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Vendas Realizadas</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3">Nome</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Valor</th>
                      <th className="text-left p-3">Método</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="p-3">{sale.name || '-'}</td>
                        <td className="p-3">{sale.email}</td>
                        <td className="p-3 font-bold text-green-400">R$ {Number(sale.amount).toFixed(2)}</td>
                        <td className="p-3">{sale.payment_method}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            sale.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400'
                              : sale.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {sale.status === 'completed' ? 'Pago' : 
                             sale.status === 'pending' ? 'Pendente' : 'Falhou'}
                          </span>
                        </td>
                        <td className="p-3">{new Date(sale.created_at).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Depoimentos</h2>
              <div className="grid gap-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-gray-800/50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        <p className="text-yellow-400 font-medium">{testimonial.result}</p>
                        <div className="flex gap-1 mt-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          testimonial.approved 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {testimonial.approved ? 'Aprovado' : 'Pendente'}
                        </span>
                        {!testimonial.approved && (
                          <button
                            onClick={() => handleApproveTestimonial(testimonial.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                          >
                            Aprovar
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 italic">"{testimonial.text}"</p>
                    <p className="text-xs text-gray-500 mt-3">
                      {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}