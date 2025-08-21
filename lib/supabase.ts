import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://whjdikwbgbjfjtzcqrvr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoamRpa3diZ2JqZmp0emNxcnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTM0MDgsImV4cCI6MjA2MDIyOTQwOH0.WqUaQ4vcfOUWuusXOpDKlmyxTiwPg9oJymrLy3rZ1yQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface LeadZattar {
  id: number
  created_at: string | null
  remotejid: string | null
  response_id: string | null
  atendimentofinalizado: boolean | null
  conversation_log: any | null
  times_tamp: string | null
  tokens: number | null
  user_lastinteraction: string | null
  bot_lastinteraction: string | null
  lead_id: string | null
  contact_id: string | null
  numero_formatado: string | null
  email_usuario: string | null
  task_id: string | null
  cnpj: string | null
  site_usuario: string | null
  link_meet: string | null
  numero_follow: string | null
  instance: string | null
  nome_cliente: string | null
  id_calendar: string | null
  data_agendamento: string | null
  hora_agendamento: string | null
  Agente_ID: string | null
  data_folowup_solicitado: string | null
  folowup_solicitado: boolean | null
  id_card: string | null
  existe_whatsapp: boolean | null
  responsavel_encontrado: boolean | null
  responsavel_seguro: boolean | null
  efetuar_disparo: boolean | null
  nome_empresa: string | null
  id_empresa: string | null
  nome_campanha: string | null
}