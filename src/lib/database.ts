// Simulação de banco de dados local até Supabase ser configurado
let mockData = {
  leads: [] as any[],
  sales: [] as any[],
  testimonials: [] as any[],
  analytics: {
    page_views: 0,
    leads_captured: 0,
    conversion_rate: 0,
    sales_count: 0,
    revenue: 0
  }
}

// Tipos para melhor tipagem
interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  source: string
  created_at: string
  converted: boolean
}

interface Sale {
  id: string
  customer_email: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  product: string
  created_at: string
}

interface Testimonial {
  id: string
  name: string
  email?: string
  result: string
  text: string
  rating: number
  created_at: string
  approved: boolean
}

interface Analytics {
  page_views: number
  leads_captured: number
  conversion_rate: number
  sales_count: number
  revenue: number
}

// Funções para Leads
export const leadService = {
  // Capturar novo lead
  async create(leadData: Omit<Lead, 'id' | 'created_at' | 'converted'>): Promise<Lead> {
    try {
      const lead: Lead = {
        id: Date.now().toString(),
        ...leadData,
        created_at: new Date().toISOString(),
        converted: false
      }
      mockData.leads.push(lead)
      
      // Atualizar analytics
      await analyticsService.recordLeadCapture()
      
      return lead
    } catch (error) {
      console.error('Erro ao criar lead:', error)
      throw new Error('Falha ao salvar lead')
    }
  },

  // Buscar todos os leads
  async getAll(): Promise<Lead[]> {
    try {
      return mockData.leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
      return []
    }
  },

  // Marcar lead como convertido
  async markAsConverted(leadId: string): Promise<Lead | null> {
    try {
      const lead = mockData.leads.find(l => l.id === leadId)
      if (lead) {
        lead.converted = true
        return lead
      }
      return null
    } catch (error) {
      console.error('Erro ao marcar lead como convertido:', error)
      return null
    }
  },

  // Buscar lead por email
  async getByEmail(email: string): Promise<Lead | null> {
    try {
      return mockData.leads.find(l => l.email === email) || null
    } catch (error) {
      console.error('Erro ao buscar lead por email:', error)
      return null
    }
  }
}

// Funções para Vendas
export const saleService = {
  // Criar nova venda
  async create(saleData: Omit<Sale, 'id' | 'created_at'>): Promise<Sale> {
    try {
      const sale: Sale = {
        id: Date.now().toString(),
        ...saleData,
        created_at: new Date().toISOString()
      }
      mockData.sales.push(sale)
      
      // Se venda completada, atualizar analytics
      if (sale.status === 'completed') {
        await analyticsService.recordSale(sale.amount)
      }
      
      return sale
    } catch (error) {
      console.error('Erro ao criar venda:', error)
      throw new Error('Falha ao salvar venda')
    }
  },

  // Buscar todas as vendas
  async getAll(): Promise<Sale[]> {
    try {
      return mockData.sales.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
      return []
    }
  },

  // Atualizar status da venda
  async updateStatus(saleId: string, status: Sale['status']): Promise<Sale | null> {
    try {
      const sale = mockData.sales.find(s => s.id === saleId)
      if (sale) {
        const oldStatus = sale.status
        sale.status = status
        
        // Se mudou para completed, atualizar analytics
        if (oldStatus !== 'completed' && status === 'completed') {
          await analyticsService.recordSale(sale.amount)
        }
        
        return sale
      }
      return null
    } catch (error) {
      console.error('Erro ao atualizar status da venda:', error)
      return null
    }
  },

  // Buscar vendas por período
  async getByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
    try {
      return mockData.sales.filter(sale => 
        sale.created_at >= startDate && 
        sale.created_at <= endDate && 
        sale.status === 'completed'
      )
    } catch (error) {
      console.error('Erro ao buscar vendas por período:', error)
      return []
    }
  }
}

