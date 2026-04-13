import { Cmd } from 'tea-cup-fp';
import type { Model, Msg } from './type';
import { login, register } from '../../api/service';
import { attemptTE } from '../../tea/util';
import * as TE from 'fp-ts/lib/TaskEither';

export const init = (isRegister: boolean): [Model, Cmd<Msg>] => {
  return [
    {
      isRegister,
      username: '',
      email: '',
      password: '',
      errors: null,
      submitting: false,
    },
    Cmd.none(),
  ];
};

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SetUsername':
      return [{ ...model, username: msg.value }, Cmd.none()];
    case 'SetEmail':
      return [{ ...model, email: msg.value }, Cmd.none()];
    case 'SetPassword':
      return [{ ...model, password: msg.value }, Cmd.none()];
    case 'Submit': {
      const authTask = model.isRegister
        ? register({ username: model.username, email: model.email, password: model.password })
        : login({ email: model.email, password: model.password });

      return [
        { ...model, submitting: true, errors: null },
        attemptTE(authTask as TE.TaskEither<any, any>, (result): Msg => ({ _tag: 'SubmitResponse', result: result as any })),
      ];
    }
    case 'SubmitResponse':
      if (msg.result.tag === 'Ok') {
        // Success handled by main update (SetUser and redirect)
        return [{ ...model, submitting: false }, Cmd.none()];
      } else {
        const err = msg.result.err;
        // Basic error handling for now
        return [
          {
            ...model,
            submitting: false,
            errors: (err as any).errors ? (err as any) : { errors: { 'error': [String(err)] } }
          },
          Cmd.none()
        ];
      }
  }
};
