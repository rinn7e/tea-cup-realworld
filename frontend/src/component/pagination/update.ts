import * as RD from '@devexperts/remote-data-ts'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import { Cmd } from 'tea-cup-fp'

import { scrollToTopCmd } from '@/common/util'

import { type Config, type Model, type Msg } from './type'

export const init = <Item, ItemMsg>(
  config: Config<Item, ItemMsg>,
  page: number = 1,
): [Model<Item>, Cmd<Msg<Item, ItemMsg>>] => {
  const model: Model<Item> = {
    items: RD.pending,
    page,
    pageAmount: 0,
  }

  return [model, fetchCmd(config, page)]
}

export const update =
  <Item, ItemMsg>(config: Config<Item, ItemMsg>) =>
  (
    msg: Msg<Item, ItemMsg>,
    model: Model<Item>,
  ): [Model<Item>, Cmd<Msg<Item, ItemMsg>>] => {
    switch (msg._tag) {
      case 'ChangePage': {
        if (msg.page === model.page) {
          return [model, Cmd.none()]
        }
        return [
          {
            ...model,
            page: msg.page,
            // No need to display loading when changing pagination page
            items: RD.pending,
          },
          Cmd.batch([fetchCmd(config, msg.page), scrollToTopCmd()]),
        ]
      }
      case 'FetchResponse': {
        if (msg.page !== model.page) {
          // Ignore responses for old pages
          return [model, Cmd.none()]
        }
        if (msg.result._tag === 'RemoteSuccess') {
          return [
            {
              ...model,
              items: RD.success(msg.result.value.items),
              pageAmount: Math.ceil(msg.result.value.totalCount / config.limit),
            },
            scrollToTopCmd(),
          ]
        } else if (msg.result._tag === 'RemoteFailure') {
          return [{ ...model, items: RD.failure(msg.result.error) }, Cmd.none()]
        }
        return [model, Cmd.none()]
      }
      case 'ItemMsg':
        // Parent is expected to handle ItemMsg by intercepting it in its own update
        return [model, Cmd.none()]
      case 'NoOp':
        return [model, Cmd.none()]
    }
  }

const fetchCmd = <Item, ItemMsg>(
  config: Config<Item, ItemMsg>,
  page: number,
): Cmd<Msg<Item, ItemMsg>> => {
  const offset = (page - 1) * config.limit
  const limit = config.limit
  return attemptTE(config.handler(offset, limit), (result): Msg<Item, ItemMsg> => {
    if (result.tag === 'Ok') {
      return {
        _tag: 'FetchResponse',
        page,
        result: RD.success(result.value),
      }
    } else {
      return {
        _tag: 'FetchResponse',
        page,
        result: RD.failure(result.err),
      }
    }
  })
}
