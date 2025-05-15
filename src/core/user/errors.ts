import { UserId } from './types'

export class SupabaseUserNotFoundError extends Error {
  code = 'SUPABASE_USER_NOT_FOUND'
  constructor() {
    super('Utilisateur Supabase introuvable')
  }
}

export class UserNotFoundError extends Error {
  code = 'USER_NOT_FOUND'
  constructor(userId: UserId) {
    super(`Utilisateur avec l'ID ${userId} introuvable`)
  }
}

export class UserInformationsNotFoundError extends Error {
  code = 'USER_INFORMATIONS_NOT_FOUND'
  constructor(userId: UserId) {
    super(`Informations utilisateur avec l'ID ${userId} introuvables`)
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
    super('Cet email est déjà utilisé.')
  }
}

export class InvalidPasswordError extends Error {
  code = 'INVALID_PASSWORD'
  constructor() {
    super('Le mot de passe est invalide ou trop faible.')
  }
}

export class InvalidCredentialsError extends Error {
  code = 'INVALID_CREDENTIALS'
  constructor() {
    super('Email ou mot de passe incorrect.')
  }
}

export class UserNotVerifiedError extends Error {
  code = 'USER_NOT_VERIFIED'
  constructor() {
    super("L'email de ce compte n'a pas encore été vérifié.")
  }
}
