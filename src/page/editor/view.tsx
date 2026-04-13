import React from "react";
import type { Model, Msg } from "./type";
import { FormItemMemo } from "@rinn7e/tea-cup-form";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  model: Model;
  dispatch: (msg: Msg) => void;
}

export const EditorView: React.FC<Props> = ({ model, dispatch }) => {
  // We need to pass the dispatcher to the form items
  // To handle onKeyDown that needs AddTag, we can either:
  // 1. Have initialized it in the model (done in update.ts but with mock)
  // 2. Here, we can map the forms to include the real dispatcher if needed,
  //    but FormItemMemo just takes the model as is.

  // Since we want to handle 'Enter' for tags, and our update.ts init'ed it with a mock,
  // we might need to update the model with the real dispatcher here or just let it be.
  // Actually, the 'dispatch' in update.ts init was () => {}.
  // Let's just handle 'AddTag' in the update loop by checking a message if we can't get the closure right.
  // But wait, our FormFields.tsx calls props.onKeyDown.value(e).

  return (
    <div className="editor-page">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-3/4 lg:w-2/3">
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
                <div className="mb-4">
                  <FormItemMemo
                    field="title"
                    model={model.form}
                    dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                  />
                </div>
                <div className="mb-4">
                  <FormItemMemo
                    field="description"
                    model={model.form}
                    dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                  />
                </div>
                <div className="mb-4">
                  <FormItemMemo
                    field="body"
                    model={model.form}
                    dispatch={(msg) => dispatch({ _tag: "FormMsg", msg })}
                  />
                </div>

                <div className="mb-4">
                  <FormItemMemo
                    field="tagInput"
                    model={model.form}
                    dispatch={(msg) => {
                      // We can intercept messages here, but onKeyDown is not a message in tea-cup-form
                      dispatch({ _tag: "FormMsg", msg });
                    }}
                  />

                  <div className="tag-list flex flex-wrap gap-2 mt-2">
                    {model.tagList.map((tag) => (
                      <span
                        key={tag}
                        className="tag-default tag-pill bg-gray-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <XMarkIcon
                          className="w-4 h-4 ml-2 cursor-pointer hover:text-red-300"
                          onClick={() => dispatch({ _tag: "RemoveTag", tag })}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className="btn btn-lg bg-brand-primary text-white px-8 py-3 rounded float-right hover:bg-opacity-90 transition-colors text-xl font-light mt-4"
                  type="submit"
                  disabled={model.submitting}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
