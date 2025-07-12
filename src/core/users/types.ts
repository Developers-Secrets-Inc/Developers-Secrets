import { UserInformation } from '@/payload-types'
import { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser & Omit<UserInformation, 'id'>
