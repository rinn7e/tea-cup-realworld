import { homePage } from '../data/route'
import { Link } from './link'

export const Footer: React.FC = () => {
  return (
    <footer className='mt-12 border-t bg-gray-100 py-8'>
      <div className='container mx-auto px-4 text-center'>
        <Link
          route={{ page: homePage() }}
          className='text-brand-primary text-lg font-bold'
        >
          conduit
        </Link>
        <span className='ml-2 text-sm text-gray-400'>
          © 2026. An interactive learning project from{' '}
          <a
            href='https://thinkster.io'
            className='hover:underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            Thinkster
          </a>
          . Code & design licensed under MIT.
        </span>
      </div>
    </footer>
  )
}
