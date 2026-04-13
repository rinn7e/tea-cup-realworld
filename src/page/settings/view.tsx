import React from "react";
import type { Model, Msg } from "./type";
import { FormItemMemo } from "@rinn7e/tea-cup-form";

interface Props {
  model: Model;
  dispatch: (msg: Msg) => void;
}

export const SettingsView: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div className="settings-page">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl text-center mb-6">Your Settings</h1>

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
                <FormItemMemo
                  field="image"
                  model={model.form}
                  dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                />
                <FormItemMemo
                  field="username"
                  model={model.form}
                  dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                />
                <FormItemMemo
                  field="bio"
                  model={model.form}
                  dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                />
                <FormItemMemo
                  field="email"
                  model={model.form}
                  dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                />
                <FormItemMemo
                  field="password"
                  model={model.form}
                  dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                />
                <button
                  className="btn btn-lg bg-brand-primary text-white px-6 py-3 rounded float-right hover:bg-opacity-90 transition-colors text-lg"
                  type="submit"
                  disabled={model.submitting}
                >
                  Update Settings
                </button>
              </fieldset>
            </form>

            <hr className="my-12 border-gray-200" />

            <button
              className="btn border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors"
              onClick={() => dispatch({ _tag: "Logout" })}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
