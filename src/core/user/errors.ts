import { UserId } from './types'

export class SupabaseUserNotFoundError extends Error {
  code = 'SUPABASE_USER_NOT_FOUND'
  constructor() {
    super('Supabase user not found')
  }
}

export class UserNotFoundError extends Error {
  code = 'USER_NOT_FOUND'
  constructor(userId: UserId) {
    super(`User with ID ${userId} not found`)
  }
}

export class UserInformationsNotFoundError extends Error {
  code = 'USER_INFORMATIONS_NOT_FOUND'
  constructor(userId: UserId) {
    super(`User information with ID ${userId} not found`)
  }
}

export class UserCreationError extends Error {
  code = 'USER_CREATION_ERROR'
  constructor(message: string) {
    super(message)
  }
}

// Erreurs spécifiques à l'authentification
export class EmailInUseError extends Error {
  code = 'EMAIL_IN_USE'
  constructor() {
    super('This email is already in use.')
  }
}

export class InvalidPasswordError extends Error {
  code = 'INVALID_PASSWORD'
  constructor() {
    super('The password is invalid or too weak.')
  }
}

export class InvalidCredentialsError extends Error {
  code = 'INVALID_CREDENTIALS'
  constructor() {
    super('Incorrect email or password.')
  }
}

export class UserNotVerifiedError extends Error {
  code = 'USER_NOT_VERIFIED'
  constructor() {
    super('The email for this account has not yet been verified.')
  }
}
