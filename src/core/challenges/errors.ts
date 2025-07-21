export class ChallengeNotFoundError extends Error {
  constructor() {
    super('Challenge not found')
  }
}