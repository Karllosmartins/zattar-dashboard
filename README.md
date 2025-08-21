# 🎯 Zattar Dashboard

Sistema de CRM e análise de campanhas para WhatsApp com foco em identificação de decisores.

## 📊 Funcionalidades

- **Dashboard Principal**: Visão geral de métricas importantes
- **Relatórios**: Análise detalhada de sócios únicos e custos de enriquecimento
- **Atendimentos**: Gestão de conversas e interações
- **Campanhas**: Performance e ROI por campanha
- **Leads**: Visualização detalhada de contatos
- **Disparo**: Interface para iniciar campanhas via API

## 🔧 Tecnologias

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Supabase (Database)
- Recharts (Gráficos)

## 🚀 Deploy

Veja o arquivo `DEPLOY.md` para instruções completas de deployment no Portainer.

## 📈 Métricas Principais

- **Sócios Únicos**: Contatos enriquecidos independente de telefones
- **Custo de Enriquecimento**: R$ 0,30 por sócio único
- **Taxa de Decisores**: Eficiência na identificação de tomadores de decisão
- **ROI de Campanhas**: Retorno sobre investimento

## 🏃‍♂️ Desenvolvimento

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## 📋 Estrutura

```
├── app/                 # Páginas (App Router)
├── components/          # Componentes React
├── lib/                 # Utilitários e configurações
├── Dockerfile           # Containerização
└── docker-compose.yml   # Orquestração
```

## 🔐 Variáveis de Ambiente

```bash
NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-supabase
```