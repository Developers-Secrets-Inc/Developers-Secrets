import { UserInformation } from '@/payload-types'
import { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser & {
    informations: Omit<UserInformation, 'id'>
}
