"use client"

import { useState } from 'react'
import { Star, User, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react'
import { testimonialService } from '@/lib/database'

interface TestimonialFormProps {
  onSuccess?: () => void
  className?: string
}

export default function TestimonialForm({ onSuccess, className = "" }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    result: '',
    text: '',
    rating: 5
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

    if (!formData.result.trim()) {
      setError('Resultado é obrigatório')
      setIsSubmitting(false)
      return
    }

    if (!formData.text.trim()) {
      setError('Depoimento é obrigatório')
      setIsSubmitting(false)
      return
    }

    if (formData.text.trim().length < 20) {
      setError('Depoimento deve ter pelo menos 20 caracteres')
      setIsSubmitting(false)
      return
    }

    // Validação de email se fornecido
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido')
      setIsSubmitting(false)
      return
    }

    try {
      await testimonialService.create({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase() || undefined,
        result: formData.result.trim(),
        text: formData.text.trim(),
        rating: formData.rating
      })
      
      setIsSuccess(true)
      onSuccess?.()
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', result: '', text: '', rating: 5 })
        setIsSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Erro ao enviar depoimento:', error)
      setError('Erro ao enviar depoimento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  if (isSuccess) {
    return (
      <div className={`bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">Obrigado!</h3>
        <p className="text-gray-300 mb-4">
          Seu depoimento foi enviado com sucesso!
        </p>
        <p className="text-sm text-gray-400">
          Nossa equipe irá analisar e publicar em breve. Obrigado por compartilhar sua experiência!
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">
          Compartilhe Seu <span className="text-yellow-400">Resultado</span>
        </h3>
        <p className="text-gray-400">
          Conte para outros como o método funcionou para você
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
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
              placeholder="Seu email (opcional)"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            name="result"
            placeholder="Seu resultado (ex: R$ 480 em 3 dias)"
            value={formData.result}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            name="text"
            placeholder="Conte sua experiência com o método... (mínimo 20 caracteres)"
            value={formData.text}
            onChange={handleChange}
            required
            rows={4}
            minLength={20}
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors resize-none"
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {formData.text.length}/20 min
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Avaliação *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`w-8 h-8 transition-colors ${
                  star <= formData.rating 
                    ? 'text-yellow-400 hover:text-yellow-300' 
                    : 'text-gray-600 hover:text-gray-500'
                }`}
              >
                <Star className="w-full h-full fill-current" />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-400">
              {formData.rating} estrela{formData.rating !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enviando...
            </div>
          ) : (
            'Enviar Depoimento'
          )}
        </button>

        <div className="text-center space-y-1">
          <p className="text-xs text-gray-500">
            Seu depoimento será analisado antes de ser publicado.
          </p>
          <p className="text-xs text-green-400">
            ✅ Ajude outras pessoas a conhecer o método
          </p>
        </div>
      </form>
    </div>
  )
}