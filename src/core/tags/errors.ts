export class TagNotFoundError extends Error {
  constructor(name: string) {
    super(`Tag "${name}" not found`)
    this.name = 'TagNotFoundError'
  }
}

export class TagAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`Tag "${name}" already exists`)
    this.name = 'TagAlreadyExistsError'
  }
}

export class TagNotEligibleForPublicError extends Error {
  constructor(reason: string) {
    super(`Tag is not eligible to become public: ${reason}`)
    this.name = 'TagNotEligibleForPublicError'
  }
}

export class TagUpdateError extends Error {
  constructor(message: string) {
    super(`Failed to update tag: ${message}`)
    this.name = 'TagUpdateError'
  }
}
