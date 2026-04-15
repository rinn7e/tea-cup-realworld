export type Model = {
  isCollapse: boolean
}

export type Msg = { _tag: 'ToggleCollapse' }

export const init = (): Model => ({
  isCollapse: true,
})

export const update = (msg: Msg, model: Model): Model => {
  switch (msg._tag) {
    case 'ToggleCollapse':
      return { ...model, isCollapse: !model.isCollapse }
  }
}
