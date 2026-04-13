import React from 'react';
import type { Model, Msg } from './type';

interface Props {
  model: Model;
  dispatch: (msg: Msg) => void;
}

export const EditorView: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div className="editor-page">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-3/4 lg:w-2/3">
            {model.errors && (
              <ul className="error-messages text-red-500 mb-4 list-disc list-inside">
                {Object.entries(model.errors.errors).map(([field, messages]) => (
                  <li key={field}>
                    {field} {messages.join(', ')}
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={(e) => { e.preventDefault(); dispatch({ _tag: 'Submit' }); }}>
              <fieldset className="space-y-4">
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:border-brand-primary outline-none text-xl font-light"
                  type="text"
                  placeholder="Article Title"
                  value={model.title}
                  onChange={(e) => dispatch({ _tag: 'SetTitle', value: e.target.value })}
                  disabled={model.submitting}
                />
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:border-brand-primary outline-none"
                  type="text"
                  placeholder="What's this article about?"
                  value={model.description}
                  onChange={(e) => dispatch({ _tag: 'SetDescription', value: e.target.value })}
                  disabled={model.submitting}
                />
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:border-brand-primary outline-none"
                  rows={8}
                  placeholder="Write your article (in markdown)"
                  value={model.body}
                  onChange={(e) => dispatch({ _tag: 'SetBody', value: e.target.value })}
                  disabled={model.submitting}
                ></textarea>
                
                <div>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:border-brand-primary outline-none mb-2"
                    type="text"
                    placeholder="Enter tags"
                    value={model.tagInput}
                    onChange={(e) => dispatch({ _tag: 'SetTagInput', value: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        dispatch({ _tag: 'AddTag' });
                      }
                    }}
                    disabled={model.submitting}
                  />
                  <div className="tag-list flex flex-wrap gap-2">
                    {model.tagList.map(tag => (
                      <span key={tag} className="tag-default tag-pill bg-gray-500 text-white px-2 py-1 rounded-full text-sm">
                        <i className="ion-close-round mr-1 cursor-pointer" onClick={() => dispatch({ _tag: 'RemoveTag', tag })}></i>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className="btn btn-lg bg-brand-primary text-white px-8 py-3 rounded float-right hover:bg-opacity-90 transition-colors text-xl font-light"
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
