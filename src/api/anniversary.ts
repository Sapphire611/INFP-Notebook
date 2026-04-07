import { supabase } from '@/lib/supabase'

const SUPABASE_URL = 'https://lwkeudywhmvlimsasixo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3a2V1ZHl3aG12bGltc2FzaXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MTIxNDksImV4cCI6MjA3OTA4ODE0OX0.O9tTR16ybNPWvh_4RY0_I43zbvVqaR75TFhN1vgn5jg'

export interface Anniversary {
  id: string
  user_id: string
  title: string
  date: string
  type: 'past' | 'future'
  icon: string
  is_yearly_repeat: boolean
  created_at: string
  updated_at: string
}

export interface AnniversaryInput {
  user_id: string
  title: string
  date: string
  type: 'past' | 'future'
  icon?: string
  is_yearly_repeat?: boolean
}

export const anniversaryApi = {
  async list(userId: string): Promise<{ data: Anniversary[] | null; error: any }> {
    try {
      const response = await uni.request({
        url: `${SUPABASE_URL}/rest/v1/anniversaries?user_id=eq.${encodeURIComponent(userId)}&select=*`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        }
      })
      if (response.statusCode && response.statusCode >= 400) {
        return { data: null, error: response.data }
      }
      return { data: response.data as Anniversary[], error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  },

  async getById(id: string): Promise<{ data: Anniversary | null; error: any }> {
    try {
      const response = await uni.request({
        url: `${SUPABASE_URL}/rest/v1/anniversaries?id=eq.${encodeURIComponent(id)}&select=*`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        }
      })
      if (response.statusCode && response.statusCode >= 400) {
        return { data: null, error: response.data }
      }
      const arr = response.data as Anniversary[]
      return { data: arr[0] || null, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  },

  async create(input: AnniversaryInput): Promise<{ data: Anniversary | null; error: any }> {
    try {
      const response = await uni.request({
        url: `${SUPABASE_URL}/rest/v1/anniversaries`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        data: { icon: '🎂', is_yearly_repeat: false, ...input }
      })
      if (response.statusCode && response.statusCode >= 400) {
        return { data: null, error: response.data }
      }
      const arr = response.data as Anniversary[]
      return { data: arr[0] || null, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  },

  async update(id: string, input: Partial<AnniversaryInput>): Promise<{ data: Anniversary | null; error: any }> {
    try {
      const response = await uni.request({
        url: `${SUPABASE_URL}/rest/v1/anniversaries?id=eq.${encodeURIComponent(id)}`,
        method: 'PATCH',
        header: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        data: input
      })
      if (response.statusCode && response.statusCode >= 400) {
        return { data: null, error: response.data }
      }
      const arr = response.data as Anniversary[]
      return { data: arr[0] || null, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  },

  async delete(id: string): Promise<{ error: any }> {
    try {
      const response = await uni.request({
        url: `${SUPABASE_URL}/rest/v1/anniversaries?id=eq.${encodeURIComponent(id)}`,
        method: 'DELETE',
        header: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal'
        }
      })
      if (response.statusCode && response.statusCode >= 400) {
        return { error: response.data }
      }
      return { error: null }
    } catch (err: any) {
      return { error: { message: err.message } }
    }
  }
}
