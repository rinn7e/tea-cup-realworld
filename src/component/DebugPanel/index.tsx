import React from 'react';
import { createPortal } from 'react-dom';
import type { Model, Msg } from './type';
import { Cog6ToothIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface Props {
  model: Model;
  dispatch: (msg: Msg) => void;
}

export const DebugPanel: React.FC<Props> = ({ model, dispatch }) => {
  const clearCacheAndReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  const panelContent = (
    <div className={`fixed bottom-4 right-4 z-[9999] transition-all duration-300 ease-in-out ${model.isCollapse ? 'w-12 h-12' : 'w-64'}`}>
      {model.isCollapse ? (
        <button
          onClick={() => dispatch({ _tag: 'ToggleCollapse' })}
          className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-black transition-colors"
          title="Open Debug Panel"
        >
          <Cog6ToothIcon className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
          <div className="p-4 flex items-center justify-between border-b border-gray-800">
            <h3 className="font-bold flex items-center gap-2">
              <Cog6ToothIcon className="w-5 h-5 text-brand-primary" />
              Debug Panel
            </h3>
            <button
              onClick={() => dispatch({ _tag: 'ToggleCollapse' })}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Shortcuts</p>
              <button
                onClick={clearCacheAndReload}
                className="w-full group flex items-center gap-3 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <ArrowPathIcon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Clear & Reload</p>
                  <p className="text-[10px] text-gray-400">Clears localStorage</p>
                </div>
              </button>
            </div>
          </div>
          <div className="px-4 py-3 bg-black/50 text-[10px] text-gray-600 flex justify-between items-center">
            <span>TEA RealWorld Debug</span>
            <span className="bg-gray-800 px-1.5 py-0.5 rounded">v0.1.0</span>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(panelContent, document.body);
};
