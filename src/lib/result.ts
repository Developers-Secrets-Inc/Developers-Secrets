export type Result<T, E> = { _tag: 'success'; value: T } | { _tag: 'failure'; error: E }

export const success = <T>(value: T): Result<T, never> => ({ _tag: 'success', value })
export const failure = <E>(error: E): Result<never, E> => ({ _tag: 'failure', error })

export const isSuccess = <T, E>(result: Result<T, E>): result is { _tag: 'success'; value: T } =>
  result._tag === 'success'

export const isFailure = <T, E>(result: Result<T, E>): result is { _tag: 'failure'; error: E } =>
  result._tag === 'failure'

export const map = <T, E, U>(result: Result<T, E>, f: (value: T) => U): Result<U, E> => {
  if (isSuccess(result)) {
    return success(f(result.value))
  }
  return result
}

export const flatMap = <T, E, U, F>(
  result: Result<T, E>,
  f: (value: T) => Result<U, F>,
): Result<U, E | F> => {
  if (isSuccess(result)) {
    return f(result.value)
  }
  return result
}

export const match = <T, E, U>(
  result: Result<T, E>,
  onSuccess: (value: T) => U,
  onFailure: (error: E) => U,
): U => {
  if (isSuccess(result)) {
    return onSuccess(result.value)
  }
  return onFailure(result.error)
}

export const mapAsync = async <T, E, U>(
  result: Result<T, E>,
  f: (value: T) => Promise<U>,
): Promise<Result<U, E>> => {
  if (isSuccess(result)) {
    return success(await f(result.value))
  }
  return failure(result.error)
}

export const flatMapAsync = async <T, E, U, F>(
  result: Result<T, E>,
  f: (value: T) => Promise<Result<U, F>>,
): Promise<Result<U, E | F>> => {
  if (isSuccess(result)) {
    return await f(result.value)
  }
  return failure(result.error)
}
