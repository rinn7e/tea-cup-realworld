import type { UserResponse, Errors } from '../../api/type';
import type { Result } from 'tea-cup-fp';

export type Model = {
  isRegister: boolean;
  username: string;
  email: string;
  password: string;
  errors: Errors | null;
  submitting: boolean;
};

export type Msg =
  | { _tag: 'SetUsername'; value: string }
  | { _tag: 'SetEmail'; value: string }
  | { _tag: 'SetPassword'; value: string }
  | { _tag: 'Submit' }
  | { _tag: 'SubmitResponse'; result: Result<Error | Errors, UserResponse> };
