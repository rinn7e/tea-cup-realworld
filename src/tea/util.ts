import type { Either } from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { identity } from 'fp-ts/lib/function'
import { Cmd, type Result, Task } from 'tea-cup-fp'

export const msgCmd = <msg>(msg: msg): Cmd<msg> =>
  Task.perform(Task.succeed(msg), identity)

export const taskFromTE = <E, R>(te: TE.TaskEither<E, R>): Task<E, R> => {
  return Task.fromPromise(te).andThen((res: Either<E, R>) => {
    if (res._tag === 'Right') {
      return Task.succeed(res.right)
    } else {
      return Task.fail(res.left)
    }
  }) as Task<E, R>
}

export const attemptTE = <E, R, M>(
  te: TE.TaskEither<E, R>,
  toMsg: (r: Result<E, R>) => M,
) => Task.attempt(taskFromTE(te), toMsg)
