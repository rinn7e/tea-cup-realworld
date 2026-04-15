import { homePage } from '../data/route'
import { Link } from './link'

export const Footer: React.FC = () => {
  return (
    <footer className='border-t border-gray-100 bg-gray-50 py-6'>
      <div className='mx-auto max-w-6xl px-4 flex flex-col items-center gap-1 text-center sm:flex-row sm:justify-between'>
        <Link route={{ page: homePage() }} className='text-sm font-bold text-green-600'>
          conduit
        </Link>
        <span className='text-xs text-gray-400'>
          An interactive learning project from{' '}
          <a
            href='https://thinkster.io'
            target='_blank'
            rel='noopener noreferrer'
            className='underline hover:text-gray-600'
          >
            Thinkster
          </a>
          . Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  )
}
