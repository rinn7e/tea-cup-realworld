import { Link } from './Link';
import { homePage } from '../data/route';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 mt-12 border-t">
      <div className="container mx-auto px-4 text-center">
        <Link route={{ page: homePage() }} className="text-brand-primary font-bold text-lg">conduit</Link>
        <span className="ml-2 text-gray-400 text-sm">
          © 2026. An interactive learning project from <a href="https://thinkster.io" className="hover:underline" target="_blank" rel="noopener noreferrer">Thinkster</a>. Code & design licensed under MIT.
        </span>
      </div>
    </footer>
  );
};
