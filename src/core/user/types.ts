import { z } from 'zod'

const UserIdSchema = z.string().uuid()
export type UserId = z.infer<typeof UserIdSchema>

const EmailSchema = z.string().email()
export type Email = z.infer<typeof EmailSchema>

const PasswordSchema = z.string().min(8)
export type Password = z.infer<typeof PasswordSchema>

export const validateUserId = (userId: string): UserId => {
  const result = UserIdSchema.safeParse(userId)
  if (!result.success) {
    throw new Error('Invalid user ID')
  }
  return result.data
}

export const validateEmail = (email: string): Email => {
  const result = EmailSchema.safeParse(email)
  if (!result.success) {
    throw new Error('Invalid email')
  }
  return result.data
}

export const validatePassword = (password: string): Password => {
  const result = PasswordSchema.safeParse(password)
  if (!result.success) {
    throw new Error('Invalid password')
  }
  return result.data
}



