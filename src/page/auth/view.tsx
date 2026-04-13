import React from 'react';
import type { Model, Msg } from './type';

interface Props {
  model: Model;
  dispatch: (msg: Msg) => void;
}

export const AuthView: React.FC<Props> = ({ model, dispatch }) => {
  const title = model.isRegister ? 'Sign up' : 'Sign in';
  const linkText = model.isRegister ? 'Have an account?' : 'Need an account?';
  const linkHref = model.isRegister ? '/login' : '/register';

  return (
    <div className="auth-page">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <h1 className="text-4xl text-center mb-2">{title}</h1>
            <p className="text-center mb-6">
              <a href={linkHref} className="text-brand-primary hover:underline">{linkText}</a>
            </p>

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
                {model.isRegister && (
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:border-brand-primary outline-none text-lg"
                    type="text"
                    placeholder="Username"
                    value={model.username}
                    onChange={(e) => dispatch({ _tag: 'SetUsername', value: e.target.value })}
                    disabled={model.submitting}
                  />
                )}
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:border-brand-primary outline-none text-lg"
                  type="email"
                  placeholder="Email"
                  value={model.email}
                  onChange={(e) => dispatch({ _tag: 'SetEmail', value: e.target.value })}
                  disabled={model.submitting}
                />
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:border-brand-primary outline-none text-lg"
                  type="password"
                  placeholder="Password"
                  value={model.password}
                  onChange={(e) => dispatch({ _tag: 'SetPassword', value: e.target.value })}
                  disabled={model.submitting}
                />
                <button
                  className="btn btn-lg bg-brand-primary text-white px-6 py-3 rounded float-right hover:bg-opacity-90 transition-colors text-xl font-light"
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
