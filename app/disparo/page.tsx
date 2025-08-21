'use client'

import { useState } from 'react'
import { Upload, Send, FileText, MessageCircle, Target, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface DisparoData {
  nomeCampanha: string
  mensagemModelo: string
  arquivo: File | null
}

export default function DisparoPage() {
  const [formData, setFormData] = useState<DisparoData>({
    nomeCampanha: '',
    mensagemModelo: '',
    arquivo: null
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      arquivo: file
    }))
    setError('')
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        handleFileChange(file)
      } else {
        setError('Por favor, selecione apenas arquivos CSV')
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        handleFileChange(file)
      } else {
        setError('Por favor, selecione apenas arquivos CSV')
        e.target.value = ''
      }
    }
  }

  const validateForm = () => {
    if (!formData.nomeCampanha.trim()) {
      setError('Nome da campanha é obrigatório')
      return false
    }
    if (!formData.mensagemModelo.trim()) {
      setError('Mensagem modelo é obrigatória')
      return false
    }
    if (!formData.arquivo) {
      setError('Arquivo CSV é obrigatório')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('nomeCampanha', formData.nomeCampanha)
      formDataToSend.append('mensagemModelo', formData.mensagemModelo)
      formDataToSend.append('arquivo', formData.arquivo!)

      const response = await fetch('https://webhooks.mysellers.com.br/webhook/4b23e7f6-ad8c-4ab1-b809-disparo-interface', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({
          nomeCampanha: '',
          mensagemModelo: '',
          arquivo: null
        })
        // Reset file input
        const fileInput = document.getElementById('csvFile') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        throw new Error(`Erro no servidor: ${response.status}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar dados')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Novo Disparo</h1>
        <p className="text-gray-600 mt-2">
          Configure e inicie uma nova campanha de disparos em massa
        </p>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Disparo iniciado com sucesso!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Sua campanha foi enviada para processamento.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Erro</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Configuração da Campanha
          </h2>
          
          <div className="space-y-6">
            {/* Nome da Campanha */}
            <div>
              <label htmlFor="nomeCampanha" className="block text-sm font-medium text-gray-700">
                Nome da Campanha *
              </label>
              <input
                type="text"
                id="nomeCampanha"
                name="nomeCampanha"
                value={formData.nomeCampanha}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: Campanha Seguros Janeiro 2024"
                disabled={loading}
              />
            </div>

            {/* Mensagem Modelo */}
            <div>
              <label htmlFor="mensagemModelo" className="block text-sm font-medium text-gray-700">
                Mensagem Modelo para IA *
              </label>
              <div className="mt-1 relative">
                <MessageCircle className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="mensagemModelo"
                  name="mensagemModelo"
                  rows={4}
                  value={formData.mensagemModelo}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Olá [NOME], somos da [EMPRESA] e gostaríamos de apresentar uma proposta de seguro para sua empresa. Você seria a pessoa responsável por essas decisões?"
                  disabled={loading}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                A IA usará esta mensagem como inspiração para personalizar cada contato
              </p>
            </div>
          </div>
        </div>

        {/* Upload de Arquivo */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Arquivo CSV
          </h2>

          <div className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              
              <div className="space-y-2">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Clique para enviar</span> ou arraste e solte
                </div>
                <p className="text-xs text-gray-500">Apenas arquivos CSV são aceitos</p>
              </div>
            </div>

            {/* Selected File */}
            {formData.arquivo && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-sm text-blue-800 font-medium">
                    {formData.arquivo.name}
                  </span>
                  <span className="text-xs text-blue-600 ml-2">
                    ({(formData.arquivo.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              </div>
            )}

            {/* CSV Format Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Formato esperado do CSV:
              </h4>
              <div className="text-xs text-gray-600 font-mono bg-white rounded p-2 border">
                nome,empresa,telefone,email,cnpj<br/>
                João Silva,Empresa ABC,11999999999,joao@empresa.com,12.345.678/0001-90
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Campos obrigatórios: nome, empresa, telefone
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Iniciando Disparo...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Iniciar Disparo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}