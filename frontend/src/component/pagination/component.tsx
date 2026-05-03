import { cn } from '@rinn7e/tea-cup-prelude'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import { memoStrategy } from '@/common/util'

import { type Props, mkPropsEq } from './type'

export const PaginationComponent = <Item, ItemMsg>({
  model,
  dispatch,
  config,
}: Props<Item, ItemMsg>) => {
  const { page, pageAmount } = model

  return (
    <div className='flex flex-col'>
      {config.renderItems(model.items, (item, msg) => {
        dispatch({ _tag: 'ItemMsg', item, msg })
      })}

      {renderPagination(page, pageAmount, (p) =>
        dispatch({ _tag: 'ChangePage', page: p }),
      )}
    </div>
  )
}

const renderPagination = (
  currentPage: number,
  pageAmount: number,
  onPageChange: (page: number) => void,
) => {
  if (pageAmount <= 1) {
    return null
  }

  const pages: ReadonlyArray<number | string> = pipe(pageAmount, (amount) => {
    if (amount <= 7) {
      return Array.from({ length: amount }, (_, i) => i + 1)
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', amount]
    }
    if (currentPage >= amount - 3) {
      return [1, '...', amount - 4, amount - 3, amount - 2, amount - 1, amount]
    }
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      amount,
    ]
  })

  return (
    <nav className='my-[24px]' data-test='pagination-nav'>
      <ul className='flex w-fit flex-wrap rounded-md border border-gray-200'>
        {pages.map((p, index) => {
          if (p === '...') {
            return (
              <li
                key={`ellipsis-${index}`}
                className='border-r border-gray-200 last:border-r-0'
              >
                <span className='flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm text-gray-500'>
                  ...
                </span>
              </li>
            )
          }

          const pageNum = p as number
          return (
            <li
              key={pageNum}
              className='border-r border-gray-200 last:border-r-0'
              data-test='pagination-item'
            >
              <button
                type='button'
                className={cn(
                  'flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm transition-colors duration-200 hover:bg-gray-100 focus:outline-none',
                  pageNum === currentPage
                    ? 'bg-gray-200 font-medium text-gray-700'
                    : 'text-green-600',
                )}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export const PaginationMemo = memoStrategy(
  PaginationComponent,
  (prev, next) => {
    const propEq = mkPropsEq(prev.itemEq)
    return propEq.equals(prev, next)
  },
) as <Item, ItemMsg>(props: Props<Item, ItemMsg>) => React.ReactElement
