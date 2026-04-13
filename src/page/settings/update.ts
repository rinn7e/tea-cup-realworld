import { Cmd } from 'tea-cup-fp';
import type { Model, Msg } from './type';
import { updateUser } from '../../api/service';
import { attemptTE } from '../../tea/util';
import type { User } from '../../api/type';
import * as TE from 'fp-ts/lib/TaskEither';

export const init = (user: User): [Model, Cmd<Msg>] => {
  return [
    {
      image: user.image || '',
      username: user.username,
      bio: user.bio || '',
      email: user.email,
      password: '',
      errors: null,
      submitting: false,
    },
    Cmd.none(),
  ];
};

export const update = (token: string) => (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SetImage':
      return [{ ...model, image: msg.value }, Cmd.none()];
    case 'SetUsername':
      return [{ ...model, username: msg.value }, Cmd.none()];
    case 'SetBio':
      return [{ ...model, bio: msg.value }, Cmd.none()];
    case 'SetEmail':
      return [{ ...model, email: msg.value }, Cmd.none()];
    case 'SetPassword':
      return [{ ...model, password: msg.value }, Cmd.none()];
    case 'Logout':
      // Handled by main update
      return [model, Cmd.none()];
    case 'Submit': {
      const userUpdate: any = {
        image: model.image,
        username: model.username,
        bio: model.bio,
        email: model.email,
      };
      if (model.password) {
        userUpdate.password = model.password;
      }

      return [
        { ...model, submitting: true, errors: null },
        attemptTE(
          updateUser(userUpdate, token) as TE.TaskEither<any, any>,
          (result): Msg => ({ _tag: 'SubmitResponse', result: result as any })
        ),
      ];
    }
    case 'SubmitResponse':
      if (msg.result.tag === 'Ok') {
        return [{ ...model, submitting: false }, Cmd.none()];
      } else {
        const err = msg.result.err;
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
