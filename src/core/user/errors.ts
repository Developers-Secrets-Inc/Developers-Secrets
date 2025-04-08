import { UserId } from "./types";


export class SupabaseUserNotFoundError extends Error {
  constructor() {
    super('Supabase user not found')
  }
}

export class UserNotFoundError extends Error {
  constructor(userId: UserId) {
    super(`User with ID ${userId} not found`)
  }
}


export class UserInformationsNotFoundError extends Error {
  constructor(userId: UserId) {
    super(`User informations with ID ${userId} not found`)
  }
}

export class UserCreationError extends Error {
  constructor(message: string) {
    super(message)
  }
}


