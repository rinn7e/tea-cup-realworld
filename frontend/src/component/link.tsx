import React, { useContext } from 'react'

import { toUrlString } from '../data/route'
import type { Route } from '../type'
import { SetGlobalMsgContext } from './global-context'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  route: Route
  className?: string
  children: React.ReactNode
}

export const Link: React.FC<Props> = ({
  route,
  className,
  children,
  ...rest
}) => {
  const setGlobalMsg = useContext(SetGlobalMsgContext)
  const href = toUrlString(route)

  return (
    <a
      {...rest}
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        setGlobalMsg({ _tag: 'ChangeRoute', route })
      }}
    >
      {children}
    </a>
  )
}
