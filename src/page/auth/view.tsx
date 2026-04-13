import React from "react";
import type { Model, Msg } from "./type";
import type { Route } from "../../type";
import { Link } from "../../component/Link";
import { FormItemMemo } from "@rinn7e/tea-cup-form";

interface Props {
  model: Model;
  dispatch: (msg: Msg) => void;
}

export const AuthView: React.FC<Props> = ({ model, dispatch }) => {
  const title = model.isRegister ? "Sign up" : "Sign in";
  const linkText = model.isRegister ? "Have an account?" : "Need an account?";
  const loginRoute: Route = { page: { _tag: "LoginPage" } };
  const registerRoute: Route = { page: { _tag: "RegisterPage" } };
  const route = model.isRegister ? loginRoute : registerRoute;

  return (
    <div className="auth-page">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <h1 className="text-4xl text-center mb-2">{title}</h1>
            <p className="text-center mb-6">
              <Link
                route={route}
                className="text-brand-primary hover:underline"
              >
                {linkText}
              </Link>
            </p>

            {model.errors && (
              <ul className="error-messages text-red-500 mb-4 list-disc list-inside">
                {Object.entries(model.errors.errors).map(
                  ([field, messages]) => (
                    <li key={field}>
                      {field} {(messages as string[]).join(", ")}
                    </li>
                  ),
                )}
              </ul>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch({ _tag: "Submit" });
              }}
            >
              <fieldset>
                {model.isRegister && (
                  <FormItemMemo
                    field="username"
                    model={model.signupForm}
                    dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                  />
                )}
                <FormItemMemo
                  field="email"
                  model={model.isRegister ? model.signupForm : model.loginForm}
                  dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                />
                <FormItemMemo
                  field="password"
                  model={model.isRegister ? model.signupForm : model.loginForm}
                  dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                />
                <button
                  className="btn btn-lg bg-brand-primary text-white px-6 py-3 rounded float-right hover:bg-opacity-90 transition-colors text-xl font-light mt-4"
                  type="submit"
                  disabled={model.submitting}
                >
                  {title}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
