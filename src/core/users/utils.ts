import { User } from "./types"
import { User as SupabaseUser } from '@supabase/supabase-js'



export const mergeUserInformations = (supabaseUser: SupabaseUser, userInformations: any): User => {
    const { id, ...userInformationsWithoutId } = userInformations
    return {
      ...supabaseUser,
      informations: {...userInformationsWithoutId},
    } as User
  }