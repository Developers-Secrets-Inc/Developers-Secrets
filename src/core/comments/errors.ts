// Erreurs de base
class CommentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CommentError'
  }
}

// Erreurs de développement (nécessitant une intervention des développeurs)
class CommentDatabaseError extends CommentError {
  constructor(
    message: string = "Une erreur est survenue lors de l'accès à la base de données des commentaires",
  ) {
    super(message)
    this.name = 'CommentDatabaseError'
  }
}

class CommentValidationError extends CommentError {
  constructor(message: string = 'Erreur de validation des données du commentaire') {
    super(message)
    this.name = 'CommentValidationError'
  }
}

// Erreurs attendues (comportement utilisateur)
class CommentNotFoundError extends CommentError {
  constructor(message: string = 'Commentaire non trouvé') {
    super(message)
    this.name = 'CommentNotFoundError'
  }
}

class CommentUnauthorizedError extends CommentError {
  constructor(
    message: string = "Vous n'êtes pas autorisé à effectuer cette action sur ce commentaire",
  ) {
    super(message)
    this.name = 'CommentUnauthorizedError'
  }
}

class CommentContentTooLongError extends CommentError {
  constructor(message: string = 'Le contenu du commentaire ne doit pas dépasser 1000 caractères') {
    super(message)
    this.name = 'CommentContentTooLongError'
  }
}

class CommentContentEmptyError extends CommentError {
  constructor(message: string = 'Le contenu du commentaire ne peut pas être vide') {
    super(message)
    this.name = 'CommentContentEmptyError'
  }
}

class CommentAlreadyReportedError extends CommentError {
  constructor(message: string = 'Vous avez déjà signalé ce commentaire') {
    super(message)
    this.name = 'CommentAlreadyReportedError'
  }
}

class CommentAlreadyVotedError extends CommentError {
  constructor(message: string = 'Vous avez déjà voté sur ce commentaire') {
    super(message)
    this.name = 'CommentAlreadyVotedError'
  }
}

class CommentParentNotFoundError extends CommentError {
  constructor(message: string = "Le commentaire parent n'existe pas") {
    super(message)
    this.name = 'CommentParentNotFoundError'
  }
}

class CommentChallengeNotFoundError extends CommentError {
  constructor(message: string = "Le challenge associé au commentaire n'existe pas") {
    super(message)
    this.name = 'CommentChallengeNotFoundError'
  }
}

export {
  CommentError,
  CommentDatabaseError,
  CommentValidationError,
  CommentNotFoundError,
  CommentUnauthorizedError,
  CommentContentTooLongError,
  CommentContentEmptyError,
  CommentAlreadyReportedError,
  CommentAlreadyVotedError,
  CommentParentNotFoundError,
  CommentChallengeNotFoundError,
}
