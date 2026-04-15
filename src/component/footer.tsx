import { homePage } from '../data/route'
import { Link } from './link'

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className='container'>
        <Link route={{ page: homePage() }} className='logo-font'>
          conduit
        </Link>
        <span className='attribution'>
          An interactive learning project from{' '}
          <a
            href='https://thinkster.io'
            target='_blank'
            rel='noopener noreferrer'
          >
            Thinkster
          </a>
          . Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  )
}
