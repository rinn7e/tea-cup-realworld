export const errorTextView = ({ label }: { label: string }) => {
  return (
    <ul className='error-messages'>
      <li> {label}</li>
    </ul>
  )
}
