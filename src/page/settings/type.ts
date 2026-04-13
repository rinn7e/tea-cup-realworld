import type { UserResponse, Errors } from "../../api/type";
import type { Result } from "tea-cup-fp";
import * as Form from "@rinn7e/tea-cup-form/lib/update";

export type Model = {
  form: Form.Model;
  errors: Errors | null;
  submitting: boolean;
};

export type Msg =
  | { _tag: "FormMsg"; msg: Form.Msg }
  | { _tag: "Submit" }
  | { _tag: "SubmitResponse"; result: Result<Error | Errors, UserResponse> }
  | { _tag: "Logout" };
