import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import type * as TE from 'fp-ts/lib/TaskEither'
import * as N from 'fp-ts/lib/number'
import { type ReactNode } from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type HttpError,
  getHttpErrorEq,
} from '@/common/api'

export type Config<Item, ItemMsg> = {
  handler: (
    offset: number,
    limit: number,
  ) => TE.TaskEither<HttpError<ApiError>, { items: Item[]; totalCount: number }>
  renderItems: (
    items: RD.RemoteData<HttpError<ApiError>, Item[]>,
    itemDispatch: (item: Item, msg: ItemMsg) => void,
  ) => ReactNode
  limit: number
}

export type Model<Item> = {
  items: RD.RemoteData<HttpError<ApiError>, Item[]>
  page: number
  pageAmount: number
}

export const mkModelEq = <Item>(
  itemEq: EqClass.Eq<Item>,
): EqClass.Eq<Model<Item>> =>
  EqClass.struct<Model<Item>>({
    items: RD.getEq(getHttpErrorEq(ApiErrorEq), A.getEq(itemEq)),
    page: N.Eq,
    pageAmount: N.Eq,
  })

export type Msg<Item, ItemMsg> =
  | { _tag: 'ChangePage'; page: number }
  | {
      _tag: 'FetchResponse'
      page: number
      result: RD.RemoteData<
        HttpError<ApiError>,
        { items: Item[]; totalCount: number }
      >
    }
  | { _tag: 'ItemMsg'; msg: ItemMsg; item: Item }
  | { _tag: 'NoOp' }

export type Props<Item, ItemMsg> = {
  model: Model<Item>
  dispatch: Dispatcher<Msg<Item, ItemMsg>>
  config: Config<Item, ItemMsg>
  itemEq: EqClass.Eq<Item>
}

export const mkPropsEq = <Item, ItemMsg>(
  itemEq: EqClass.Eq<Item>,
): EqClass.Eq<Props<Item, ItemMsg>> =>
  EqClass.struct({
    model: mkModelEq(itemEq),
    dispatch: EqAlways,
    config: EqAlways,
    itemEq: EqAlways,
  })
