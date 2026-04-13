/*
 * MIT License
 *
 * Copyright (c) 2025 Moremi Vannak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { useContext, type AnchorHTMLAttributes } from 'react'

import { SetGlobalMsgContext } from '@/component/global-context'
import { toUrlString, type AppRoute } from '@/data/route'

// Trigger on click, if the user left click normally
// If the user right click, or do other operation, use the href value
export const Link = (
  props: AnchorHTMLAttributes<HTMLAnchorElement> & {
    route?: AppRoute
  },
) => {
  const setGlobalMsg = useContext(SetGlobalMsgContext)
  const { route, ...aProps } = props
  const hrefProps = route ? { href: toUrlString(route) } : undefined
  return (
    <a
      {...aProps}
      {...hrefProps}
      onClick={(e) => {
        const isModifiedClick =
          e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey

        if (!isModifiedClick && route) {
          // left-click in the same tab
          e.preventDefault()
          setGlobalMsg({ _tag: 'ChangeRoute', route })
        }
      }}
    ></a>
  )
}
