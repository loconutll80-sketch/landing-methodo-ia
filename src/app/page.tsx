"use client"

import { useState, useEffect } from 'react'
import { ChevronRight, Play, CheckCircle, Star, Clock, Shield, Smartphone, CreditCard, Users, TrendingUp, Zap, Target, Award, ArrowRight, BookOpen, Video, BarChart3, Download, FileText, Calculator, Gift } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import TestimonialForm from '@/components/TestimonialForm'
import { analyticsService } from '@/lib/database'

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  })
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)

  useEffect(() => {
    // Registrar visualização da página
    analyticsService.recordPageView().catch(console.error)

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleCheckout = async () => {
    // Registrar interesse de compra
    try {
      await analyticsService.recordLeadCapture()
    } catch (error) {
      console.error('Erro ao registrar interesse:', error)
    }
    
    // Redireciona para checkout da Lasy.ai
    window.open('https://lasy.ai/checkout/metodo-ia-100-500', '_blank')
  }

  const handleLeadSuccess = () => {
    setShowLeadForm(false)
    // Registrar captura de lead
    analyticsService.recordLeadCapture().catch(console.error)
  }

  const handleTestimonialSuccess = () => {
    setShowTestimonialForm(false)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-yellow-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-blue-500/20 border border-yellow-500/30 rounded-full px-4 py-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Método Viral 2026</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Transforme{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  R$100
                </span>{' '}
                em{' '}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  R$500
                </span>{' '}
                com{' '}
                <span className="bg-gradient-to-r from-yellow-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
                  Inteligência Artificial
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                — mesmo que nunca tenha feito um real online.
              </p>
              
              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                Aprenda o método que está viralizando e gerando lucros reais usando apenas ferramentas gratuitas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleCheckout}
                  className="group relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25"
                >
                  <span className="flex items-center justify-center gap-2">
                    Quero começar agora
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
                </button>
                
                <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Play className="w-5 h-5" />
                  Ver demonstração
                </button>
              </div>
            </div>
            
            {/* Right Content - Lead Form */}
            <div className="relative">
              <LeadForm 
                source="hero_section" 
                onSuccess={handleLeadSuccess}
                className="shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full text-sm font-bold animate-bounce">
                <Gift className="w-4 h-4 inline mr-1" />
                Grátis hoje!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Como <span className="bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">Funciona</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              3 passos simples para transformar sua vida financeira
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Target className="w-12 h-12" />,
                title: "Aprenda o Método",
                description: "Domine o passo a passo completo através do nosso ebook exclusivo e detalhado."
              },
              {
                step: "02",
                icon: <Zap className="w-12 h-12" />,
                title: "Aplique com IA",
                description: "Use ferramentas gratuitas de inteligência artificial para implementar o método."
              },
              {
                step: "03",
                icon: <TrendingUp className="w-12 h-12" />,
                title: "Lucre e Multiplique",
                description: "Reinvista seus lucros usando nossa planilha exclusiva e escale para R$50.000."
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 text-center hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105">
                  <div className="text-6xl font-bold text-gray-800 mb-4">{item.step}</div>
                  <div className="text-yellow-400 mb-6 flex justify-center">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-yellow-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que você vai receber */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              O que <span className="bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">Você Vai Receber</span>
            </h2>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full px-4 py-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Acesso imediato após pagamento</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-16 h-16 text-yellow-400" />,
                title: "Ebook \"Método IA 100→500\"",
                description: "Guia completo com estratégias detalhadas, ferramentas e casos reais de sucesso.",
                value: "R$ 47",
                materials: [
                  "✅ 150+ páginas de conteúdo exclusivo",
                  "✅ 12 capítulos estruturados",
                  "✅ 50+ ferramentas de IA gratuitas",
                  "✅ 25 templates prontos para usar",
                  "✅ 15 casos de sucesso reais",
                  "✅ Glossário completo de IA",
                  "✅ Lista de recursos extras",
                  "✅ Cronograma de implementação"
                ]
              },
              {
                icon: <Video className="w-16 h-16 text-blue-400" />,
                title: "Vídeo Bônus Tutorial",
                description: "Aulas práticas mostrando cada passo na tela, sem deixar dúvidas.",
                value: "R$ 97",
                materials: [
                  "✅ 3 horas de vídeo-aulas HD",
                  "✅ 8 módulos práticos",
                  "✅ Demonstrações ao vivo",
                  "✅ Configuração das ferramentas",
                  "✅ Resolução de problemas comuns",
                  "✅ Casos práticos comentados",
                  "✅ Dicas de otimização",
                  "✅ Suporte via comentários"
                ]
              },
              {
                icon: <BarChart3 className="w-16 h-16 text-green-400" />,
                title: "Planilha Reinvestimento",
                description: "Ferramenta exclusiva para escalar de R$100 até R$50.000 de forma sistemática.",
                value: "R$ 67",
                materials: [
                  "✅ Calculadora de reinvestimento",
                  "✅ Projeções de crescimento",
                  "✅ Controle de resultados",
                  "✅ Metas progressivas",
                  "✅ Análise de performance",
                  "✅ Gráficos automáticos",
                  "✅ Alertas de oportunidades",
                  "✅ Backup em nuvem"
                ]
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 text-center hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10">
                  <div className="mb-6 flex justify-center">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{item.description}</p>
                  
                  {/* Lista de materiais */}
                  <div className="text-left mb-6 space-y-2">
                    {item.materials.map((material, idx) => (
                      <p key={idx} className="text-sm text-gray-300">{material}</p>
                    ))}
                  </div>
                  
                  <div className="text-yellow-400 font-bold text-xl">Valor: {item.value}</div>
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mt-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Bônus Extras */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">Bônus Exclusivos</span>
              </h3>
              <p className="text-gray-400">Materiais extras que você recebe gratuitamente</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: <FileText className="w-8 h-8 text-purple-400" />,
                  title: "Checklist de Implementação",
                  description: "Lista passo a passo para não esquecer nada",
                  value: "R$ 27"
                },
                {
                  icon: <Calculator className="w-8 h-8 text-orange-400" />,
                  title: "Calculadora de ROI",
                  description: "Calcule seu retorno sobre investimento",
                  value: "R$ 37"
                },
                {
                  icon: <Download className="w-8 h-8 text-cyan-400" />,
                  title: "Pack de Templates",
                  description: "50+ templates editáveis prontos",
                  value: "R$ 47"
                },
                {
                  icon: <Users className="w-8 h-8 text-pink-400" />,
                  title: "Acesso ao Grupo VIP",
                  description: "Comunidade exclusiva no Telegram",
                  value: "R$ 97"
                }
              ].map((bonus, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 text-center hover:border-yellow-500/30 transition-all duration-300">
                  <div className="mb-4 flex justify-center">{bonus.icon}</div>
                  <h4 className="font-bold mb-2">{bonus.title}</h4>
                  <p className="text-sm text-gray-400 mb-3">{bonus.description}</p>
                  <div className="text-yellow-400 font-bold text-sm">+{bonus.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-blue-500/20 border border-yellow-500/30 rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">Valor Total: <span className="line-through text-gray-500">R$ 419</span></div>
              <div className="text-5xl font-bold text-yellow-400">Hoje: R$ 29,90</div>
              <div className="text-lg text-green-400 mt-2">Economia de R$ 389,10 (93% OFF)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">Depoimentos</span> Reais
            </h2>
            <p className="text-xl text-gray-400 mb-8">Veja o que nossos alunos estão dizendo</p>
            
            <button
              onClick={() => setShowTestimonialForm(!showTestimonialForm)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
            >
              Enviar Seu Depoimento
            </button>
          </div>

          {/* Formulário de Depoimento */}
          {showTestimonialForm && (
            <div className="mb-16">
              <TestimonialForm 
                onSuccess={handleTestimonialSuccess}
                className="max-w-2xl mx-auto"
              />
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Maria Silva",
                result: "R$ 480 em 3 dias",
                text: "Fiz R$480 em 3 dias aplicando o método. Simples e direto! Nunca pensei que seria tão fácil ganhar dinheiro online.",
                rating: 5,
                photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
              },
              {
                name: "João Santos",
                result: "Recuperou investimento",
                text: "Finalmente algo que funciona de verdade. Já testei vários métodos e este foi o único que me deu resultado real.",
                rating: 5,
                photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              },
              {
                name: "Ana Costa",
                result: "Lucro em 2 dias",
                text: "Em 2 dias já recuperei o investimento e ainda sobrou. O método é realmente eficaz e bem explicado.",
                rating: 5,
                photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
              },
              {
                name: "Carlos Lima",
                result: "Bônus valioso",
                text: "O bônus em vídeo vale mais que o preço inteiro. As explicações são claras e fáceis de seguir.",
                rating: 5,
                photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.photo} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500/30"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=1f2937&color=fbbf24&size=48`
                      }}
                    />
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">Cliente verificado</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">{testimonial.result}</div>
                    <div className="text-xs text-gray-500">Resultado obtido</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Autoridade */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-black">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-yellow-500/20 to-blue-500/20 rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face" 
                  alt="Dr. Rafael Mendes - Especialista em IA"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://ui-avatars.com/api/?name=Dr.+Rafael+Mendes&background=1f2937&color=fbbf24&size=400"
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full text-sm font-bold">
                <Award className="w-4 h-4 inline mr-1" />
                PhD em IA
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Criado por <span className="bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">Dr. Rafael Mendes</span>
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                PhD em Inteligência Artificial e especialista em automação digital com mais de 10 anos de experiência.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                "Qualquer pessoa pode gerar lucro com IA — sem depender de cursos caros ou promessas falsas. 
                Meu método foi testado e aprovado por mais de 2.000 pessoas que saíram do zero e hoje vivem da renda digital."
              </p>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">2.000+</div>
                  <div className="text-sm text-gray-500">Alunos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">98%</div>
                  <div className="text-sm text-gray-500">Satisfação</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">R$5M+</div>
                  <div className="text-sm text-gray-500">Gerados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Escassez e Urgência */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-yellow-500/10"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/50 rounded-3xl p-12">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-8">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Oferta por tempo limitado</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Promoção <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">Especial</span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-8">
              Apenas hoje, de <span className="line-through text-gray-500">R$419</span> por <span className="text-yellow-400 font-bold">R$29,90</span>
            </p>
            
            {/* Contador */}
            <div className="flex justify-center gap-4 mb-8">
              {[
                { label: 'Horas', value: timeLeft.hours },
                { label: 'Minutos', value: timeLeft.minutes },
                { label: 'Segundos', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-red-500/20 to-yellow-500/20 border border-red-500/30 rounded-xl p-4 min-w-[80px]">
                  <div className="text-3xl font-bold text-yellow-400">{item.value.toString().padStart(2, '0')}</div>
                  <div className="text-sm text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
            
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-6 py-3 mb-8">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Garantia de 7 dias ou seu dinheiro de volta</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="group relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-2xl px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 animate-pulse"
            >
              <span className="flex items-center justify-center gap-3">
                Garantir meu acesso agora
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-black">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Perguntas <span className="bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">Frequentes</span>
            </h2>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "Preciso saber de tecnologia?",
                answer: "Não, tudo é explicado do zero. O método foi criado para pessoas comuns, sem conhecimento técnico."
              },
              {
                question: "É 100% digital?",
                answer: "Sim, sem estoque, sem frete. Tudo é feito online usando apenas seu computador ou celular."
              },
              {
                question: "Posso começar só com o celular?",
                answer: "Sim, basta seu smartphone. Todas as ferramentas funcionam perfeitamente no celular."
              },
              {
                question: "Quanto tempo para ver resultados?",
                answer: "A maioria dos nossos alunos vê os primeiros resultados em 24-72 horas após aplicar o método."
              },
              {
                question: "Tem garantia?",
                answer: "Sim, garantia total de 7 dias. Se não ficar satisfeito, devolvemos 100% do seu dinheiro."
              },
              {
                question: "Como recebo o material?",
                answer: "Imediatamente após a confirmação do pagamento, você recebe um email com todos os acessos."
              },
              {
                question: "Funciona para iniciantes?",
                answer: "Sim! O método foi desenvolvido especialmente para quem nunca ganhou dinheiro online."
              },
              {
                question: "Preciso investir mais dinheiro depois?",
                answer: "Não. Com os R$100 iniciais e as ferramentas gratuitas, você já pode começar a lucrar."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-300">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="py-20 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              O futuro financeiro pertence a quem entende a nova era da{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">
                inteligência artificial
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">Seja um deles.</p>
            
            <button 
              onClick={handleCheckout}
              className="group relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-xl px-10 py-5 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25"
            >
              <span className="flex items-center justify-center gap-2">
                Começar agora por R$ 29,90
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
          
          {/* Payment Icons */}
          <div className="flex justify-center items-center gap-8 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-400">
              <CreditCard className="w-6 h-6" />
              <span>Cartão de Crédito</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Smartphone className="w-6 h-6" />
              <span>PIX</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-6 h-6" />
              <span>Pagamento Seguro</span>
            </div>
          </div>
          
          {/* Links */}
          <div className="flex justify-center items-center gap-8 text-sm text-gray-500 flex-wrap">
            <a href="#" className="hover:text-yellow-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Termos de Uso</a>
            <a href="/admin" className="hover:text-yellow-400 transition-colors">Admin</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Suporte Lasy.ai</a>
          </div>
          
          <div className="text-center mt-8 text-gray-600">
            <p>&copy; 2026 Método IA 100→500. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}