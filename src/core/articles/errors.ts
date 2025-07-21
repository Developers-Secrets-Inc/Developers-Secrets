// Custom error classes
export class TutorialError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TutorialError'
  }
}

export class TutorialNotFoundError extends TutorialError {
  constructor(slug: string) {
    super(`Tutorial with slug "${slug}" not found`)
    this.name = 'TutorialNotFoundError'
  }
}

export class TutorialsNotFoundError extends TutorialError {
  constructor() {
    super(`Tutorials not found`)
    this.name = 'TutorialNotFoundError'
  }
}

export class MultipleTutorialsFoundError extends TutorialError {
  constructor(slug: string) {
    super(`Multiple tutorials found with slug "${slug}"`)
    this.name = 'MultipleTutorialsFoundError'
  }
}

export class InvalidTutorialSlugError extends TutorialError {
  constructor() {
    super('Tutorial slug is required')
    this.name = 'InvalidTutorialSlugError'
  }
}

export class PayloadConnectionError extends TutorialError {
  constructor(originalError: unknown) {
    super('Failed to connect to database')
    this.name = 'PayloadConnectionError'
    this.cause = originalError
  }
}

export class ArticleNotFoundError extends Error {
  constructor(slug: string) {
    super(`Article with slug "${slug}" not found`)
    this.name = 'ArticleNotFoundError'
  }
}