// Funções para Depoimentos
export const testimonialService = {
  // Criar novo depoimento
  async create(testimonialData: Omit<Testimonial, 'id' | 'created_at' | 'approved'>): Promise<Testimonial> {
    try {
      const testimonial: Testimonial = {
        id: Date.now().toString(),
        ...testimonialData,
        created_at: new Date().toISOString(),
        approved: false
      }
      mockData.testimonials.push(testimonial)
      return testimonial
    } catch (error) {
      console.error('Erro ao criar depoimento:', error)
      throw new Error('Falha ao salvar depoimento')
    }
  },

  // Buscar depoimentos aprovados
  async getApproved(): Promise<Testimonial[]> {
    try {
      return mockData.testimonials
        .filter(t => t.approved)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } catch (error) {
      console.error('Erro ao buscar depoimentos aprovados:', error)
      return []
    }
  },

  // Buscar todos os depoimentos (admin)
  async getAll(): Promise<Testimonial[]> {
    try {
      return mockData.testimonials.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } catch (error) {
      console.error('Erro ao buscar todos os depoimentos:', error)
      return []
    }
  },

  // Aprovar depoimento
  async approve(testimonialId: string): Promise<Testimonial | null> {
    try {
      const testimonial = mockData.testimonials.find(t => t.id === testimonialId)
      if (testimonial) {
        testimonial.approved = true
        return testimonial
      }
      return null
    } catch (error) {
      console.error('Erro ao aprovar depoimento:', error)
      return null
    }
  }
}

// Funções para Analytics
export const analyticsService = {
  // Registrar visualização de página
  async recordPageView(): Promise<Analytics> {
    try {
      mockData.analytics.page_views += 1
      this.updateConversionRate()
      return { ...mockData.analytics }
    } catch (error) {
      console.error('Erro ao registrar visualização:', error)
      return mockData.analytics
    }
  },

  // Registrar captura de lead
  async recordLeadCapture(): Promise<Analytics> {
    try {
      mockData.analytics.leads_captured += 1
      this.updateConversionRate()
      return { ...mockData.analytics }
    } catch (error) {
      console.error('Erro ao registrar captura de lead:', error)
      return mockData.analytics
    }
  },

  // Registrar venda
  async recordSale(amount: number): Promise<Analytics> {
    try {
      mockData.analytics.sales_count += 1
      mockData.analytics.revenue += amount
      this.updateConversionRate()
      return { ...mockData.analytics }
    } catch (error) {
      console.error('Erro ao registrar venda:', error)
      return mockData.analytics
    }
  },

  // Atualizar taxa de conversão
  updateConversionRate() {
    if (mockData.analytics.page_views > 0) {
      mockData.analytics.conversion_rate = 
        (mockData.analytics.leads_captured / mockData.analytics.page_views) * 100
    }
  },

  // Buscar analytics por período
  async getByDateRange(startDate: string, endDate: string): Promise<Analytics[]> {
    try {
      // Para dados simulados, retornamos os dados atuais
      return [{ ...mockData.analytics }]
    } catch (error) {
      console.error('Erro ao buscar analytics por período:', error)
      return [mockData.analytics]
    }
  },

  // Buscar analytics de hoje
  async getToday(): Promise<Analytics> {
    try {
      return { ...mockData.analytics }
    } catch (error) {
      console.error('Erro ao buscar analytics de hoje:', error)
      return mockData.analytics
    }
  },

  // Resetar dados (útil para desenvolvimento)
  async reset(): Promise<void> {
    mockData = {
      leads: [],
      sales: [],
      testimonials: [],
      analytics: {
        page_views: 0,
        leads_captured: 0,
        conversion_rate: 0,
        sales_count: 0,
        revenue: 0
      }
    }
  }
}

// Função para inicializar dados de exemplo (desenvolvimento)
export const initializeMockData = () => {
  // Adicionar alguns dados de exemplo se não existirem
  if (mockData.leads.length === 0) {
    mockData.testimonials = [
      {
        id: '1',
        name: 'Maria Silva',
        result: 'R$ 480 em 3 dias',
        text: 'Incrível! Seguindo exatamente o método, consegui transformar R$ 100 em R$ 480 em apenas 3 dias. Nunca pensei que seria tão simples!',
        rating: 5,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        approved: true
      },
      {
        id: '2',
        name: 'João Santos',
        result: 'R$ 520 em 5 dias',
        text: 'O método realmente funciona! Comecei com R$ 100 e em 5 dias já tinha R$ 520. Agora estou reinvestindo para ganhar ainda mais.',
        rating: 5,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        approved: true
      },
      {
        id: '3',
        name: 'Ana Costa',
        result: 'R$ 350 em 2 dias',
        text: 'Fantástico! Em apenas 2 dias consegui R$ 350. O passo a passo é muito claro e fácil de seguir.',
        rating: 5,
        created_at: new Date(Date.now() - 259200000).toISOString(),
        approved: true
      }
    ]
  }
}

// Inicializar dados de exemplo
initializeMockData()