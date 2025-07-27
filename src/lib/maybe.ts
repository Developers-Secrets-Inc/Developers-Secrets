// Maybe monad implementation for functional TypeScript

export type Maybe<T> = { _tag: 'some'; value: T } | { _tag: 'none' }

export const some = <T>(value: T): Maybe<T> => ({ _tag: 'some', value })
export const none = <T = never>(): Maybe<T> => ({ _tag: 'none' })

export const isSome = <T>(m: Maybe<T>): m is { _tag: 'some'; value: T } => m._tag === 'some'
export const isNone = <T>(m: Maybe<T>): m is { _tag: 'none' } => m._tag === 'none'

export const map = <T, U>(m: Maybe<T>, f: (v: T) => U): Maybe<U> =>
  isSome(m) ? some(f(m.value)) : none()

export const flatMap = <T, U>(m: Maybe<T>, f: (v: T) => Maybe<U>): Maybe<U> =>
  isSome(m) ? f(m.value) : none()

export const getOrElse = <T>(m: Maybe<T>, defaultValue: T): T =>
  isSome(m) ? m.value : defaultValue

export const getOrThrow = <T>(m: Maybe<T>, error?: unknown): T => {
  if (isSome(m)) return m.value
  throw error ?? new Error('Tried to extract value from None')
}

export const fromNullable = <T>(v: T | null | undefined): Maybe<T> => (v == null ? none() : some(v))

export const toNullable = <T>(m: Maybe<T>): T | null => (isSome(m) ? m.value : null)

export const match = <T, U>(m: Maybe<T>, onSome: (v: T) => U, onNone: () => U): U =>
  isSome(m) ? onSome(m.value) : onNone()
