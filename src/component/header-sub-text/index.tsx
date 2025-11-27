export const headerSubTextView = ({
  label,
  href,
}: {
  label: string
  href: string
}) => {
  return (
    <p className='text-xs-center'>
      <a href={href}>{label}</a>
    </p>
  )
}
