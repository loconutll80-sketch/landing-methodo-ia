"use client"

import { useState } from 'react'
import { Mail, User, Phone, Gift, CheckCircle } from 'lucide-react'
import { leadService } from '@/lib/database'

interface LeadFormProps {
  source: string
  onSuccess?: () => void
  className?: string
}

export default function LeadForm({ source, onSuccess, className = "" }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validações básicas
    if (!formData.name.trim()) {
      setError('Nome é obrigatório')
      setIsSubmitting(false)
      return
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório')
      setIsSubmitting(false)
      return
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido')
      setIsSubmitting(false)
      return
    }

    try {
      await leadService.create({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        source
      })
      
      setIsSuccess(true)
      onSuccess?.()
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '' })
        setIsSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Erro ao enviar lead:', error)
      setError('Erro ao enviar dados. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpar erro quando usuário começar a digitar
    if (error) {
      setError(null)
    }
  }

  if (isSuccess) {
    return (
      <div className={`bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">Sucesso!</h3>
        <p className="text-gray-300 mb-4">
          Seu acesso foi enviado para <strong>{formData.email}</strong>
        </p>
        <p className="text-sm text-gray-400">
          Verifique sua caixa de entrada e spam. O material chegará em até 5 minutos.
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-blue-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-4">
          <Gift className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-medium text-sm">Acesso Gratuito</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">
          Receba o <span className="text-yellow-400">Método Completo</span>
        </h3>
        <p className="text-gray-400">
          Preencha os dados abaixo e receba acesso imediato ao material
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="name"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Seu melhor email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            placeholder="WhatsApp (opcional)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Enviando...
            </div>
          ) : (
            'Quero Receber Grátis'
          )}
        </button>

        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            🔒 Seus dados estão seguros. Não enviamos spam.
          </p>
          <p className="text-xs text-green-400">
            ✅ Mais de 10.000 pessoas já receberam o material
          </p>
        </div>
      </form>
    </div>
  )
}