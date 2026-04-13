import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 mt-12 border-t">
      <div className="container mx-auto px-4 text-center">
        <a href="/" className="text-brand-primary font-bold text-lg">conduit</a>
        <span className="ml-2 text-gray-400 text-sm">
          © 2026. An interactive learning project from <a href="https://thinkster.io" className="hover:underline">Thinkster</a>. Code & design licensed under MIT.
        </span>
      </div>
    </footer>
  );
};
